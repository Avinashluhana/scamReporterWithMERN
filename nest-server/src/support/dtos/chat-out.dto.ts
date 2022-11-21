import { Expose, Type } from "class-transformer";
import { ChatUser } from "./chat-user-out.dto";

export class ChatOutDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => ChatUser)
  participants: ChatUser[];

  @Expose()
  createdAt: Date;
}