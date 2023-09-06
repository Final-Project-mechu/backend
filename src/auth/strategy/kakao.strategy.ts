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
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    data: any,
  ): Promise<any> {
    const user = {
      kakaoId: data.id,
      email: data._json.kakao_account.email,
    };
    return user;
  }
}
