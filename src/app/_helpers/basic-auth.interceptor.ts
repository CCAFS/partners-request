import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { AuthenticationService } from '@app/_services';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        
        let oa =  `${environment['app_user']}:${environment['app_password']}`      
       
        console.log('Intercerptor oa '+`${environment['app_user']}` )
        request = request.clone({
            setHeaders: {     
                'Cache-Control': 'no-cache',          
                Authorization: `Basic `+ btoa(oa)
            }
        });

        return next.handle(request);
    }
}