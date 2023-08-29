import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { UsersService } from 'src/users/users.service';

import { ConflictException, Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UsersService) {
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
    const { nick_name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      nick_name: '테스트용', // 별도로 추가 생성 필요
      password: '', // 비밀번호가 필요한 경우 적절한 값을 설정
      is_admin: 0, // 구글 사용자의 경우 일반 유저로 설정
      accessToken,
    };

    //회원가입 중복 방지
    const existUser = await this.userService.getUserInfo(emails);
    if (existUser) {
      throw new ConflictException(`이미 회원 가입된 유저입니다.`);
    }

    // 나중에 프론트랑 연결할 때 가입된 유저는 프론트 페이지로 넘겨주기

    // 2. 해당 유저가 로그인을 할 때 DB에 있으면 홈페이지로 보낸다.
    // 로그인 처리를 해서 홈페이지로 보내야함
    // 로그인 처리에서 JWT를 발급해서 보내줌
    // 발급한 JWT로직을 통과했을 경우 홈페이지로 리다이렉트
    // 서버로 받아서 저장하고
    // JWT토큰 발급해서 클라 전달해서 토큰으로 통신

    const createdUser = await this.userService.createGoogleUser(user);

    done(null, createdUser);
  }
}
