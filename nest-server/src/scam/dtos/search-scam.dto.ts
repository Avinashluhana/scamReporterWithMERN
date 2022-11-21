import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SearchScamDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  text: string;
}