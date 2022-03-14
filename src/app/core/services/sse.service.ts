import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {EventSourcePolyfill} from 'event-source-polyfill';
import {JwtService} from './jwt.service';

@Injectable()
export class SseService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private tokenService: JwtService
  ) {
  }

  getIndicatorsStream(url): EventSourcePolyfill {
      return new EventSourcePolyfill(`${this.configService.apiUrl}${url}`, {
        headers: {
          Authorization: 'Bearer ' + this.tokenService.getToken()
        }
    });
  }
}
