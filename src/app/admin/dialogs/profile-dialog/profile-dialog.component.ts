import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { AdminService } from 'src/app/services/admin.service';
import { UtilService } from 'src/app/services/util.service';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {

  /**
   * Used to store update form data
   *
   * @type {FormGroup}
   * @memberof ProfileDialogComponent
   */
  updateForm: FormGroup;
  /**
   * Used to store selected user's data
   */
  selecteduser: any = '';
  /**
   * Used to show actions in drop down menu.
   */
  actions = ['Remove account', 'Basic plan', 'Advanced plan'];

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileDialogComponent>, public adminservice: AdminService,
    public dialog: MatDialog, public util: UtilService) {
  }

  /**
   * Executes when profile dialog loads
   *
   * @memberof ProfileDialogComponent
   */
  ngOnInit() {
    this.selecteduser = this.data;
    var action = '';
    if (this.selecteduser.status === 'Basic plan') {
      action = 'Basic plan';
    } else if (this.selecteduser.status === 'Advanced plan') {
      action = 'Advanced plan';
    } else {
      action = '';
    }
    this.updateForm = this.formBuilder.group({
      action: [action, Validators.required]
    });
  }

  /**
   * Used to close the profile dialog
   *
   * @memberof ProfileDialogComponent
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Executes when admin clicks on update button of profile dialog.
   *
   * @param {*} selecteduser
   * @memberof ProfileDialogComponent
   */
  updateData(selecteduser) {
    if (selecteduser.status === this.updateForm.get('action').value) {
      this.util.showToast('Selected plan is already ' + selecteduser.status);
    } else if (this.updateForm.get('action').value === '') {
      this.util.showToast('Please select action.');
    }
    else {
      if (this.actions[0] === this.updateForm.get('action').value) {
        // console.log('Remove user');
        this.openFeedbackDialog();
      }
      if (this.actions[1] === this.updateForm.get('action').value) {
        // console.log('Basic plan');
        const data = { status: this.updateForm.get('action').value };
        this.updateStatus(selecteduser._id, data);
        this.dialogRef.close('Yes');
      }
      if (this.actions[2] === this.updateForm.get('action').value) {
        // console.log('Advanced plan');
        const data = { status: this.updateForm.get('action').value };
        this.updateStatus(selecteduser._id, data);
        this.dialogRef.close('Yes');
      }
    }

  }

  /**
   * Used to open feedback dialog when admin tries to remove selected user
   *
   * @memberof ProfileDialogComponent
   */
  openFeedbackDialog() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.deleteData(this.selecteduser._id);
        this.dialogRef.close('Yes');
      }
    });
  }

  /**
   * Used to delete selected user
   */
  deleteData(id) {
    this.adminservice.deleteUser(id).subscribe((res: any) => {
      if (res.message) {
        this.util.showToast(res.message);
      } else {
        this.util.showToast('Something went wrong');
      }
    });
  }

  /**
   * Used to update status of selected user.
   *
   * @param {*} id
   * @param {*} data
   * @memberof ProfileDialogComponent
   */
  updateStatus(id, data) {
    this.adminservice.updateUser(id, data).subscribe((res: any) => {
      if (res.success) {
        this.util.showToast('Status updated successfully');
      } else {
        this.util.showToast('Something went wrong');
      }
    });
  }


}
