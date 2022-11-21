import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  @Prop({ default: Types.ObjectId })
  _id: string;

  @Prop()
  fullName: string;

  @Prop({ index: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);