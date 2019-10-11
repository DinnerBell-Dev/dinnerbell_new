import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   *  For accessing baseURL from environment
   */
  url = environment.URL;

  constructor(private http: HttpClient) { }

  menuToggle = new EventEmitter();
  closeToggle = new EventEmitter();

  previewToggle = new EventEmitter();
  headerTitle = new EventEmitter();
  previewIcon = new EventEmitter();
  
  toggleMenus() {
    this.menuToggle.emit();
  }
  toggleMenusClose() {
    this.closeToggle.emit();
  }

  togglepreview() {
    this.previewToggle.emit();
  }
  getHeaderTitle(data) {
    this.headerTitle.emit(data);
  }
  getViewIcon(data) {
    this.previewIcon.emit(data);
  }

  /**
   * Send user registration data to server
   *
   * @param {*} data
   * @returns
   * @memberof AuthService
   */
  signup(data) {
    return this.http.post(this.url + 'api/user/signup', data);
  }
  /**
   * To perform login based on user's data
   *
   * @param {*} data
   * @returns
   * @memberof AuthService
   */
  signin(data) {
    return this.http.post(this.url + 'api/user/signin', data);
  }

  /**
   * To reset user's password in case user forgot password
   *
   * @param {*} data
   * @returns
   * @memberof AuthService
   */
  forgotpassword(data) {
    return this.http.post(this.url + 'api/user/send_password', data);
  }

  /**
   * To create user's password
   * @param data
   */
  createpassword(data) {
    return this.http.post(this.url + 'api/user/createpassword', data);
  }

  /**
   *  To check create password token for valid link.
   * @param token
   */
  checkToken(token) {
    return this.http.get(this.url + 'api/user/createpassword/' + token);
  }

  /**
   *  To update user's email
   * @param token
   */
  updateEmail(id, email) {
    return this.http.put(this.url + 'api/user/updatemail/' + id, email);
  }

  /**
   *  To change user's password
   * @param token
   */
  updatePassword(id, data) {
    return this.http.post(this.url + 'api/user/changepassword/' + id, data);
  }


}




