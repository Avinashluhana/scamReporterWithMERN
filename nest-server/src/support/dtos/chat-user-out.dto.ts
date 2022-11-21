import { Expose } from "class-transformer";

export class ChatUser {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  avatar: string;
}