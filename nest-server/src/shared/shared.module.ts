import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HelperService } from './helper.service';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): any => ({
        transport: {
          host: config.get<string>('mailserver.host'),
          port: config.get<string>('mailserver.port'),
          auth: {
            user: config.get<string>('mailserver.user'),
            pass: config.get<string>('mailserver.password'),
          },
        },
        defaults: {
          from: config.get<string>('mailserver.mailFrom'),
        },
        template: {
          dir: 'templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HelperService, EmailService],
  exports: [HelperService, EmailService]
})
export class SharedModule {}
