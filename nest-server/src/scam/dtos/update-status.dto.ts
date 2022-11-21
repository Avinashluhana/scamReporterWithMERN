import { IsBoolean, IsNotEmpty, } from "class-validator";

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  approve: boolean;
}