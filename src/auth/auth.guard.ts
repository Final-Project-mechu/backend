// // auth.guard.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class KakaoAuthGuard extends AuthGuard('kakao') {
//   handleRequest(err, user) {
//     if (err || !user) {
//       throw err || new UnauthorizedException();
//     }
//     return user;
//   }
// }
