import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

// type JwtPayload
interface JwtPayload {
  sub: string;
  email: string;
}

@Controller('auth')
export class AuthController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.logout(); // Passport logout
    req.session.destroy(); // Destroy session
    res.redirect('/'); // Redirect to homepage or login page
  }
}
