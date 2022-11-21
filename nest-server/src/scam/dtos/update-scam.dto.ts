import { PartialType } from "@nestjs/swagger";
import { RegisterScamDto } from "./register-scam.dto";

export class UpdateScamDto extends PartialType(RegisterScamDto) {}