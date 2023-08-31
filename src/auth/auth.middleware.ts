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
      const authkey = authHeader.split('=')[1];
      const decodedToken = decodeURIComponent(authkey);
      const [authType, token] = decodedToken.split(' ');
      if (authType !== 'Bearer' || !token) {
        throw new UnauthorizedException(
          'It is not Bearer type of token or abnormal token',
        );
      }
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      req.locals.user = payload;
      next();
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid JWT');
    }
  }
}
