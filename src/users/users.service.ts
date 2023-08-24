import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { MailService } from 'src/mail/mail.service';
import { VerificationCodeInfo } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailservice: MailService,
  ) {}

  async getUserInfo(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['user_id', 'email', 'password'],
    });
  }

  async createUser(
    is_admin: boolean,
    email: string,
    nick_name: string,
    password: string,
  ) {
    const existUser = await this.getUserInfo(email);
    if (!_.isNil(existUser)) {
      throw new ConflictException(
        `e메일이 이미 사용 중입니다. email: ${email}`,
      );
    }

    const verificationCode = this.generateVerificationCode(); // 4자리 인증번호 생성
    await this.mailservice.sendVerificationCode(
      email,
      verificationCode.toString(),
    ); // 인증번호 이메일 전송

    const insertResult = await this.userRepository.insert({
      is_admin,
      email,
      nick_name,
      password,
    });

    const payload = {
      id: insertResult.identifiers[0].id,
      nick_name: insertResult.identifiers[0].nick_name,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    const refresh_token_payload = {};
    const refresh_token = await this.jwtService.signAsync(
      refresh_token_payload,
      { expiresIn: '1d' },
    );

    return { accessToken, refresh_token };
  }

  async login(email: string, password: string) {
    try {
      const userConfirm = await this.getUserInfo(email);
      if (_.isNil(userConfirm)) {
        throw new NotFoundException(
          `e메일을 찾을 수 없습니다. user email: ${email}`,
        );
      }
      if (userConfirm.password !== password) {
        throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
      }
      const payload = {
        id: userConfirm.user_id,
        nick_name: userConfirm.nick_name,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      return accessToken;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(user_id: number, password: string, newPassword: string) {
    const confirmUserPass = await this.userRepository.findOne({
      where: { user_id },
      select: ['password'],
    });
    if (!confirmUserPass && password !== confirmUserPass.password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return this.userRepository.update(user_id, { password: newPassword });
  }

  async deleteUser(user_id: number, password: string, passwordConfirm: string) {
    const confirmUserPass = await this.userRepository.findOne({
      where: { user_id },
    });
    if (!confirmUserPass && password !== confirmUserPass.password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return this.userRepository.softDelete(user_id);
  }
  private generateVerificationCode(): number {
    // 4자리 인증번호 생성 로직
    return Math.floor(1000 + Math.random() * 9000);
  }
}
