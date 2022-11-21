import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class JoinChatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chatId: string;
}