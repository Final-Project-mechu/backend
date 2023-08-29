// import { Strategy } from 'passport-naver-v2';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { AuthService } from '../auth.service';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class NaverStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super({
//       clientID: 'IOYWZ49QodYHbaoGVFFs',
//       clientSecret: 'xShb3Gudfx',
//       callbackURL: 'http://localhost:3000/users/naver/callback',
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ): Promise<any> {
//     const user_email = profile.email;
//     console.log('여긴 몇번째? 4번', user_email);
//     const user_nick = profile.nickname;
//     console.log('5번', user_nick);
//     const user_provider = profile.provider;
//     console.log('6번', user_provider);
//     const user_profile = {
//       user_email,
//       user_nick,
//       user_provider,
//     };
//     console.log('확인4', user_profile);
//     const user = await this.authService.validateUser(user_email);
//     if (user === null) {
//       // 유저가 없을때
//       console.log('일회용 토큰 발급');
//       //   const once_token = this.authService.onceToken(user_profile);
//       //   return { once_token, type: 'once' };
//       // }

//       //   // 유저가 있을때
//       //   console.log('로그인 토큰 발급');
//       //   const access_token = await this.authService.createLoginToken(user);
//       //   const refresh_token = await this.authService.createRefreshToken(user);
//       //   return { access_token, refresh_token, type: 'login' };
//       // }
//     }
//   }
// }
