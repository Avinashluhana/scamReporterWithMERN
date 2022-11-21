import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class CheckScamQuery {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUrl(undefined, { message: 'Not a valid url' })
  url: string;
}