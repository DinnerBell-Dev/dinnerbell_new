import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

  /**
   * To get all countries data
   *
   * @returns
   * @memberof CountryService
   */
  getCountries() {
    return this.http.get('assets/json/countries.json');
  }

  /**
   * To get all cities data
   *
   * @returns
   * @memberof CountryService
   */
  getCities() {
    return this.http.get('assets/json/cities.json');
  }

  /**
   *  To get all states data
   *
   * @returns
   * @memberof CountryService
   */
  getStates() {
    return this.http.get('assets/json/states.json');
  }

}
