import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  /**
   *  For accessing baseURL from environment
   */
  url = environment.URL;

  themeCustomize = new EventEmitter();
  haveTheme = new EventEmitter();
  addNewTheme = new EventEmitter();
  removeNewTheme = new EventEmitter();
  deleteThemes = new EventEmitter();

  constructor(private http: HttpClient) { }


  checkHaveTheme(data) {
    this.haveTheme.emit(data);
  }
  removeTheme() {
    this.removeNewTheme.emit();
  }
  themeDelete() {
    this.deleteThemes.emit();
  }

  /**
   * Send admin registration data to server
   *
   * @param {*} data
   * @returns
   * @memberof AdminService
   */
  signup(data) {
    return this.http.post(this.url + 'api/admin/signup', data);
  }
  /**
   * To perform login based on admin's data
   *
   * @param {*} data
   * @returns
   * @memberof AdminService
   */
  signin(data) {
    return this.http.post(this.url + 'api/admin/signin', data);
  }

  /**
   * Used to list all available users in database
   *
   * @returns
   * @memberof AdminService
   */
  getAllUsers() {
    return this.http.get(this.url + 'api/user/allusers');
  }

  /**
   * Used to delete user from table data based on userid
   *
   * @param {*} id
   * @returns
   * @memberof AdminService
   */
  deleteUser(id) {
    return this.http.delete(this.url + 'api/user/allusers/' + id);
  }

  /**
   * To update user's data based on id.
   */
  updateUser(id, data) {
    return this.http.put(this.url + 'api/user/allusers/' + id, data);
  }

  /**
   * To get all user's data based on id.
   *
   * @param {*} id
   * @returns
   * @memberof AdminService
   */
  getSingleUser(id) {
    return this.http.get(this.url + 'api/user/allusers/' + id);
  }

  /**
 * Used to create new theme.
 *
 * @param {*} data
 * @returns
 * @memberof AdminService
 */
  addBaseTheme(data) {
    return this.http.post(this.url + 'api/admin/theme-add', data);
  }

  /**
   * Used to get all ingredient categories.
   */
  getThemesList() {
    return this.http.get(this.url + 'api/admin/theme');
  }

  /**
   * Used to get all ingredient categories.
   */
  getIngredientCategories() {
    return this.http.get(this.url + 'api/admin/getIngredientCategories/');
  }

  /**
   * Used to create new ingredient category with data.
   *
   * @param {*} data
   * @returns
   * @memberof AdminService
   */
  addIngredientCategory(data) {
    return this.http.post(this.url + 'api/admin/registerIngredientCategory', data);
  }

  /**
   * Used to update ingredient category with data.
   *
   * @param {*} data
   * @returns
   * @memberof AdminService
   */
  updateIngredientCategory(id, data) {
    return this.http.put(this.url + 'api/admin/updateIngredientCategory/' + id, data);
  }

  /**
   *Used to create selected ingredient category items
   *
   * @param {*} data
   * @returns
   * @memberof AdminService
   */
  addIngredientCategoryItem(data) {
    return this.http.post(this.url + 'api/admin/registerIngredient', data);
  }
  /**
   *Used to get all ingredient category items based on company id of selected category.
   *
   * @param {*} id
   * @returns
   * @memberof AdminService
   */
  getAllingredientCategoryitem(id) {
    return this.http.get(this.url + 'api/admin/getAllIngredients/' + id);
  }

  /**
   * Used to delete category based on category id.
   *
   * @param {*} id
   * @returns
   * @memberof AdminService
   */
  deleteCategory(id) {
    return this.http.delete(this.url + 'api/admin/ingredientcategory/' + id);
  }

  /**
   * Used to update ingredient category item with data.
   *
   * @param {*} data
   * @returns
   * @memberof AdminService
   */
  updateIngredientCategoryItem(id, data) {
    return this.http.put(this.url + 'api/admin/updateIngredientCategoryItem/' + id, data);
  }

  /**
   * Used to delete category item based on category id.
   *
   * @param {*} id
   * @returns
   * @memberof AdminService
   */
  deleteCategoryItem(id) {
    return this.http.delete(this.url + 'api/admin/ingredientcategoryItem/' + id);
  }

  /**
   * Used to upload photo to mongodb
   * @param data 
   */
  uploadPhoto(data) {
    return this.http.post(this.url + 'api/images/upload', data);
  }

  uploadVideos(data) {
    return this.http.post(this.url + 'api/videos/upload', data);
  }

  /**
   * Used to delete photo from mongodb
   * @param filename 
   */
  deletePhoto(filename) {
    return this.http.delete(this.url + 'api/images/uploadedfiles/' + filename);
  }

  themeSetting() {
    this.themeCustomize.emit();
  }
  addNew() {
    this.addNewTheme.emit();
  }

  /** Set User Theme */
  userTheme(data) {
    return this.http.post(this.url + 'api/theme-setting/active', data);
  }

  /** Get User Active theme */
  getActiveTheme(id) {
    return this.http.get(this.url + 'api/theme-setting/active/' + id);
  }

  /** Save User setting */
  settingTheme(data) {
    return this.http.post(this.url + 'api/theme-setting', data);
  }
  getThemeSetting(data) {
    return this.http.post(this.url + 'api/theme-setting/list', data);
  }


  getThemeList() {
    return this.http.get(this.url + 'api/theme-setting/theme-list');
  }
  updateDefaultSetting(data) {
    let id = { userId : data}
    return this.http.post(this.url + 'api/theme-setting/update', id);
  }


  /** Save admin setting */
  adminThemeUpdate(data) {
    return this.http.post(this.url + 'api/admin/theme-update', data);
  }

  /** get admin setting */
  getThemeAdminSetting(data) {
    return this.http.post(this.url + 'api/admin/theme-list', data);
  }

  /** get admin setting */
  restoreSetting(data) {
    return this.http.post(this.url + 'api/theme-setting/restore', data);
  }


  deleteTheme(data) {
    return this.http.delete(this.url + 'api/admin/theme-delete/' + data);
  }




}




