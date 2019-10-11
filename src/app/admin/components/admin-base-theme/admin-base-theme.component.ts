import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { UtilService } from 'src/app/services/util.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddThemesComponent } from '../../dialogs/add-themes/add-themes.component';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-base-theme',
  templateUrl: './admin-base-theme.component.html',
  styleUrls: ['./admin-base-theme.component.scss']
})
export class AdminBaseThemeComponent implements OnInit {
  ingredientloading: Boolean = false;
  /**
 * List Of Themes
 */

  themeList;
  constructor(
    private adminservice: AdminService,
    public util: UtilService,
    public dialog: MatDialog,
    public authservice: AuthService
  ) { }


  /**
  * To get all available list of ingredient categories.
  *
  * @memberof DashboardComponent
  */
  getThemsList() {
    this.ingredientloading = true;
    this.adminservice.getThemesList().subscribe((res: any) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.ingredientloading = false;
          this.themeList = res.data;
          this.adminservice.checkHaveTheme('true');
        } else {
          this.ingredientloading = false;
          this.themeList = [];
          this.adminservice.checkHaveTheme('false');
        }
      } else {
        this.ingredientloading = false;
        this.util.showToast('Something went wrong');
      }
    });
  }


  openAddthemeDialog() {
    localStorage.removeItem('theme');
    this.adminservice.addNew();
    this.authservice.getHeaderTitle('New Theme');
  }



  customizeTheme(data) {
    this.adminservice.themeSetting();
    localStorage.setItem('theme', data);
    localStorage.removeItem('newTheme');
    this.authservice.getHeaderTitle(data);
  }

  ngOnInit() {
    localStorage.removeItem('theme');
    this.authservice.getHeaderTitle('Theme Studio');
    this.getThemsList();
    this.authservice.getViewIcon('false');
    this.adminservice.removeTheme();
  }
}
