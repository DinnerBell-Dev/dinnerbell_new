import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/services/admin.service';
import { UtilService } from 'src/app/services/util.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-team-member',
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.scss']
})
export class TeamMemberComponent implements OnInit {
  
  memberDetails;
  createdDate;
  tabletloading: Boolean = false;
  currentUser;
  accessCode;
  
  constructor(public dialogRef: MatDialogRef<TeamMemberComponent>,
    public userservice: UserService,public adminservice: AdminService,
     public util: UtilService, @Inject(MAT_DIALOG_DATA) public data: any) { }
/**
   * Executes when dialog loads.
   *
   * @memberof TeamMemberComponent
   */
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.memberDetails = this.data;
    const tempdate = new Date(this.memberDetails.createdAt);
    this.createdDate = (tempdate.getMonth()+1)+'/'+tempdate.getDate()+'/'+tempdate.getFullYear();
    this.accessCode = this.memberDetails.token+'_'+this.currentUser.user.restaurantCode;
  }
  /**
   * No button action of alert dialog
   *
   * @memberof TeamMemberComponent
   */
  close() {
    this.dialogRef.close('No');
  }
  
  resendCode(){
    this.tabletloading = true;
    const data ={employeeId:this.memberDetails._id,restaurant:this.currentUser.user}
    this.userservice.resetUserCodes(data).subscribe((res:any)=>{
      this.tabletloading = false;
      if(res.success == true){
        this.util.showToast(res.message);
        this.dialogRef.close('Yes');
      } else {
        this.util.showToast('Something went wrong');
      }
    })
    
  }

}
