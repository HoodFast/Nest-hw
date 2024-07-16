import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../domain/session.schema';
import { Injectable } from '@nestjs/common';
import { sessionMapper } from '../domain/session.mapper';

@Injectable()
export class SessionQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}
  async getAllSessions(userId: string) {
    const result = await this.sessionModel.find({});
    if (!result) return null;
    return sessionMapper(result);
  }
}
