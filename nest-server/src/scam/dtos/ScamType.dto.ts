import { Expose } from "class-transformer";

export class ScamTypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}