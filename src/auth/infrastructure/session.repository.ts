import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../../sessions/domain/session.schema';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}
  async getSessionForLogin(
    userId: ObjectId,
    title: string,
  ): Promise<SessionDocument | null> {
    const meta = await this.sessionModel.findOne({ userId, title });
    return meta;
  }
  async createNewSession(tokenMetaData: Session) {
    const newSession = new this.sessionModel(tokenMetaData);
    await newSession.save();
    const session = await this.sessionModel.findOne({
      deviceId: tokenMetaData.deviceId,
    });
    return session;
  }
  async deleteById(_id: ObjectId): Promise<boolean> {
    const res = await this.sessionModel.deleteOne({ _id });
    return !!res.deletedCount;
  }
}
