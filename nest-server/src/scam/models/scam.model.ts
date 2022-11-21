import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

export enum Status {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

@Schema({ timestamps: true })
export class Scam {

  @Prop({ default: Types.ObjectId })
  _id: string;

  @Prop()
  userEmail: string;

  @Prop()
  subscribeNewsLetter: boolean;

  @Prop()
  scamType: string;

  @Prop()
  pseudonumUsed: string;

  @Prop()
  fraudulentEmail: string;

  @Prop()
  phoneCode: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  fraudulentWebsite: string;

  @Prop()
  scamContent: string;

  @Prop()
  explanation: string;

  @Prop()
  sellPurchaseRelated: string;

  @Prop({ enum: Status, type: String, default: Status.Pending, index: true })
  status: string;

  @Prop([String])
  media: string[]
}

export const ScamSchema = SchemaFactory.createForClass(Scam);

ScamSchema.index({ 
  scamType: 'text',
  pseudonumUsed: 'text',
  fraudulentEmail: 'text',
  fraudulentWebsite: 'text',
  scamContent: 'text',
  explanation: 'text',
}, {
  weights: {
    scamType: 5,
    pseudonumUsed: 6,
    fraudulentEmail: 7,
    fraudulentWebsite: 8,
    explanation: 9,
    scamContent: 10,
  },
  name: "TextIndex"
});

export type ScamDocument = Scam & Document;
