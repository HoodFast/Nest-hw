import { ObjectId } from 'mongodb';
import { appConfig } from '../../base/config/appConfig';
import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';
import { SessionRepository } from '../../sessions/infrastructure/session.repository';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { Session } from '../../sessions/domain/session.schema';
import { UsersRepository } from '../../users/infrastructure/users.repository';
const jwt = require('jsonwebtoken');

@Injectable()
export class JwtService {
  constructor(
    private sessionRepository: SessionRepository,
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
  ) {}
  async createJWT(userId: ObjectId): Promise<string> {
    const token = jwt.sign({ userId }, appConfig.AC_SECRET, {
      expiresIn: appConfig.AC_TIME,
    });
    return token;
  }
  async createRefreshJWT(
    userId: ObjectId,
    deviceId: string = randomUUID(),
    ip: string,
    title: string,
  ): Promise<string | null> {
    const token = jwt.sign({ userId, deviceId }, appConfig.RT_SECRET, {
      expiresIn: appConfig.RT_TIME,
    });
    const decoded = jwt.decode(token, { complete: true });
    const iat = new Date(decoded.payload.iat * 1000);
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
    return token;
  }
  async getIatFromToken(refreshToken: string): Promise<Date> {
    const decoded = await jwt.decode(refreshToken, { complete: true });
    const iat = new Date(decoded.payload.iat * 1000);
    return iat;
  }
  async createRecoveryCode(email: string) {
    try {
      const user = await this.usersQueryRepository.findUser(email);
      const token = jwt.sign({ userId: user?._id }, appConfig.RECOVERY_SECRET, {
        expiresIn: appConfig.RECOVERY_TIME,
      });
      return token;
    } catch (e) {}
  }
  async getUserIdByRecoveryCode(code: string): Promise<string> {
    const decoded = await jwt.decode(code, { complete: true });
    return decoded.payload.userId;
  }
  async checkRefreshToken(token: string) {
    try {
      const result = jwt.verify(token, appConfig.RT_SECRET);
      const blackListCheck = await this.usersRepository.blackListCheck(
        result.userId,
        token,
      );
      if (blackListCheck) return null;
      const user = await this.usersRepository.getUserById(result.userId);
      return user;
    } catch (err) {
      return null;
    }
  }

  async getSessionDataByToken(token: string) {
    try {
      const result = jwt.verify(token, appConfig.RT_SECRET);
      const decoded = jwt.decode(token, { complete: true });
      const userId = decoded.payload.userId;
      const iat = new Date(decoded.payload.iat * 1000);
      const deviceId = result.deviceId;
      return { iat, deviceId, userId };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
