import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/application/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginOrEmail: string, pass: string) {
    const user = await this.usersService.findUser(loginOrEmail);
    const passwordHash = `create a hash ${pass} + salt}`;
    if (!user) return null;
    if (user?.accountData._passwordHash !== passwordHash) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.accountData.login, sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
