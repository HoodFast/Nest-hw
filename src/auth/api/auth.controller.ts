import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './input/login.dto';
import { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { RegistrationUserDto } from './input/registration.user.input';
import { UsersService } from '../../users/application/users.service';
import { Limiter } from '../../guards/limitter.guard';
import { recoveryPass } from './input/recovery.password.input';
import { recoveryPassInputDto } from './input/new.password.input';
import { JwtService } from '../infrastructure/jwt.service';
import { AccessTokenAuthGuard } from '../../guards/access.token.auth.guard';
import { UserId } from '../../decorators/userId';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}
  @UseGuards(Limiter)
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const title = req.headers['user-agent'] || 'none title';
    const ip = req.ip || 'none ip';

    const tokens = await this.authService.loginTokensPair(
      body.loginOrEmail,
      body.password,
      ip,
      title,
    );
    if (!tokens) return null;
    const { accessToken, refreshToken } = tokens;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken };
  }
  @UseGuards(Limiter)
  @HttpCode(204)
  @Post('registration')
  async registration(@Body() data: RegistrationUserDto) {
    const { login, email, password } = data;
    return this.usersService.createUser(login, email, password);
  }
  @UseGuards(Limiter)
  @HttpCode(204)
  @Post('registration-confirmation')
  async emailConfirmation(@Body() data: { code: string }) {
    await this.authService.confirmEmail(data.code);
    return;
  }
  @UseGuards(Limiter)
  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() data: recoveryPass) {
    const email = data.email;
    await this.authService.sendRecovery(email);
    return;
  }
  @UseGuards(Limiter)
  @HttpCode(204)
  @Post('new-password')
  async newPassword(@Body() data: recoveryPassInputDto) {
    const changePass = await this.usersService.changePass(data);
    return changePass;
  }
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const title = req.headers['user-agent'] || 'none title';
    const ip = req.ip || 'none ip';
    const token = req.cookies.refreshToken;
    const user = await this.jwtService.checkRefreshToken(token);
    if (!user) throw new UnauthorizedException();

    const tokens = await this.authService.refreshTokensPair(
      user,
      ip,
      title,
      token,
    );
    const { accessToken, refreshToken } = tokens;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken };
  }
  @UseGuards(Limiter)
  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() email: string) {
    await this.authService.resendConfirmationCode(email);
    return;
  }
  @UseGuards(AccessTokenAuthGuard)
  @Get('me')
  async getMe(@UserId() userId: string) {
    const me = await this.usersQueryRepository.getMe(userId);
    if (!me) throw new UnauthorizedException();
    return {
      userId: me._id,
      login: me.accountData.login,
      email: me.accountData.email,
    };
  }
}
