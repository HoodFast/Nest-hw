import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Session {
  @Prop()
  iat;
  @Prop()
  expireDate: Date;
  @Prop()
  userId: ObjectId;
  @Prop()
  deviceId: string;
  @Prop()
  ip: string;
  @Prop()
  title: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
export type PostDocument = HydratedDocument<Session>;
