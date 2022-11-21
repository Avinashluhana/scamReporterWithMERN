import { ApiProperty } from "@nestjs/swagger";
import { IsBooleanString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class RegisterScamDto {

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  userEmail: string;

  @ApiProperty()
  @IsBooleanString()
  @IsOptional()
  subscribeNewsLetter: boolean;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  scamType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pseudonumUsed: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  fraudulentEmail: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsUrl()
  fraudulentWebsite: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  isSellPurchaseRelated: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  scamContent: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  explanation: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  sellPurchaseRelated: string;
}