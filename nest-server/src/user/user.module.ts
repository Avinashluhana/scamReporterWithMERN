import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { SharedModule } from 'src/shared/shared.module';
import { MulterConfigOptions } from './multer.config';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    MulterModule.register(MulterConfigOptions),

  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
