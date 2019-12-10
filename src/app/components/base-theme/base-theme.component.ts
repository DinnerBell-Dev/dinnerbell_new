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
  public activatedTheme = null;
  public themeList;
  public themeNotFount : any = '';
  constructor(
    private adiminService: AdminService,
    private authservice: AuthService,
    private snackBar: MatSnackBar
  ) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.currentUsr = currentUser.user._id;
      this.getActiveTheme(this.currentUsr);
    }
    // this.authservice.getHeaderTitle('Base theme');
  }


  /**
   * Get activated theme
   * @param data 
   */
  getActiveTheme(data) {
    this.adiminService.getActiveTheme(data).subscribe((res: any) => {
      if (res.success == true && res.data != null) {
        this.activatedTheme = res.data.name;
        this.adiminService.checkSelectedTheme();
        localStorage.setItem('theme', res.data.themeId);
        localStorage.setItem('themename', res.data.name);
      } else {
        this.activatedTheme = null;
        this.themeNotFount = 'No Theme found';
        localStorage.removeItem('theme');
        localStorage.removeItem('themename');
      }
    });
  }


  /**
   * Activate theme for use
   * @param data 
   */
  useTheme(data) {
    let theme = {
      userId: this.currentUsr,
      themeId: data
    }
    this.adiminService.userTheme(theme).subscribe((res: any) => {
      if (res.data) {
        // this.adiminService.getActiveTheme(this.currentUsr).subscribe((response: any) => {
        //   if (response.success == true && response.data != null) {
        //     localStorage.setItem('themename', response.data.name);
        //     this.activatedTheme = response.data.name;
        //   }
        // });
        localStorage.setItem('theme', res.data.themeId);
        localStorage.setItem('themename', res.data.name);
            this.activatedTheme = res.data.name;
        this.adiminService.checkSelectedTheme();
      }
    })

  }

  /**
   * Customize theme emiter
   */
  customizeTheme() {
    this.adiminService.themeSetting();
  }


  /**
   * Restore theme setting
   * @param params 
   */

  restoreSetting(params) {
    let data = {
      themeId: params._id,
      userId: this.currentUsr,
    }
    this.adiminService.restoreSetting(data).subscribe((res: any) => {
      this.snackBar.open('Restore theme Setting Successfully.', '', { duration: 3000, verticalPosition: 'top' });
    });
  }

  /**
   * Get theme list
   */
  getListofTheme() {
    this.adiminService.getThemeList().subscribe((res: any) => {
      if (res.data.length >= 1) {
        this.adiminService.checkHaveTheme('true');
        this.themeList = res.data;
      } else {
        this.themeList = null;
        this.adiminService.checkHaveTheme('false');
        localStorage.removeItem('theme');
        localStorage.removeItem('themename');
      }
    });
  }

  ngOnInit() {
    this.authservice.getViewIcon('false');
    this.getListofTheme();
  }
}
