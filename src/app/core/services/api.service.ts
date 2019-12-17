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
    private jwtService: JwtService
  ) {
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: any = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.apiUrl}${path}`, {params})
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: object = {}): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  patch(path: string, body: object = {}): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: object = {}): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  postFile(path: string, body: object = {}, options: object = {}): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${path}`, body, options
    );
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}
