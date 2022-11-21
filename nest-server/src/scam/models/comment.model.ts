import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Comment {

  @Prop({ default: Types.ObjectId })
  _id: string;

  @Prop({ type: String, ref: 'User' })
  author: string;

  @Prop({ type: String, ref: 'Scam' })
  scam: string;

  @Prop()
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentDocument = Comment & Document;
