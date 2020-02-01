import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

import {JwtService, UserService} from '../services';
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService,
              private userService: UserService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Accept': 'application/json'
    };

    const token = this.jwtService.getToken();

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    if (!(req.body instanceof FormData)) {
      headersConfig['Content-Type'] = 'application/json';
    }

    const request = req.clone({setHeaders: headersConfig});
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.userService.purgeAuth();
        this.router.navigateByUrl('/login');
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
