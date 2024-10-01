import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../domain/session.schema';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from '../domain/session.entity';
@Injectable()
export class SessionSqlRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async getSessionForUserId(
    userId: string,
    title: string,
  ): Promise<SessionEntity | null> {
    try {
      const meta = await this.dataSource.query(
        `
      SELECT id, iat, "expireDate", "deviceId", ip, title, "userId"
        FROM public.sessions s
        WHERE s."userId" = $1 AND s."title" = $2
      `,
        [userId, title],
      );
      return meta;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async getSessionByDeviceId(deviceId: string): Promise<SessionEntity | null> {
    const res = await this.dataSource.query(
      `
         SELECT id, iat, "expireDate", "deviceId", ip, title, "userId"
            FROM public.sessions 
            WHERE "deviceId" = $1
    `,
      [deviceId],
    );
    return res[0];
  }
  async getAllSessionByOnlyUserId(userId: string) {
    const session = await this.sessionModel.find({
      userId: new ObjectId(userId),
    });
    if (!session) return null;
    return session;
  }
  async createNewSession(tokenMetaData: SessionEntity) {
    try {
      const { id, iat, title, deviceId, ip, expireDate, userId } =
        tokenMetaData;

      const session = await this.dataSource.query(
        `
            INSERT INTO public.sessions(
            id, iat, "expireDate", "deviceId", ip, title, "userId")
            VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
        [id, iat, expireDate, deviceId, ip, title, userId],
      );
      return session;
    } catch (e) {
      console.log(e);

      return null;
    }
  }
  async deleteById(id: string): Promise<boolean> {
    const deleteSession = await this.dataSource.query(
      `
        DELETE FROM public.sessions
            WHERE "id" = $1;
    `,
      [id],
    );

    return !!deleteSession[1];
  }
  async deleteByDeviceId(deviceId: string): Promise<boolean> {
    const deletedSession = await this.dataSource.query(
      `
     DELETE FROM public.sessions
            WHERE "deviceId" = $1;
    `,
      [deviceId],
    );
    return !!deletedSession[1];
  }
  async getSessionForRefreshDecodeToken(iat: Date, deviceId: string) {
    try {
      // const updatedIat = new Date(iat.getTime() + 3 * 60 * 60 * 1000);
      const iatString = iat.toISOString();
      const metaData = await this.dataSource.query(
        `
     SELECT id, iat, "expireDate", "deviceId", ip, title, "userId"
        FROM public.sessions 
        WHERE "iat" = $1 AND "deviceId" = $2;
    `,
        [iatString, deviceId],
      );

      return metaData[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAllSession(userId: string, deviceId: string) {
    const deleteAllSessions = await this.dataSource.query(
      `
        DELETE FROM public.sessions
            WHERE "userId" = $1 AND not("deviceId"=$2);
    `,
      [userId, deviceId],
    );
    return !!deleteAllSessions[1];
  }
}
