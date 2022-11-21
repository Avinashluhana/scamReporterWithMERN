
import { Expose } from "class-transformer";

export class ScamListAdminOutDto {
  @Expose()
  id: string;

  @Expose()
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

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;
}