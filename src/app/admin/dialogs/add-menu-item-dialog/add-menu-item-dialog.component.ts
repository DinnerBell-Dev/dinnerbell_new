import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-menu-item-dialog',
  templateUrl: './add-menu-item-dialog.component.html',
  styleUrls: ['./add-menu-item-dialog.component.scss']
})
export class AddMenuItemDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddMenuItemDialogComponent>) { }

  /**
    * Executes when dialog loads.
    *
    * @memberof AddMenuItemDialogComponent
    */
  ngOnInit() { }

  /**
   * Yes button action of alert dialog
   *
   * @memberof AddMenuItemDialogComponent
   */
  save() {
    this.dialogRef.close('Yes');
  }

  /**
   * No button action of alert dialog
   *
   * @memberof AddMenuItemDialogComponent
   */
  close() {
    this.dialogRef.close('No');
  }

}
