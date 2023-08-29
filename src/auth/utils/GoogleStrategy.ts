import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
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
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.familyName,
      lastName: name.givenName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
  // 여기에서 const user (User Service Import 필요)
}
