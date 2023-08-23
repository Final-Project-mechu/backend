import { Controller, Get } from '@nestjs/common';

@Controller('mail')
export class MailController {
  @Get('/signin')
  async signin() {
    return 'signin';
  }
  @Get('/signup')
  async signup() {
    return 'signup';
  }
}
