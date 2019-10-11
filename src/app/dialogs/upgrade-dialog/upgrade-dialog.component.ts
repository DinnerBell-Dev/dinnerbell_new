import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-upgrade-dialog',
  templateUrl: './upgrade-dialog.component.html',
  styleUrls: ['./upgrade-dialog.component.scss']
})
export class UpgradeDialogComponent implements OnInit {

  /**
   * Used to store upgrade form information.
   */
  upgradeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<UpgradeDialogComponent>, private formBuilder: FormBuilder) { }

  /**
   * Executes when upgrade dialog loads.
   */
  ngOnInit() {
    this.upgradeForm = this.formBuilder.group({
      plan: ['', Validators.required]
    });
  }

  public get f() { return this.upgradeForm.controls; }

  /**
   * Executes when user clicks on upgrade button
   *
   * @memberof UpgradeDialogComponent
   */
  upgrade() {
    this.dialogRef.close('Yes');
  }

  /**
   * Udes to close the dialog.
   */
  close() {
    this.dialogRef.close('No');
  }

  /**
 * Remove leading and traling spaces in input fields
 *
 * @param {*} string
 * @returns
 * @memberof UpgradeDialogComponent
 */
  removeSpaces(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }


}
