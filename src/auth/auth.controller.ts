import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Header,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakaoLogin')
  @Header('Content-Type', 'text/html')
  getKakaoLoginPage(): string {
    return `
      <div>
        <h1>카카오 로그인</h1>

        <form action="/auth/kakaoLoginLogic" method="GET">
          <input type="submit" value="카카오 로그인" />
        </form>

        <form action="/auth/kakaoLogout" method="GET">
          <input type="submit" value="카카오 로그아웃" />
        </form>

        <form action="/auth/kakaoInfo" method="GET">
          <input type="submit" value="카카오 정보요청" />
        </form>
    `;
  }

  @Get('/kakaoLoginLogic')
  @Header('Content-Type', 'text/html')
  kakaoLoginLogic(@Res() res): void {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = '7721dd035f01f4aa52fc933b327ccd29';
    const _redirectUrl = 'http://localhost:3000/auth/kakaoLoginLogicRedirect';
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  @Get('/kakaoLoginLogicRedirect')
  @Header('Content-Type', 'text/html')
  kakaoLoginLogicRedirect(@Query() qs, @Res() res): void {
    const _restApiKey = '7721dd035f01f4aa52fc933b327ccd29';
    const _redirect_uri = 'http://localhost:3000/auth/kakaoLoginLogicRedirect';
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirect_uri}&code=${qs.code}`;
    const _headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    this.authService
      .login(_hostName, _headers)
      .then(e => {
        console.log(`사용자 액세스TOKEN : ${e.data['access_token']}`);
        this.authService.setToken(e.data['access_token']);
        return res.send(`
          <div>
            <h2>축하합니다!</h2>
            <p>카카오 로그인 성공하였습니다!</p>
            <a href="/auth/kakaoLogin">메인 화면으로</a>
            <a href="http://localhost:3000">홈으로</a>
            <p>이 센드 요청에서 바로 페이지로 보내버리면 됨</p>
          </div>
        `);
      })
      .catch(err => {
        console.log(err.message);
        return res.send('error');
      });
  }

  @Get('/kakaoInfo')
  @Header('Content-Type', 'text/html')
  kakaoReqInfo(@Res() res): void {
    this.authService
      .reqInfo()
      .then(e => {
        console.log(e);
        return res.send(`
        <div>
          <h2>정보 요청 완료</h2>
          <a href="/auth/kakaoLogin">메인 화면으로</a>
        </div>
      `);
      })
      .catch(err => {
        console.log(err);
        return res.send('logout error');
      });
  }

  @Get('/kakaoLogout')
  @Header('Content-Type', 'text/html')
  kakaoLogout(@Res() res): void {
    this.authService
      .deleteLog()
      .then(e => {
        console.log(e);
        return res.send(`
        <div>
          <h2>로그아웃 완료(로그삭제)</h2>
          <a href="/auth/kakaoLogin">메인 화면으로</a>
        </div>
      `);
      })
      .catch(err => {
        console.log(err);
        return res.send('logout error');
      });
  }
}
