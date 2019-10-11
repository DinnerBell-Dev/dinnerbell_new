import { Component, ViewContainerRef } from '@angular/core';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-base-settings',
  templateUrl: './base-settings.component.html',
  styleUrls: ['./base-settings.component.scss']
})
export class BaseSettingsComponent {

  // Base Theme Setting
  baseSetting: any = {
    fontFamily: 'Roboto',
    priceFamily: 'Roboto',
    navBarIcon: '#fff',
    navbarTxt: '#fff',
    navbarBg: '#171732',
    navbarBorder: '#252660',
    listBg: '#292A55',
    listBorder: '#292A55',
    listSelect: '#33358E',
    listPrice: '#fff',
    listColor: '#fff',
    neutralbg: '#282D43',
    neutralBck: '#333333',
    neutralTxt: '#fff',
    confirmBtn: '#32348e',
    confirmTxt: '#FFFFFF',
    alert: '#55001b',
    alertTxt: '#FFFFFF',
    confirmDialog: '#005826',
    confirmDialogTxt: '#FFFFFF',
    currency: '$',
    priceFormat: '$0.00'
  }



  // public basesetting: Array<any> = [];
  public themeId = null;
  public Id = null;
  public crrntUser;
  public themeName;
  wasClicked = false;
  constructor(
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private adminService: AdminService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {

  }

  /**
   * On preview On mobile
   * Divices
   */
  onPreviw() {
    this.wasClicked = !this.wasClicked;
  }

  public onEventLog(event: string, data: any): void {
    // console.log(event, data);
  }

  navIconColor(data){
    this.baseSetting.navBarIcon = data;
  }

  /**
   * Update Basesetting
   */
  updateBaseSettings() {
    // console.log(this.themeName)
    let theme = {
      name: this.themeName,
      userId: this.crrntUser,
      themeId: this.themeId,
      Id: this.Id,
      baseSetting: this.baseSetting
    }
    this.adminService.settingTheme(theme).subscribe((res: any) => {
      if (res) {
        this.snackBar.open('Save Setting Successfully.', '', { duration: 3000, verticalPosition: 'bottom' });
      }
    });
  }

  /**
   *  Get Theme Setting 
   * 
   */
  getthemeSetting(id, theme) {
    let data = {
      userId: id,
      name: theme
    }
    this.adminService.getThemeSetting(data).subscribe((res: any) => {
      if (res.data !== null && res.data.baseSetting) {
        let data = res.data.baseSetting;
        this.baseSetting = {
          fontFamily: data.fontFamily,
          priceFamily: data.priceFamily,
          navBarIcon: data.navBarIcon,
          navbarTxt: data.navbarTxt,
          navbarBg: data.navbarBg,
          navbarBorder: data.navbarBorder,
          listBg: data.listBg,
          listBorder: data.listBorder,
          listSelect: data.listSelect,
          listPrice: data.listPrice,
          listColor: data.listColor,
          neutralbg: data.neutralbg,
          neutralBck: data.neutralBck,
          neutralTxt: data.neutralTxt,
          confirmBtn: data.confirmBtn,
          confirmTxt: data.confirmTxt,
          alert: data.alert,
          alertTxt: data.alertTxt,
          confirmDialog: data.confirmDialog,
          confirmDialogTxt: data.confirmDialogTxt,
          currency: data.currency,
          priceFormat: data.priceFormat

        }
      }
      if (res.data._id !== null) {
        this.themeId = res.data.themeId;
        this.Id = res.data._id;
      }
    })
  }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.crrntUser = currentUser.user._id;
    this.themeName = localStorage.getItem('theme');
    if (this.crrntUser && this.themeName) {
      this.getthemeSetting(this.crrntUser, this.themeName);
    }
    this.authService.getViewIcon('true');
    this.authService.previewToggle.subscribe((data: any) => {
      this.wasClicked = !this.wasClicked;
    });
  }

}
