import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerifyPhoneService {

  /**
   * For accessing baseURL from environment
   */
  url = environment.URL;

  constructor(private http: HttpClient) { }

  /**
   * To send verification code to user's phone number
   *
   * @param {*} data
   * @returns
   * @memberof VerifyPhoneService
   */
  start(data) {
    return this.http.post(this.url + 'api/verification/start', data);
  }

  /**
   * To verify code sent to user by twillio
   *
   * @param {*} data
   * @returns
   * @memberof VerifyPhoneService
   */
  verify(data) {
    return this.http.post(this.url + 'api/verification/verify', data);
  }



}




