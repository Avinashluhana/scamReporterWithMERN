import { Expose, Type } from "class-transformer";
import { ChatUser } from "./chat-user-out.dto";


export class MessageOutDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => ChatUser)
  sender: ChatUser;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}