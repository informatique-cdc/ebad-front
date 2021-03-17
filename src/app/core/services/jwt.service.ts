import {Injectable} from '@angular/core';


@Injectable()
export class JwtService {
  private tokenName = 'access_token';

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
