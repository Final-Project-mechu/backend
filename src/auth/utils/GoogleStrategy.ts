import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ConflictException, Injectable } from '@nestjs/common';
import { object } from '@hapi/joi';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtservice: JwtService,
    private readonly configserviece: ConfigService,
  ) {
    super({
      clientID:
        '110365415799-rqlkmsu24ddj1rernuhpt5bfmu6mr0q8.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails } = profile;

    // const jwtPayload = { email: emails[0].value };
    // const token = this.jwtservice.sign(jwtPayload);

    const existingUser = await this.userService.getUserInfo(emails[0].value);
    if (existingUser) {
      const jwtPayload = { email: emails[0].value };
      console.log('페이로드', jwtPayload);
      const token = await this.jwtservice.signAsync(jwtPayload, {
        secret: this.configserviece.get('JWT_SECRET_KEY'),
      });
      return {
        accessToken: 'Bearer ' + token,
      };
    }

    const user = {
      email: emails[0].value,
      nick_name: '', // 별도로 추가 생성 필요
      password: '', // 비밀번호가 필요한 경우 적절한 값을 설정
      is_admin: 0, // 구글 사용자의 경우 일반 유저로 설정
      accessToken,
      refreshToken,
    };

    try {
      const createdUser = await this.userService.createGoogleUser(user);
      return done(null, createdUser);
    } catch (error) {
      done(error, false);
    }

    //회원가입 중복 방지
    const existUser = await this.userService.getUserInfo(emails);
    if (existUser) {
      throw new ConflictException(`이미 가입된 회원입니다.`);
    }
  }
}
