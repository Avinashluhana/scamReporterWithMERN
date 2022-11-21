import { Expose } from "class-transformer";

export class ScamOutDto {
  @Expose()
  id: string;

  @Expose()
  userEmail: string;

  @Expose()
  subscribeNewsLetter: boolean;

  @Expose()
  scamType: string;

  @Expose()
  pseudonumUsed: string;

  @Expose()
  fraudulentEmail: string;

  @Expose()
  phoneCode: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  fraudulentWebsite: string;

  @Expose()
  scamContent: string;

  @Expose()
  explanation: string;

  @Expose()
  media: string[];

  @Expose()
  sellPurchaseRelated: string;

  @Expose({ groups: ['author', 'admin'] })
  status: string;

  @Expose()
  createdAt: Date;
}