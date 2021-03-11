import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";


@Injectable()
export class JwtService {
  private tokenName = 'access_token';

  constructor(private configService: ConfigService) {
    if (this.configService.jwt) {
      this.tokenName = 'jwtToken';
    }
  }

  getToken(): string {
    return window.localStorage.getItem(this.tokenName);
  }

  saveToken(token: string) {
    window.localStorage.setItem(this.tokenName, token);
  }

  destroyToken() {
    window.localStorage.removeItem(this.tokenName);
  }

}
