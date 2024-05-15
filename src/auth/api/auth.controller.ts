import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './input/login.dto';
import e, { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { RegistrationUserDto } from './input/registration.user.input';
import { UsersService } from '../../users/application/users.service';
import { Limiter } from '../../guards/limitter.guard';
import { recoveryPass } from './input/recovery.password.input';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
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
}
