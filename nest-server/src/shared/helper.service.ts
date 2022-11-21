import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class HelperService {

  private static readonly saltRound = 10;

  async generateSha256(value: any) {
    if (typeof value != 'string') value = JSON.stringify(value);
    return createHash('sha256').update(value).digest('hex');
  }

  async generateHash(value: any) {  
    if (typeof value != 'string') value = JSON.stringify(value);
    return bcrypt.hash(value, HelperService.saltRound);
  }

  async compareHash(value: any, hash: string) {
    if (typeof value != 'string') value = JSON.stringify(value);
    return bcrypt.compare(value, hash);
  }
  
}