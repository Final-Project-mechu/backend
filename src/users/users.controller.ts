import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response, response } from 'express';
import { UpdateUserDto } from './dto/update.user.dto';
import { DeleteUserDto } from './dto/delete.user.dto';

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      nick_name: string;
    };
  };
}
@Controller('users')
export class UsersController {
  jwtService: any;
  constructor(private readonly userService: UsersService) {}

  @Post('/send-code')
  async mailSend(@Body('email') email: string, code: string) {
    await this.userService.mailSend(email, code);
    return { message: '인증번호가 전송되었습니다.' };
  }

  // 메일 인증 확인하는 코드 로직
  // 얘도 회원가입 밖에 생성(엔드포인트가 필요함)
  // 컨트롤러
  @Post('/verify-code')
  async verifyCode(@Body('email') email: string, @Body('code') code: string) {
    await this.userService.verifyCode(email, code);
    return { message: '이메일이 인증되었습니다.' };
  }

  // @Post('/verify-code')
  // async verifyCode(@Body('code') code: string, @Req() request: Request) {
  //   const token = request.cookies['verificationToken'];

  //   if (!token) {
  //     return { message: '인증 토큰이 없습니다.' };
  //   }

  //   const isVerified = await this.userService.verifyCode(token, code);
  //   console.log('컨트롤러 토큰', token, '컨트롤러코드', code);

  //   if (isVerified) {
  //     return { message: '인증이 완료되었습니다.' };
  //   } else {
  //     return { message: '인증 코드가 유효하지 않습니다.' };
  //   }
  // }

  @Post('/sign')
  async createUser(@Body() data: CreateUserDto) {
    const { accessToken, refresh_token } = await this.userService.createUser(
      data.is_admin,
      data.email,
      data.nick_name,
      data.password,
    );
    return { accessToken, refresh_token };
  }

  @Post('/login')
  async login(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authentication = await this.userService.login(
      data.email,
      data.password,
    );
    response.cookie('Authentication', 'Bearer ' + authentication);
    return { message: '로그인 성공' };
  }

  @Patch('/update')
  async updateUser(
    @Body() data: UpdateUserDto,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    try {
      await this.userService.updateUser(
        auth.id,
        data.password,
        data.newPassword,
      );
      return { message: '비밀번호가 정상적으로 수정되었습니다.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/quit')
  DeleteUser(@Body() data: DeleteUserDto, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.userService.deleteUser(
      auth.id,
      data.password,
      data.passwordConfirm,
    );
  }
}
