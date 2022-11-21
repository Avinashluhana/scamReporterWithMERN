import { Expose } from "class-transformer";

export class UserOutDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  avatar: string;

  @Expose()
  active: boolean;

  @Expose()
  role: string;
}