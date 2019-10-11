import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material';
import { ImageCompressService } from 'ng2-image-compress';
import { Options } from 'ng5-slider';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-item-details',
  templateUrl: './menu-item-details.component.html',
  styleUrls: ['./menu-item-details.component.scss']
})
export class MenuItemDetailsComponent implements OnInit {

  itemDetailSetting: any = {
    layOutType: 'thumbnail',
    listBg: '#000',
    titleColor: '#fff',
    discColor: '#fff',
    modify_tColor: '#fff',
    modify_HColor: '#fff',
    titlesize: 30,
    discsize: 18,
    modify_tsize: 30,
    modify_Hsize: 22,
    LocalImgUrl: '',
    imagestyle: "fix",
  }
  headerSetting: any = {
    fontFamily: 'Roboto',
    priceFamily: 'Roboto',
    navBarIcon: '#fff',
    navbarTxt: '#fff',
    navbarBg: '#171732',
    navbarBorder: '#252660',
    neutralTxt: '#fff',
    neutralbg: '#282D43',
    confirmBtn: '#32348e',
    confirmTxt: '#FFFFFF',
    neutralBck: '#000',
    currency: '$',
    priceFormat: '$0.00',
    listColor: '#fff',
  }


  wasClicked = false;
  public themeId = null;
  public Id = null;
  public crrntUser;
  public themeName;
  constructor(
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {

  }


  // Fonts Size Range
  options1: Options = {
    floor: 26,
    ceil: 34,
    step: 1,
    showTicks: true
  };
  options2: Options = {
    floor: 14,
    ceil: 22,
    step: 1,
    showTicks: true
  };
  options3: Options = {
    floor: 26,
    ceil: 34,
    step: 1,
    showTicks: true
  };
  options4: Options = {
    floor: 18,
    ceil: 26,
    step: 1,
    showTicks: true
  };

  onPreviw() {
    this.wasClicked = !this.wasClicked;
  }


  layoutType(data) {
    this.itemDetailSetting.layOutType = data;
  }

  bgimageStyle(data) {
    this.itemDetailSetting.imagestyle = data;
  }

  removeLocalImg() {
    this.itemDetailSetting.LocalImgUrl = '';
  }


  /** Upload Image */
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            // this.itemDetailSetting.LocalImgUrl = image.imageDataUrl;
            let input = new FormData();
            input.append('file', file);
            this.adminService.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                this.itemDetailSetting.LocalImgUrl = res.url;
              }
            });
          });

        }, (error) => {
          // console.log("Error while converting");
        });
      });
    }
  }

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
      itemDetailSetting: this.itemDetailSetting
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
          neutralTxt: dataHeader.neutralTxt,
          neutralbg: dataHeader.neutralbg,
          confirmTxt: dataHeader.confirmTxt,
          confirmBtn: dataHeader.confirmBtn,
          neutralBck: dataHeader.neutralBck,
          currency: dataHeader.currency,
          priceFormat: dataHeader.priceFormat,
          listColor: dataHeader.listColor,
        }
      }
      if (res.data !== null && res.data.itemDetailSetting) {
        let data = res.data.itemDetailSetting;
        this.itemDetailSetting = {
          layOutType: data.layOutType,
          listBg: data.listBg,
          titleColor: data.titleColor,
          discColor: data.discColor,
          modify_tColor: data.modify_tColor,
          modify_HColor: data.modify_HColor,
          titlesize: data.titlesize,
          discsize: data.discsize,
          modify_tsize: data.modify_tsize,
          modify_Hsize: data.modify_Hsize,
          LocalImgUrl: data.LocalImgUrl,
          imagestyle: data.imagestyle,
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
