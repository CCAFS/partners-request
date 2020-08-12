import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  constructor(private http: HttpClient) { }


  /**
   * 
   */
  getInstitutionsTypes(){
    return this.http.get<any>(`${environment.apiUrl}/institution-types`);
  }
  /**
   * 
   */
  getInstitutions(){
    return this.http.get<any>(`${environment.apiUrl}/institutions`);
  }

}
