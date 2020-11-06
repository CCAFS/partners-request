import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import * as moment from 'moment';

let users = [
    { email: 'yamit.huertas@gmail.com', password: 'CNkzymx6', id: 1, firstName:'Yamit', lastName:'Test' },
    { email: 'andresbranbury@gmail.com', password: '5hR9wyMN', id: 2, firstName:'Andres', lastName:'Test' },
    { email: 'd.f.perez@cgiar.org', password: 'WG2hUVju', id: 2, firstName:'Diego', lastName:'Perez' },
    { email: 'f.elvira@cgiar.org', password: 'VCM7QcEc', id: 3, firstName:'Felipe', lastName:'Elvira' },
    { email: 'marlosupport@cgiar.org', password: 'Hv3QUAsK', id: 4, firstName:'Support', lastName:'Wildcard' },
    { email: 'cristianmartin3090@gmail.com', password: 'Cv1AUAmY', id: 5, firstName:'Cristian', lastName:'Martin' },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);
            if (!user) return error('Email or password is incorrect');
            return ok({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token',
                expiresIn: moment().add(30,'minutes').unix()
                // .add('minutes', 30)
            })
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ message });
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};