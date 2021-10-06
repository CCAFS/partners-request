import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  getUserAD(userEmail, userPassword){
    let oa =  `${environment['app_user']}:${environment['app_password']}`
    var httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'application/json');
    httpHeaders.append("Authorization", "Basic " + oa);
    const httpOptions = {
      headers: httpHeaders
    };
    let params= {
      "email":userEmail,
      "password": userPassword      
    }
    return this.http.post<any>(`${environment['apiUrl']}/UserAuthentication`,params, httpOptions);
  }
  loginAD(email, password){
    return this.getUserAD(email,password).pipe(map((user:User) => { 
      console.log(user.email)  
      console.log(user.authenticated)        
      user.token= 'fake-jwt-token'
      user.expiresIn= moment().add(30,'minutes').unix()
      delete user.password
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  login(email, password) {
    return this.http.post<any>(`${environment['config'].apiUrl}/users/authenticate`, { email, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}


export class User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  token: string;
  expiresIn: number;
  authenticated: boolean;
}