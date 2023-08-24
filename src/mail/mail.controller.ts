import { Controller, Post, Body, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('content') content: string,
    @Query('provider') provider: 'gmail' | 'naver',
  ) {
    await this.mailService.sendVerificationCode(to, subject);
  }
}
