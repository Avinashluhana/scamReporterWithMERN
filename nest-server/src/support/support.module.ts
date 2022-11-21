import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { User, UserSchema } from 'src/user/user.model';
import { Chat, ChatSchema } from './models/chat.model';
import { Message, MessageSchema } from './models/message.model';
import { SupportController } from './support.controller';
import { SupportGateway } from './support.gateway';
import { SupportService } from './support.service';

@Module({
  imports: [
    AuthModule,
    SharedModule,
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),    
  ],
  controllers: [SupportController],
  providers: [SupportService, SupportGateway],
})
export class SupportModule {}
