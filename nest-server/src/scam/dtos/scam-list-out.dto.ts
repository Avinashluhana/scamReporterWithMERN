import { Expose } from "class-transformer";

export class ScamListOutDto {
  @Expose()
  id: string;

  @Expose({ groups: ['admin'] })
  userEmail: string;

  @Expose()
  scamType: string;

  @Expose()
  pseudonumUsed: string;

  @Expose()
  fraudulentEmail: string;

  @Expose()
  fraudulentWebsite: string;

  @Expose()
  scamContent: string;

  @Expose()
  media: string;

  @Expose({ groups: ['admin'] })
  status: string;

  @Expose()
  createdAt: Date;
}