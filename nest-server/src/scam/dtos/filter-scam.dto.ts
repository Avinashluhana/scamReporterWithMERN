import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class FilterScamDto {
  @Expose()
  @IsString()
  @IsOptional()
  userEmail: string;
}