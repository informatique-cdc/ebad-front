import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

import {JwtService, UserService} from '../services';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ToastService} from '../services/toast.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(private jwtService: JwtService,
                private userService: UserService,
                private toastService: ToastService,
                private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {
            Accept: 'application/json'
        } as any;

        const token = this.jwtService.getToken();

        if (token) {
            headersConfig.Authorization = `Bearer ${token}`;
        }

        const request = req.clone({setHeaders: headersConfig});
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.userService.purgeAuth();
                this.router.navigateByUrl('/login');
            }
            const error = err.error.message || err.statusText;
            let msg = err.error.apierror?.message;
            if (err.error.apierror?.subErrors) {
                for (const suberror of err.error.apierror?.subErrors) {
                    msg += ' : ' + suberror.field + ' : ' + suberror.message;
                }
            }
            if (msg !== undefined && msg !== '') {
                this.toastService.showError(msg);
            }

            return throwError(error);
        }));
    }
}
