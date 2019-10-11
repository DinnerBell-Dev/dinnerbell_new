import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/services/admin.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-access-codes',
  templateUrl: './access-codes.component.html',
  styleUrls: ['./access-codes.component.scss']
})
export class AccessCodesComponent implements OnInit {


  tabletloading: Boolean = false;
  currentUser;
  accessCode;
  teamMembers;
  employee;
  dataToShow;
  
  constructor(public dialogRef: MatDialogRef<AccessCodesComponent>,
    public userservice: UserService,public adminservice: AdminService,
     public util: UtilService, @Inject(MAT_DIALOG_DATA) public data: any) { }
/**
   * Executes when dialog loads.
   *
   * @memberof AccessCodesComponent
   */
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.teamMembers = this.data;
    console.log(this.data);
    if(this.teamMembers.length){
      this.employee = this.teamMembers[0]._id;
      this.dataToShow = this.teamMembers[0];
    }
  }
  /**
   * No button action of alert dialog
   *
   * @memberof AccessCodesComponent
   */
  close() {
    this.dialogRef.close('No');
  }

  userChanged(value){
    this.teamMembers.forEach(element => {
      if(element._id == value){
        this.dataToShow = element;
      }
    });
  }

}
