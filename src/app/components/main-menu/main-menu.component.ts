import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { ImageCompressService } from 'ng2-image-compress';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material';
import { Options } from 'ng5-slider';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  mainMenu: any = {
    layOutType: 'thumbnail',
    listBg: '#000',
    infoBg: '#000',


    itemColor: '#fff',
    infoColor: '#fff',
    itemsize: 24,
    infosize: 24,
    LocalImgUrl: '',
    LocalImgUrl2: '',
    imagestyle: 'fix',
    imagestyle2: 'fix',
    fontWight: 'normal',
    fontWight2: 'normal',
    listBorderColor: '#eee',
    thumbborderColor: '#eee',
    infoborderColor: '#eee',
    itemSpace: 20,
    infoSpace: 20,
  }

  headerSetting: any = {
    fontFamily: 'Roboto',
    priceFamily: 'Roboto',
    navBarIcon: '#fff',
    navbarTxt: '#fff',
    navbarBg: '#171732',
    navbarBorder: '#252660',
  }



  wasClicked = false;
  public themeId = null;
  public Id = null;
  public crrntUser;
  public themeName;
  public activeThemeName;
  constructor(
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private userservice: UserService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {


  }

  // Fonts Size Range
  options1: Options = {
    floor: 20,
    ceil: 28,
    step: 1,
    showTicks: true
  };
  options2: Options = {
    floor: 20,
    ceil: 28,
    step: 1,
    showTicks: true
  };


  onPreviw() {
    this.wasClicked = !this.wasClicked;
  }

  layoutType(data) {
    this.mainMenu.layOutType = data;
    // console.log(this.mainMenu);
  }

  bgimageStyle(data) {
    this.mainMenu.imagestyle = data;
  }

  /** REmove Local Image */
  removeLocalImg() {
    this.mainMenu.LocalImgUrl = '';
  }

  bgimageStyle2(data) {
    this.mainMenu.imagestyle2 = data;
  }

  /** REmove Local Image */
  removeLocalImg2() {
    this.mainMenu.LocalImgUrl2 = '';
  }


  /** Upload Image */
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            // this.mainMenu.LocalImgUrl = image.imageDataUrl;
            let input = new FormData();
            input.append('file', file);
            this.userservice.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                this.mainMenu.LocalImgUrl = res.url;
              }
            });
          });

        }, (error) => {
          // console.log("Error while converting");
        });
      });
    }
  }
  
  /** Upload Image */
  onFileChange1(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            // this.mainMenu.LocalImgUrl = image.imageDataUrl;
            let input = new FormData();
            input.append('file', file);
            this.userservice.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                this.mainMenu.LocalImgUrl2 = res.url;
              }
            });
          });

        }, (error) => {
          // console.log("Error while converting");
        });
      });
    }
  }

  /**
   * 
   * @param url 
   * @param filename 
   * @param mimeType 
   */
  urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then(function(res) { return res.arrayBuffer(); })
      .then(function(buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }

  /** Save Menus Setting */
  uploadMainMenuSettings() {
    let theme = {
      name: this.themeName,
      themeId: this.themeId,
      userId: this.crrntUser,
      Id: this.Id,
      mainMenu: this.mainMenu
    }
    this.adminService.settingTheme(theme).subscribe((res: any) => {
      if (res) {
        this.snackBar.open('Save Setting Successfully.', '', { duration: 3000, verticalPosition: 'bottom' });
      }
    });
  }


  /** Get Theme Setting */
  getthemeSetting(id, theme) {
    let data = {
      userId: id,
      name: theme
    }
    this.adminService.getThemeSetting(data).subscribe((res: any) => {
      if (res.data !== null && res.data.baseSetting) {
        let dataHeader = res.data.baseSetting;
        this.headerSetting = {
          fontFamily: dataHeader.fontFamily,
          priceFamily: dataHeader.priceFamily,
          navBarIcon: dataHeader.navBarIcon,
          navbarTxt: dataHeader.navbarTxt,
          navbarBg: dataHeader.navbarBg,
          navbarBorder: dataHeader.navbarBorder,
        }
      }
      if (res.data !== null && res.data.mainMenu) {
        let data = res.data.mainMenu;
        this.mainMenu = {
          layOutType: data.layOutType,
          listBg: data.listBg,
          infoBg: data.infoBg,
          itemColor: data.itemColor,
          infoColor: data.infoColor,
          itemsize: data.itemsize,
          infosize: data.infosize,
          LocalImgUrl: data.LocalImgUrl,
          imagestyle: data.imagestyle,
          LocalImgUrl2: data.LocalImgUrl2,
          imagestyle2: data.imagestyle2,
          fontWight: data.fontWight,
          fontWight2: data.fontWight2,
          listBorderColor:data.listBorderColor,
          thumbborderColor: data.thumbborderColor,
          infoborderColor: data.infoborderColor,
          itemSpace: data.itemSpace,
          infoSpace: data.infoSpace,
        }
      }
      if (res.data._id) {
        this.themeId = res.data.themeId;
        this.Id = res.data._id;
      }
    });
  }

  public onEventLog(event: string, data: any): void {
    // console.log(event, data);
  }

  ngOnInit() {
    this.authService.getHeaderTitle('Menu Design');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.crrntUser = currentUser.user._id;
    this.themeName = localStorage.getItem('theme');
    this.activeThemeName = localStorage.getItem('themename');
    if (this.crrntUser && this.themeName) {
      this.getthemeSetting(this.crrntUser, this.themeName);
    }
    this.authService.getViewIcon('true');
    this.authService.previewToggle.subscribe((data: any) => {
      this.wasClicked = !this.wasClicked;
    });
  }



}
