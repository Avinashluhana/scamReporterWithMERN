import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { ScamController } from './scam.controller';
import { Scam, ScamSchema } from './models/scam.model';
import { ScamService } from './scam.service';
import { Subscription, SubscriptionSchema } from './models/newsletter-subsription.model';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigOptions } from './multer.config';
import { User, UserSchema } from 'src/user/user.model';
import { ScamType, ScamTypeSchema } from './models/scam-type.model';
import { CommentSchema, Comment } from './models/comment.model';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    MongooseModule.forFeature([
      { name: Scam.name, schema: ScamSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: User.name, schema: UserSchema },
      { name: ScamType.name, schema: ScamTypeSchema },
    ]),
    MulterModule.register(MulterConfigOptions),
  ],
  controllers: [ScamController],
  providers: [ScamService],
})
export class ScamModule {}
