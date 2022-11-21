import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {

  @Prop({ default: Types.ObjectId })
  _id: string;

  @Prop()
  user: string;

  @Prop({ index: true })
  email: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);