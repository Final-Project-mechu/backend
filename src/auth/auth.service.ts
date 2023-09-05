import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  check: boolean;
  accessToken: string;
  private http: HttpService;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {
    this.check = false;
    this.http = new HttpService();
    this.accessToken = '';
  }
  loginCheck(): void {
    this.check = !this.check;
    return;
  }
  async login(url: string, headers: any): Promise<any> {
    return await lastValueFrom(this.http.post(url, '', { headers }));
  }
  setToken(token: string): boolean {
    this.accessToken = token;
    return true;
  }
  async deleteLog(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v1/user/unlink';
    const _headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    return await lastValueFrom(this.http.post(_url, '', { headers: _headers }));
  }

  async reqInfo(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v2/user/me';
    const _headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    return await lastValueFrom(this.http.post(_url, '', { headers: _headers }));
  }

  async generateAccessToken(payload: string) {
    const access_Token = await this.jwtService.signAsync(payload, {
      secret: 'JWT_SECERT_KEY',
    });
    return access_Token;
  }
}
