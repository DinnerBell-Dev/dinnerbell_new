import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})
export class FeedbackDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<FeedbackDialogComponent>) { }

  /**
   * Executes when dialog loads.
   *
   * @memberof FeedbackDialogComponent
   */
  ngOnInit() { }

  /**
   * Yes button action of alert dialog
   *
   * @memberof FeedbackDialogComponent
   */
  save() {
    this.dialogRef.close('Yes');
  }

  /**
   * No button action of alert dialog
   *
   * @memberof FeedbackDialogComponent
   */
  close() {
    this.dialogRef.close('No');
  }
}
