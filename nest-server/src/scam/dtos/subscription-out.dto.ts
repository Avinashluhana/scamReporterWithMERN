import { Expose, Type } from "class-transformer";

export class SubscriptionUser {
  @Expose()
  id: string;

  @Expose()
  fullName: string;
}

export class SubscriptionOutDto {

  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => SubscriptionUser)
  user: SubscriptionUser;
}
