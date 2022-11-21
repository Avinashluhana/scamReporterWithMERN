
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {

  @Prop({ default: Types.ObjectId })
  _id: string;

  @Prop({ required: true })
  chatId: string;

  @Prop()
  sender: string;

  @Prop()
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);