import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import { AppLogger } from "src/app.logger";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

  private logger = new AppLogger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(
    toEmail: string,
    subject: string,
    template: string,
    data: any,
    fromEmail = '"No Reply" <no-reply@scamreport.com>',
  ) {

    this.logger.log(`${this.sendEmail.name} was called`);
    const info = await this.mailerService.sendMail({
      to: toEmail,
      from: fromEmail,
      subject: subject,
      template: template,
      context: data // Data to be sent to template engine.
    });

    this.logger.log(`delivery id: ${info.messageId}`);
    this.logger.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));

    return info;
  }
}