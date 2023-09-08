import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: '7721dd035f01f4aa52fc933b327ccd29',
      callbackURL: 'http://localhost:3000/auth/kakaoLoginLogicRedirect',
      scope: ['email', 'nickname'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const kakaoAccount = profile._json.kakao.account;
    const profileInfo = kakaoAccount.data;
    const user = {
      email: kakaoAccount.email,
      nickname: profileInfo.nickname,
    };
    console.log('이메일:', user.email);
    console.log('닉네임:', user.nickname);
    return user;
  }
}
