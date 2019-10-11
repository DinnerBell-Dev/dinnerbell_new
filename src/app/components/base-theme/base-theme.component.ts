import { Component, OnInit, ɵConsole } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-base-theme',
  templateUrl: './base-theme.component.html',
  styleUrls: ['./base-theme.component.scss']
})
export class BaseThemeComponent implements OnInit {

  constructorName: string = ''
  public currentUsr;
  public activatedTheme;
  public themeList;
  constructor(
    private adiminService: AdminService,
    private authservice: AuthService,
    private snackBar : MatSnackBar
  ) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.currentUsr = currentUser.user._id;
      this.getActiveTheme(this.currentUsr);
    }

  }


  getActiveTheme(data) {
    this.adiminService.getActiveTheme(data).subscribe((res: any) => {
      if (res.success == true && res.data != null) {
        this.activatedTheme = res.data.name;
        localStorage.setItem('theme', res.data.themeId);
        localStorage.setItem('themename', res.data.name);
      }else{
        localStorage.removeItem('theme');
        localStorage.removeItem('themename');
      }
    });
  }


  useTheme(data) {
    let theme = {
      userId: this.currentUsr,
      themeId: data
    }
    this.adiminService.userTheme(theme).subscribe((res: any) => {
      if (res.data) {
        localStorage.setItem('theme', res.data.themeId);
        this.activatedTheme = res.data.name;
        this.authservice.getHeaderTitle(res.data.name);
      }
    })

  }

  customizeTheme() {
    this.adiminService.themeSetting();
  }

  restoreSetting(params){
    let data = {
      themeId : params._id,
      userId : this.currentUsr,
    }
    this.adiminService.restoreSetting(data).subscribe((res : any) => {
      this.snackBar.open('Restore theme Setting Successfully.', '', { duration: 3000, verticalPosition: 'top' });
    });
  }
  
  getListofTheme() {
    this.adiminService.getThemeList().subscribe((res: any) => {
      if (res.data.length >= 1) {
        this.adiminService.checkHaveTheme('true');
        this.themeList = res.data; 
      } else {
        this.themeList = null;
        this.adiminService.checkHaveTheme('false');
        localStorage.removeItem('themename');
      }

    });
  }

  ngOnInit() {
    this.authservice.getViewIcon('false');
    this.getListofTheme();
  }
}
