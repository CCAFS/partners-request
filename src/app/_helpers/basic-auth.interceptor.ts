import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { AuthenticationService } from '@app/_services';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let oa =  `${environment.app_user}:${environment.app_password}`
        request = request.clone({
            setHeaders: {
                Authorization: `Basic ${window.btoa(oa)}`
            }
        });

        return next.handle(request);
    }
}