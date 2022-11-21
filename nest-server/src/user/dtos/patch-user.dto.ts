import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsOptional } from "class-validator";

export class PatchUserDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;
}