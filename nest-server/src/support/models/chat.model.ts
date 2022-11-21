
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {

  @Prop({ default: Types.ObjectId })
  _id: string;

  @Prop({ type: [String], ref: 'User' })
  participants: string[];

  @Prop({ index: true })
  hash: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);