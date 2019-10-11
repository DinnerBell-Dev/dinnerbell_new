import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(public snackBar: MatSnackBar) {
  }
  /**
   * Used to toast message in app.
   *
   * @param {*} msg
   * @memberof UtilService
   */
  showToast(msg) {
    this.snackBar.open('' + msg, '', { duration: 3000, verticalPosition: 'top' });
  }

  showActionToast(msg,action) {
    this.snackBar.open('' + msg, action, { duration: 5000, verticalPosition: 'top' });
  }
}
