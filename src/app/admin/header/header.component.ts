import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  viewIcon: any = 'false';
  teamMembers: any = [];
  wasClicked = false;
  sectionTitle: string = 'Theme Studio';
  constructor(
    private AuthService: AuthService,
    private userservice: UserService,
    public dialog: MatDialog,
  ) {
    if (this.sectionTitle == 'Theme Studio') {
      let themeName = localStorage.getItem('theme');
      if (themeName) {
        this.sectionTitle = themeName;
      }
    }
  }

  previewPage() {
    this.AuthService.togglepreview();
  }

  onClick() {
    this.wasClicked = !this.wasClicked;
    this.AuthService.toggleMenus();
  }

  ngOnInit() {
    this.AuthService.closeToggle.subscribe((data: any) => {
      this.wasClicked = !this.wasClicked;
      this.AuthService.toggleMenus();
    });
    this.AuthService.headerTitle.subscribe((data: any) => {
      if (data) {
        if (data == 'Theme Studio') {
          let themeName = localStorage.getItem('theme');
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
      if (data) {
        this.viewIcon = data;
      }
    });
  }

}
