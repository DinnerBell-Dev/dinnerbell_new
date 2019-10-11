import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   *  For accessing baseURL from environment
   */
  url = environment.URL;

  constructor(private http: HttpClient) { }

  /**
   * Used to add ingredient category
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
   addCategory(data) {
    return this.http.post(this.url + 'api/user/addIngredientCategory', data);
  }

   /**
   * Used to get ingredient category based on id
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  getIngredientCategories(id) {
    return this.http.get(this.url + 'api/user/ingredientCategory/'+id);
  }
  /**
   * Used to update ingredient category item with data
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  updateIngredientCategory(id, data) {
    return this.http.put(this.url + 'api/user/updateIngredientCat/' + id, data);
  }

  /**
   * Used to add menu
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  addMenu(data) {
    return this.http.post(this.url + 'api/user/addMenu', data);
  }

  /**
   * Used to get menu based on id
   *
   * @returns
   * @memberof UserService
   */
  getMenu(id) {
    return this.http.get(this.url + 'api/user/getMenu/'+id);
  }

  /**
   * Used to get all menus
   *
   * @returns
   * @memberof UserService
   */
  getMenus(id) {
    return this.http.get(this.url + 'api/user/getAllMenu/'+id);
  }
  /**
   * Used to update menu with data
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  updateMenu(id, data) {
    return this.http.put(this.url + 'api/user/updateMenu/' + id, data);
  }
  /**
   * Used to delete menu
   *
   * @returns
   * @memberof UserService
   */
  deleteMenu(id) {
    return this.http.delete(this.url + 'api/user/deleteMenu/'+id);
  }

  /**
   * Used to add menu item
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  addMenuItem(data) {
    return this.http.post(this.url + 'api/user/addMenuItem', data);
  }

  /**
   * Used to get all menu items
   *
   * @returns
   * @memberof UserService
   */
  getMenuItems(menu_id) {
    return this.http.get(this.url + 'api/user/menuItems/'+menu_id);
  }
  /**
   * Used to delete menu
   *
   * @returns
   * @memberof UserService
   */
  deleteMenuItem(id) {
    return this.http.delete(this.url + 'api/user/deleteMenuItem/'+id);
  }

  /**
   * Used to update menu item with data
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  updateMenuItem(id, data) {
    return this.http.put(this.url + 'api/user/updateMenuItem/' + id, data);
  }

  /**
   * Used to get all Labels
   *
   * @returns
   * @memberof UserService
   */
  getAllLabels() {
    return this.http.get(this.url + 'api/user/getAllLabels');
  }

  /**
   * Used to get menu item based on id
   *
   * @returns
   * @memberof UserService
   */
  getMenuItem(id) {
    return this.http.get(this.url + 'api/user/getMenuItem/'+id);
  }

   /**
   * Used to create menu customization
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  addMenuCustomization(data) {
    return this.http.post(this.url + 'api/user/addMenuCustomization', data);
  }

   /**
   * Used to update menu customization 
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  updateMenuCustomization(id, data) {
    return this.http.put(this.url + 'api/user/updateMenuCustomization/' + id, data);
  }

  /**
   * Used to get menu customization
   *
   * @returns
   * @memberof UserService
   */
  getMenuCustomization(id) {
    return this.http.get(this.url + 'api/user/menuCustomization/'+id);
  }

  uploadPhoto(data) {
    return this.http.post(this.url + 'api/images/upload', data);
  }

  deletePhoto(filename) {
    return this.http.delete(this.url + 'api/images/uploadedfiles/'+filename);
  }
  /**
   * Used to add new employee
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  addEmployee(data) {
    return this.http.post(this.url + 'api/user/addEmployee', data);
  }
   /**
   * Used to get all employees
   * @returns
   * @memberof UserService
   */
  getEmployees(id) {
    return this.http.get(this.url + 'api/user/getEmployees/'+id);
  }
  
   /**
   * Used to get employee
   * @returns
   * @memberof UserService
   */
  getEmployee(id) {
    return this.http.get(this.url + 'api/user/getEmployee/'+id);
  }
   /**
   * Used to update employee
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  updateEmployee(id, data) {
    return this.http.put(this.url + 'api/user/updateEmployee/' + id, data);
  }
  
  /**
   * Used to delete employee
   *
   * @returns
   * @memberof UserService
   */
  deleteEmployee(id) {
    return this.http.delete(this.url + 'api/user/deleteEmployee/'+id);
  }
  
  /**
   *Used to send qrcodes to all employees base on userid
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  resetCodes(data) {
    return this.http.post(this.url + 'api/user/reset-codes/', data);
  }
  
  resetUserCodes(data) {
    return this.http.post(this.url + 'api/user/reset-codes/user/', data);
  }
  
  /**
   *Used to send qrcodes to all employees base on weaklyrenewal
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  weaklyRenewal(data) {
    return this.http.post(this.url + 'api/user/weakly-renewal/', data);
  }

  
}




