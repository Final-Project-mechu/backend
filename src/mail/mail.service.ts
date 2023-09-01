import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { privateDecrypt } from 'crypto';
import e from 'express';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { use } from 'passport';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
export interface VerificationCodeInfo {
  email: string;
  verificationCode: string;
}
const codeObject = {};
const isEmailVerified = {};
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
    const content = `<p>인증번호는 <strong>${verificationCode}</strong> 입니다.</p> <br> 인증번호는 5분 후 만료됩니다.`;

    try {
      await this.gmailTransporter.sendMail({
        from: 'leeseowon160@gmail.com',
        to: email,
        subject: subject,
        html: content,
      });
      console.log('메일이 전송되었습니다');
    } catch (error) {
      console.log(verificationCode);
    }
  }
}
