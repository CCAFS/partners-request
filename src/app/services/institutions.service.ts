import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  constructor(private http: HttpClient) { }


  /**
   * 
   */
  getInstitutions() {
    return this.http.get<any>(`${environment['apiUrl']}/institutions`);
  }
  /**
   * 
   */
  getInstitutionsTypes() {
    return this.http.get<any>(`${environment['apiUrl']}/institution-types`);
  }

  /**
   * 
   */
  getCountries() {
    return this.http.get<any>(`${environment['apiUrl']}/countries`);
  }

  /**
   * 
   */
  getCRPS() {
    return this.http.get<any>(`${environment['apiUrl']}/cgiar-entities`);
  }

  /**
   * 
   * @param cgiar_entity entity acronym
   * @param params 
   */
  createPartner(cgiar_entity, params) {
    let oa =  `${environment['app_user']}:${environment['app_password']}`
    var httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'application/json');
    httpHeaders.append("Authorization", "Basic " + oa);
    const httpOptions = {
      headers: httpHeaders
    };
    return this.http.post<any>(`${environment['apiUrl']}/${cgiar_entity}/institutions/institution-requests`, params, httpOptions);
  }

  /**
   * 
   * @param cgiar_entity entity acronym
   */
  listRequestedPartners(cgiar_entity) {
    return this.http.get<any>(`${environment['apiUrl']}/${cgiar_entity}/institutions/institution-all-requests`);
  }

  /**
  * 
  * @param cgiar_entity entity acronym
  * @param params 
  */
  managePartnerRequest(cgiar_entity, params) {
    return this.http.post<any>(`${environment['apiUrl']}/${cgiar_entity}/institutions/accept-institution-request/${params.code}?justification=${params.justification}&accept=${params.accept}`, params);
  }





}
