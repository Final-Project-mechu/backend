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
    const { refresh_token } = await this.userService.createUser(
      data.is_admin,
      data.email,
      data.nick_name,
      data.password,
    );
    return { refresh_token };
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
    response.cookie('Authentication', 'Bearer ' + authentication),
      {
        httpOnly: true,
      };
    return { message: '로그인 성공' };
  }

  //로그아웃 기능 구현중
  @Post('/logout')
  async logout(@Res() response: Response, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    const pastDate = new Date(0);
    const logout = response.cookie('Authentication', '', { expires: pastDate });

    return { logout, message: '에러있으면 뱉어라' };
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
