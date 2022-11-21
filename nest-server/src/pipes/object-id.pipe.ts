import { PipeTransform, Injectable, BadRequestException } from
  '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, string> {

  public transform(value: any): string {
    const validObjectId = Types.ObjectId.isValid(value);
    if (!validObjectId) throw new BadRequestException('Invalid ObjectId');
    return String(value);
  }
}