import { SessionRepository } from '../infrastructure/session.repository';
import { JwtService } from '../infrastructure/jwt.service';
import { UsersService } from '../../users/application/users.service';
import { Injectable } from '@nestjs/common';
import { Session } from '../../sessions/domain/session.schema';
import { randomUUID } from 'crypto';
const jwt = require('jsonwebtoken');
@Injectable()
export class AuthService {
  constructor(
    protected usersService: UsersService,
    protected sessionRepository: SessionRepository,
    protected jwtService: JwtService,
  ) {}

  async loginTokensPair(
    loginOrEmail: string,
    password: string,
    ip: string,
    title: string,
  ) {
    const userId = await this.usersService.checkCredentials(
      loginOrEmail,
      password,
    );
    if (!userId) return null;
    const oldSession = await this.sessionRepository.getSessionForLogin(
      userId,
      title,
    );
    const deviceId = oldSession?.deviceId || randomUUID();
    if (oldSession) {
      await this.sessionRepository.deleteById(oldSession._id);
    }

    const accessToken = await this.jwtService.createJWT(userId);
    if (!accessToken) return null;

    const refreshToken = await this.jwtService.createRefreshJWT(
      userId,
      deviceId,
      // ip,
      // title,
    );
    if (!refreshToken) return null;
    const decoded = jwt.decode(refreshToken, { complete: true });
    const iat = await this.jwtService.getIatFromToken(refreshToken);
    const tokenMetaData: Session = {
      iat,
      deviceId,
      expireDate: decoded.payload.exp,
      userId,
      ip,
      title,
    };
    const setTokenMetaData =
      await this.sessionRepository.createNewSession(tokenMetaData);
    if (!setTokenMetaData) return null;
    return { accessToken, refreshToken };
  }
}
