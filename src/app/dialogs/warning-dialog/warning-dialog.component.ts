import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss']
})
export class WarningDialogComponent implements OnInit {
  title = '';
  message = '';
  show: Boolean = true;
  yesbtn:String = 'Yes';
  constructor(public dialogRef: MatDialogRef<WarningDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,) { }

  /**
   * Executes when dialog loads.
   *
   * @memberof WarningDialogComponent
   */
  ngOnInit() {
    this.title = this.data.title;
    this.message = this.data.message;
    this.show = (this.data.show == false ) ? false : true;
    this.yesbtn = this.data.yesbtn?this.data.yesbtn:this.yesbtn;
   }

  /**
   * Yes button action of alert dialog
   *
   * @memberof WarningDialogComponent
   */
  save() {
    this.dialogRef.close('Yes');
  }

  /**
   * No button action of alert dialog
   *
   * @memberof WarningDialogComponent
   */
  close() {
    this.dialogRef.close('No');
  }
}
