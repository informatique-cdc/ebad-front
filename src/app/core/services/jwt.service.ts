import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';


@Injectable()
export class JwtService {
  private tokenName = 'access_token';

  constructor() {
    if (environment.jwt) {
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
