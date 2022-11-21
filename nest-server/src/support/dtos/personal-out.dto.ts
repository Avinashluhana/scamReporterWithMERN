import { Expose } from "class-transformer";

export class PersonalOutDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  avatar: string;
}