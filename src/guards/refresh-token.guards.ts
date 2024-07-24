import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../auth/infrastructure/jwt.service';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken =
      request.cookies.refreshToken || request.body.refreshToken;

    if (!refreshToken)
      throw new UnauthorizedException(
        `RefreshTokenGuard - dont find token in cookies and body`,
      );
    const jwtPayload = await this.jwtService.verifyRefreshToken(refreshToken);

    if (!jwtPayload)
      throw new UnauthorizedException('RefreshTokenGuard - token don`t verify');
    const user = await this.usersQueryRepository.getUserById(jwtPayload.userId);
    if (!user)
      throw new UnauthorizedException('RefreshTokenGuard - user not found');
    request.userId = user.id;
    request.refreshToken = jwtPayload;
    return true;
  }
}
