import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: any, res: any, next: Function) {
    try {
      req.locals = {};
      console.log('req.locals', req.locals);
      console.log('req,cookies', req.cookies);
      const authHeader = req.cookies;
      console.log('@@@@@@@', authHeader);
      if (!authHeader) {
        throw new UnauthorizedException('JWT not found');
      }
      const authkey = authHeader.Authentication;
      const [authType, token] = authkey.split(' ');
      if (authType !== 'Bearer' || !token) {
        throw new UnauthorizedException(
          'It is not Bearer type of token or abnormal token',
        );
      }
      const payload = await this.jwtService.verify(token);
      req.locals.user = payload;
      next();
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid JWT');
    }
  }
}
