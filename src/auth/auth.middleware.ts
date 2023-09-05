import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { asyncScheduler } from 'rxjs';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async use(req: any, res: any, next: Function) {
    try {
      req.locals = {};
      const authHeader = req.headers.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('Authentication='));
      if (!authHeader) {
        throw new UnauthorizedException('JWT not found');
      }
      const authkey = authHeader.split('=')[1]; // Authentication과 Bearer 분리
      const decodedToken = decodeURIComponent(authkey); //%20 제거
      const [authType, token] = decodedToken.split(' '); // 이후 Bearer + ..토큰 부분에서 토큰 부분만 파싱
      if (authType !== 'Bearer' || !token) {
        throw new UnauthorizedException(
          'It is not Bearer type of token or abnormal token',
        );
      }
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_KEY'), // 위에서 파싱한 토큰을 시크릿키로 인증
      });

      req.locals.user = payload; // req.locals.user에 파싱한 토큰 전달

      // 여기서 리프레시토큰을 액세스토큰으로 변환하는 로직을 작성
      const refreshToken = req.cookies.RefreshToken; // 리프레시 토큰 가져오기

      if (refreshToken) {
        // 리프레시 토큰이 있다면, 새로운 액세스 토큰 발급
        const newAccessToken = this.authService.generateAccessToken(payload); // 액세스 토큰 재발급
        res.cookie('AccessToken', 'Bearer ' + newAccessToken); // 새로운 액세스 토큰을 클라이언트에 설정
      }

      next();
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid JWT');
    }
  }
}
