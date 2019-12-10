import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { ImageCompressService } from 'ng2-image-compress';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material';
import { Options } from 'ng5-slider';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {


  /**
   * Default Settings
   */
  orderSetting: any = {
    layOutType: 'thumbnail',
    listBg: '#000',
    processsize: 14,
    processColor: '#BF650D',
    processbg: '#361A0B',
    pendingsize: 14,
    pendingColor: '#666666',
    pendingbg: '#361A0B',
    servedsize: 14,
    servedColor: '#629913',
    servedbg: '#15200C',
    headersize: 30,
    itemTsize: 22,
    catTsize: 14,
    LocalImgUrl: '',
    imagestyle: "fix",
    catColor : '#1e7ac9',
    itemColor : '#fff',
    headerColor : '#fff'
  }

  /**
   * Default header setting
   */
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
    currency: '$',
    priceFormat: '$0.00'

  }


  wasClicked = false;
  public themeId = null;
  public crrntUser;
  public Id = null;
  public themeName;
  public activeThemeName;
  constructor(
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.crrntUser = currentUser.user._id;
    this.themeName = localStorage.getItem('theme');
    this.activeThemeName = localStorage.getItem('themename');
    if (this.crrntUser && this.themeName) {
      this.getthemeSetting(this.crrntUser, this.themeName);
    }
  }

  // Fonts Size Range
  options1: Options = {
    floor: 10,
    ceil: 18,
    step: 1,
    showTicks: true
  };
  options2: Options = {
    floor: 10,
    ceil: 18,
    step: 1,
    showTicks: true
  };
  options3: Options = {
    floor: 10,
    ceil: 18,
    step: 1,
    showTicks: true
  };
  options4: Options = {
    floor: 26,
    ceil: 34,
    step: 1,
    showTicks: true
  };
  options5: Options = {
    floor: 18,
    ceil: 26,
    step: 1,
    showTicks: true
  };
  options6: Options = {
    floor: 10,
    ceil: 18,
    step: 1,
    showTicks: true
  };

  /**
   * On Preview
   */
  onPreviw() {
    this.wasClicked = !this.wasClicked;
  }

  layoutType(data) {
    this.orderSetting.layOutType = data;
  }

  bgimageStyle(data) {
    this.orderSetting.imagestyle = data;
  }

  removeLocalImg() {
    this.orderSetting.LocalImgUrl = '';
  }


  /** Upload Image */
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            // this.orderSetting.LocalImgUrl = image.imageDataUrl;
            let input = new FormData();
            input.append('file', file);
            this.adminService.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                this.orderSetting.LocalImgUrl = res.url;
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
  uploadOrderSettings() {
    let theme = {
      name: this.themeName,
      themeId: this.themeId,
      userId: this.crrntUser,
      Id: this.Id,
      orderSetting: this.orderSetting
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
          currency: dataHeader.currency,
          priceFormat: dataHeader.priceFormat
        }
      }
      if (res.data !== null && res.data.orderSetting) {
        let data = res.data.orderSetting;
        this.orderSetting = {
          layOutType: data.layOutType,
          listBg: data.listBg,
          processsize: data.processsize,
          processColor: data.processColor,
          processbg: data.processbg,
          pendingsize: data.pendingsize,
          pendingColor: data.pendingColor,
          pendingbg: data.pendingbg,
          servedsize: data.servedsize,
          servedColor: data.servedColor,
          servedbg: data.servedbg,
          headersize: data.headersize,
          itemTsize: data.itemTsize,
          catTsize: data.catTsize,
          LocalImgUrl: data.LocalImgUrl,
          imagestyle: data.imagestyle,
          catColor : data.catColor,
          itemColor : data.itemColor,
          headerColor : data.headerColor
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
    this.authService.getViewIcon('true');
    this.authService.previewToggle.subscribe((data: any) => {
      this.wasClicked = !this.wasClicked;
    });
  }



}
