import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

import {JwtService} from './jwt.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
  ) {
  }


  get(path: string, params: any = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.apiUrl}${path}`, {params, headers: {'Content-Type':'application/json'}});
  }

  put(path: string, body: object = {}): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),{
          headers: {'Content-Type':'application/json'}
        }
    );
  }

  patch(path: string, body: object = {}): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
        {
          headers: {'Content-Type':'application/json'}
        }
    );
  }

  post(path: string, body: object = {}): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
        {
          headers: {'Content-Type':'application/json'}
        }
    );
  }

  postFile(path: string, body: object = {}, options: object = {}): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${path}`, body, options
    );
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${path}`,
        {
          headers: {'Content-Type':'application/json'}
        }
    );
  }
}
