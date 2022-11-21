import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, Validate } from "class-validator";

export class CreateChatDto {
  @ApiProperty()
  @IsArray()
  @Type(() => String)
  participants: string[];
}