import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumberString, IsOptional, Max, Min } from "class-validator";

export class PaginationParams {

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  skip: number = 0;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;
}
