import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: any, res: any, next: Function) {
    try {
      req.locals = {};
      const authHeader = req.headers.cookie;
      console.log(authHeader);
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

      // 여기서

      //
      next();
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid JWT');
    }
  }
}
