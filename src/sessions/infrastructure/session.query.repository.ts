import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../domain/session.schema';
import { Injectable } from '@nestjs/common';
import { JwtService } from '../../auth/infrastructure/jwt.service';
import { sessionMapper } from '../domain/session.mapper';
import { SessionsOutputType } from '../api/output/session.output';
@Injectable()
export class SessionQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private jwtService: JwtService,
  ) {}
  async getAllSessions(userId: string): Promise<SessionsOutputType[] | null> {
    const result = await this.sessionModel
      .find({ userId: new ObjectId(userId) })
      .lean();
    if (!result) return null;
    return sessionMapper(result);
  }
}
