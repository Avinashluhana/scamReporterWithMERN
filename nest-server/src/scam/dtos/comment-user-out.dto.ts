import { Expose } from "class-transformer";

export class CommentUserOut {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  avatar: string;
}