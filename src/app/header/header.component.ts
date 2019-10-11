import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material';
import { AccessCodesComponent } from '../dialogs/access-codes/access-codes.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  viewIcon : any = 'false';
  teamMembers: any = [];
  wasClicked = false;
  sectionTitle : string = ' Account Settings';
  constructor(
    private AuthService : AuthService,
    private userservice : UserService,
    public dialog: MatDialog,
  ) {
    
    this.getAllEmployees();
   }

  onClick(){
    this.wasClicked = !this.wasClicked;
    this.AuthService.toggleMenus();
  }

  previewPage(){
    this.AuthService.togglepreview();
  }

    /**
   *Used to get list of all available employees
   *
   * @memberof HomeComponent
   */
  getAllEmployees() {
    // this.tabletloading = true;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userservice.getEmployees(currentUser.user._id).subscribe((res: any) => {
      // this.tabletloading = false;
      if (res.data) {
        this.teamMembers = res.data;
      }
    });
  }

  openAccessCodes() {
    const dataItem = JSON.parse(JSON.stringify(this.teamMembers));
    const dialogRef = this.dialog.open(AccessCodesComponent, { data: dataItem });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === 'No') {
      } else {
        if (result == 'Yes') {
          //  this.getAllEmployees();
        }
      }
    });
  }

  ngOnInit() {
    this.AuthService.closeToggle.subscribe((data: any) => {
      this.wasClicked = !this.wasClicked;
      this.AuthService.toggleMenus();
    });
    this.AuthService.headerTitle.subscribe((data: any) => {
      if (data) {
        if (data == 'Menu Design') {
          let themeName = localStorage.getItem('themename');
          if (themeName) {
            this.sectionTitle = themeName;
          } else {
            this.sectionTitle = data;
          }
        } else {
          this.sectionTitle = data;
        }
      }
    });
    this.AuthService.previewIcon.subscribe((data: boolean) => {
      if(data){
        this.viewIcon = data;
      }
    });
  }
}
