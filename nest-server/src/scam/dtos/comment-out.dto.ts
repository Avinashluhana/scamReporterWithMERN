import { Expose, Type } from "class-transformer";
import { CommentUserOut } from "./comment-user-out.dto";

export class CommentOut {

  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => CommentUserOut)
  author: CommentUserOut;

  @Expose()
  createdAt: Date;
}