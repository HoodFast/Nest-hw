import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './input/login.dto';
import { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { RegistrationUserDto } from './input/registration.user.input';
import { UsersService } from '../../users/application/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
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
  @Post('registration')
  async registration(@Body() data: RegistrationUserDto) {
    const { login, email, password } = data;
    const user = await this.usersService.createUser(login, email, password);
    return;
  }
}
