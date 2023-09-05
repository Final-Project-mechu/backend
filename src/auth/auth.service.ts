import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  check: boolean;
  accessToken: string;
  private http: HttpService;
  constructor(private readonly jwtService: JwtService) {
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

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken);
      // 리프레시 토큰을 검증합니다.

      // 여기에서 필요한 검증 로직을 추가할 수 있습니다.
      // 예를 들어, 리프레시 토큰의 유효기간을 확인하거나 사용자 정보를 확인합니다.

      // 사용자 정보를 가져온 후에 새로운 액세스 토큰을 발급합니다.
      const payload = {
        id: decodedRefreshToken.id,
        nick_name: decodedRefreshToken.nick_name,
      };
      const newAccessToken = await this.jwtService.signAsync(payload);

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
    }
  }
}
