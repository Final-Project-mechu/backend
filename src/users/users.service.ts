import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import _, { remove } from 'lodash';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { MailService } from 'src/mail/mail.service';
let isEmailVerified: Record<string, boolean> = {};
let codeObject: Record<string, string> = {};

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
      select: ['id', 'email', 'password'],
    });
  }

  // 중복이메일 확인
  async mailSend(email: string, code: string) {
    const existUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 이메일 인증 상태 객체 초기화
    isEmailVerified['email'] = false; // 해당 이메일의 인증 상태를 false로 설정

    // 메일 전송 및 랜덤 코드 생성 및 저장
    const verificationCode = this.generateVerificationCode();
    await this.mailservice.sendVerificationCode(
      email,
      verificationCode.toString(),
    );

    // 랜덤 코드를 객체에 저장
    codeObject['code'] = verificationCode.toString();
    codeObject['email'] = email;
    // 일정 시간 후에 랜덤 코드를 삭제하도록 설정
    setTimeout(() => {
      delete codeObject['code'];
    }, 300000);
  }

  // 메일 인증 확인하는 코드 로직이 필요
  async verifyCode(email: string, code: string) {
    if (codeObject['code'] !== code || codeObject['email'] !== email) {
      throw new ConflictException(
        '인증 코드 및 인증 이메일이 유효하지 않습니다.',
      );
    } else {
      isEmailVerified['email'] = true;
    }
  }

  async createUser(
    is_admin: number,
    email: string,
    nick_name: string,
    password: string,
    // 회원가입 로직에서 중복이메일을 한번 더 체크
  ) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const existUser = await this.getUserInfo(email);
    if (!_.isNil(existUser)) {
      throw new ConflictException(
        `e메일이 이미 사용 중입니다. email: ${email}`,
      );
    }

    // 지금 테스트때문에 막아놨음
    // 이메일이 인증된 이메일인지 확인한다.
    if (!isEmailVerified['email'] === true) {
      console.log('이메일확인용 콘솔', isEmailVerified);
      throw new ConflictException(`인증된 이메일이 아닙니다.`);
    }

    const insertResult = await this.userRepository.insert({
      is_admin,
      email,
      nick_name,
      password,
    });

    const refresh_token_payload = {};
    const refresh_token = await this.jwtService.signAsync(
      refresh_token_payload,
      { expiresIn: '1d' },
    );
    return { refresh_token };
    delete isEmailVerified[email];
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
        id: userConfirm.id,
        nick_name: userConfirm.nick_name,
      };
      const accessToken = await this.jwtService.signAsync(payload);

      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(
    id: number,
    newNick_name: string,
    password: string,
    newPassword: string,
  ) {
    const confirmUserPass = await this.userRepository.findOne({
      where: { id },
      select: ['nick_name', 'password'],
    });

    if (!confirmUserPass) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (password !== confirmUserPass.password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return this.userRepository.update(id, {
      nick_name: newNick_name,
      password: newPassword,
    });
  }

  // 비밀번호 일치로직 안돌아서 이부분 해결해야함
  async deleteUser(id: number, password: string, passwordConfirm: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['password'],
    });
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수없습니다.');
    }

    if (password !== user.password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return this.userRepository.softDelete(id);
  }

  private generateVerificationCode(): number {
    // 4자리 인증번호 생성 로직
    return Math.floor(1000 + Math.random() * 9000);
  }

  async createGoogleUser(data: any) {
    const existUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (existUser) {
      throw new ConflictException(`이미 가입된 회원입니다.`);
    }

    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }
}
