import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
export interface VerificationCodeInfo {
  email: string;
  verificationCode: string;
}
let codeobject = [];
@Injectable()
export class MailService {
  private gmailTransporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.gmailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'leeseowon160@gmail.com',
        pass: 'ugfsmdptyvvcfmzi',
      },
    });
  }

  async sendVerificationCode(email: string, verificationCode: string) {
    const subject = '회원가입 인증번호';
    const content = `<p>인증번호는 <strong>${verificationCode}</strong> 입니다.</p>`;

    try {
      await this.gmailTransporter.sendMail({
        from: 'leeseowon160@gmail.com',
        to: email,
        subject: subject,
        html: content,
      });
      console.log('메일이 전송되었습니다');
    } catch (error) {
      console.error('메일 전송 중 오류가 발생했습니다:', error);
    }
  }
}
