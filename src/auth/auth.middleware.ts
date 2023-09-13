import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service'; // 안씀

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
      const authHeader = req.headers.cookie;
      const [AccessToken, RefreshToken] = authHeader.split(';');
      if (!authHeader) {
        throw new UnauthorizedException('JWT not found');
      }
      const decodedRefresh = decodeURIComponent(AccessToken.split('=')[1]);
      const decodedAccess = decodeURIComponent(RefreshToken.split('=')[1]);
      if (
        decodedAccess.split(' ')[0] !== 'Bearer' ||
        !decodedAccess.split(' ')[1] ||
        decodedRefresh.split(' ')[0] !== 'Bearer' ||
        !decodedRefresh.split(' ')[1]
      ) {
        throw new UnauthorizedException(
          'It is not Bearer type of token or abnormal token',
        );
      }
      const payload = await this.jwtService.verify(
        decodedAccess.split(' ')[1],
        {
          secret: this.configService.get('JWT_SECRET_KEY'),
        },
      );
      req.locals.user = payload;
      if (!AccessToken) {
        const newAccessToken =
          await this.authService.generateAccessToken(payload);
        return { AccessToken: 'Bearer ' + newAccessToken };
      }

      next();
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid JWT');
    }
  }
}
