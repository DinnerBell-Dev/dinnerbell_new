import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-menu-dialog',
  templateUrl: './add-menu-dialog.component.html',
  styleUrls: ['./add-menu-dialog.component.scss']
})
export class AddMenuDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddMenuDialogComponent>) { }

  /**
   * Executes when dialog loads.
   *
   * @memberof AddMenuDialogComponent
   */
  ngOnInit() { }

  /**
   * Yes button action of alert dialog
   *
   * @memberof AddMenuDialogComponent
   */
  save() {
    this.dialogRef.close('Yes');
  }

  /**
   * No button action of alert dialog
   *
   * @memberof AddMenuDialogComponent
   */
  close() {
    this.dialogRef.close('No');
  }
}
