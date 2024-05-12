import { ObjectId } from 'mongodb';
import { appConfig } from '../../base/config/appConfig';
import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';
import { SessionRepository } from './session.repository';
const jwt = require('jsonwebtoken');

@Injectable()
export class JwtService {
  constructor(private sessionRepository: SessionRepository) {}
  async createJWT(userId: ObjectId): Promise<string> {
    const token = jwt.sign({ userId }, appConfig.AC_SECRET, {
      expiresIn: appConfig.AC_TIME,
    });
    return token;
  }
  async createRefreshJWT(
    userId: ObjectId,
    deviceId: string = randomUUID(),
    // ip: string,
    // title: string,
  ): Promise<string> {
    const token = jwt.sign({ userId, deviceId }, appConfig.RT_SECRET, {
      expiresIn: appConfig.RT_TIME,
    });
    // const decoded = jwt.decode(token, { complete: true });
    // const iat = new Date(decoded.payload.iat * 1000);
    // const tokenMetaData: Session = {
    //   iat,
    //   deviceId,
    //   expireDate: decoded.payload.exp,
    //   userId,
    //   ip,
    //   title,
    // };
    // const setTokenMetaData =
    //   await this.sessionRepository.createNewSession(tokenMetaData);
    // if (!setTokenMetaData) return null;
    return token;
  }
  async getIatFromToken(refreshToken: string): Promise<Date> {
    const decoded = await jwt.decode(refreshToken, { complete: true });
    const iat = new Date(decoded.payload.iat * 1000);
    return iat;
  }
}
