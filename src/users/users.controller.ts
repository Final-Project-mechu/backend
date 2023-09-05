import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response, response } from 'express';
import { UpdateUserDto } from './dto/update.user.dto';
import { DeleteUserDto } from './dto/delete.user.dto';
import * as bcrypt from 'bcrypt';

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

  // 인증번호 전송 엔드포인트
  @Post('/send-code')
  async mailSend(@Body('email') email: string, code: string) {
    await this.userService.mailSend(email, code);
    return { message: '인증번호가 전송되었습니다.' };
  }

  // 메일 인증 확인 엔드포인트
  @Post('/verify-code')
  async verifyCode(@Body('email') email: string, @Body('code') code: string) {
    await this.userService.verifyCode(email, code);
    return { message: '이메일이 인증되었습니다.' };
  }

  // 회원가입
  @Post('/sign')
  async createUser(@Body() data: CreateUserDto) {
    const { email, nick_name, password } = data;
    const saltRounds = 10;
    try {
      // 비밀번호를 bcrypt를 사용하여 해싱
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // UserService의 createUser 메서드를 호출하여 사용자 생성
      await this.userService.createUser(0, email, nick_name, hashedPassword);

      return { message: '회원 가입이 완료되었습니다.' };
    } catch (error) {
      // 오류 처리
      // 이 부분에서 오류 처리 로직을 추가하실 수 있습니다.
      return { error: '회원 가입 중 오류가 발생했습니다.' };
    }
  }

  //로그인
  @Post('/login')
  async login(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authentication = await this.userService.login(
      data.email,
      data.password,
    );
    response.cookie('AccessToken', 'Bearer ' + authentication.access_Token);
    response.cookie('RefreshToken', 'Bearer ' + authentication.refresh_Token);

    return { message: authentication };
  }

  //로그아웃 기능 구현중
  @Delete('/logOut')
  async signout(@Res() response: Response) {
    response.clearCookie('Authentication');
    return response.status(200).send('signed out successfully');
  }

  //유저 정보 수정(닉네임, 패스워드)
  @Patch('/update')
  async updateUser(
    @Body() data: UpdateUserDto,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    try {
      await this.userService.updateUser(
        auth.id,
        data.nick_name,
        data.newNick_name,
        data.password,
        data.newPassword,
      );
      return { message: '닉네임, 비밀번호가 정상적으로 수정되었습니다.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //회원삭제(회원탈퇴)
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
