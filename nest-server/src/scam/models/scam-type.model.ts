import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ScamType {

  @Prop({ default: Types.ObjectId })
  _id: string;

  @Prop()
  name: string;
}

export const ScamTypeSchema = SchemaFactory.createForClass(ScamType);

export type ScamTypeDocument = ScamType & Document;
