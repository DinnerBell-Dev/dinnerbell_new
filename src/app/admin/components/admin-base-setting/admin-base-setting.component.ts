import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ColorPickerService } from 'ngx-color-picker';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ImageCompressService } from 'ng2-image-compress';

@Component({
  selector: 'app-admin-base-setting',
  templateUrl: './admin-base-setting.component.html',
  styleUrls: ['./admin-base-setting.component.scss']
})
export class AdminBaseSettingComponent implements OnInit {

  newtheme : boolean = false;

  // Base Theme Setting
  baseTheme: any = {
    name: '',
    photo_url: '',
    photo_name: ''
  }
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


  public themeId = null;
  public Id = null;
  public crrntUser;
  public themeName;
  wasClicked = false;
  checkHaveTheme: boolean = false;
  constructor(
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private adminService: AdminService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {

  }

  onPreviw() {
    this.wasClicked = !this.wasClicked;
  }

  public onEventLog(event: string, data: any): void {
    // console.log(event, data); 
  }

  navIconColor(data) {
    this.baseSetting.navBarIcon = data;
  }



  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then((file: any) => {
            let input = new FormData();
            input.append('file', file);
            this.adminService.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                this.baseTheme.photo_url = res.url;
                this.baseTheme.photo_name = res.photo_name;
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


  // Remove Cover Image
  removeLocalImg() {
    this.baseTheme.photo_url = '';
  }


  updateBaseSettings() {
    let addtheme = localStorage.getItem('newTheme');
    let result = {
      name: this.baseTheme.name,
      photo_url: this.baseTheme.photo_url,
      adminId: this.crrntUser,
      photo_name: this.baseTheme.photo_name
    }
    if (addtheme) {
      this.addBaseTheme(result);
    } else {
      let theme = {
        userId: this.crrntUser,
        themeId: this.themeId,
        Id: this.Id,
        baseSetting: this.baseSetting,
        name: this.baseTheme.name,
        photo_url: this.baseTheme.photo_url,
      }
      this.adminService.adminThemeUpdate(theme).subscribe((res: any) => {
        if (res) {
          this.authService.getHeaderTitle(this.baseTheme.name);
          localStorage.setItem('theme', this.baseTheme.name);
          this.snackBar.open('Save Setting Successfully.', '', {panelClass:"custom_sneak_bar", duration: 3000, verticalPosition: 'bottom' });
        }
      });
    }
  }


  /** Get Theme Setting */
  getthemeSetting(id, theme) {
    let data = {
      name: theme
    }
    this.adminService.getThemeAdminSetting(data).subscribe((res: any) => {
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
        this.Id = res.data._id;
        this.themeId = res.data.themeId;
        this.baseTheme = {
          name: res.data.name,
          photo_url: res.data.photo_url
        }
      }
    })
  }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('adminUser'));
    let addtheme = localStorage.getItem('newTheme'); 
    if(addtheme){
      this.newtheme = true;
    }else{
      this.newtheme = false;
    }
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

  deleteTheme(id){
    this.adminService.deleteTheme(this.themeId).subscribe((res : any) =>{
      if(res){

        this.snackBar.open('Delete theme Successfully.', '', {panelClass:"custom_sneak_bar", duration: 3000, verticalPosition: 'bottom' });
        this.adminService.themeDelete()
      }
    });
  }


  addBaseTheme(result) {
    result['baseSetting'] = {
      fontFamily: 'Roboto',
      priceFamily: 'Roboto',
      navigation: '#fff',
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
      priceFormat: '$0.00',
    };
    result['feedbackSetting'] = {
      layOutType: 'thumbnail',
      listBg: '#000',
      excellentColor: '#3F9329',
      Excellentbg: '#619F4B',
      verygoodColor: '#2B960F',
      verygoodbg: '#0B2717',
      goodColor: '#FCB016',
      gooddbg: '#34260D',
      notgoodColor: '#BC6226',
      notgooddbg: '#312612',
      badColor: '#C31010',
      badbg: '#3A0808',
      titlesize: 22,
      categorysize: 14,
      assignsize: 14,
      marginTop: 0,
      LocalImgUrl: '',
      imagestyle: "fix"
    };
    result['mainMenu'] = {
      layOutType: 'thumbnail',
      listBg: '#000',
      infoBg: '#000',
      itemColor: '#fff',
      infoColor: '#fff',
      itemsize: 26,
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

    result['introSetting'] = {
      LocalImgUrl: '',
      imagestyle: "fix",
      logoUrl: '',
      videoUrl: '',
      slide1: '',
      slide2: '',
      slide3: '',
      slide4: '',
      slide5: '',
      slide6: '',
    }
    result['itemDetailSetting'] = {
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
    result['menuItemSetting'] = {
      layOutType: 'thumbnail',
      listBg: '#000',
      spicy: '#C13548',
      popular: '#33A457',
      special: '#EBBA19',
      new: '#7B7FE7',
      header: 28,
      subsection: 36,
      headerColor: '#fff',
      subsectionColor: '#fff',
      itemtitle: 22,
      price: 22,
      itemtitleColor: '#fff',
      priceColor: '#fff',
      itemtitle2: 18,
      price2: 18,
      itemtitle2Color: '#fff',
      price2Color: '#fff',
      spacing: 60,
      LocalImgUrl: '',
      imagestyle: "fix",
    }
    result['orderSetting'] = {
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
      catColor: '#1e7ac9',
      itemColor: '#fff',
      headerColor: '#fff'
    }
    this.adminService.addBaseTheme(result).subscribe((res: any) => {
      if (res.data) {
        localStorage.removeItem('newTheme');
        this.baseTheme = {
          name: res.data.name,
          photo_url: res.data.photo_url
        }
        this.Id = res.data._id;
        this.themeId = res.data.themeId;
        localStorage.setItem('theme', res.data.name);
        this.authService.getHeaderTitle(res.data.name);
        this.adminService.themeSetting();
        this.newtheme = false;
        this.adminService.checkHaveTheme('true');


        let theme = {
          userId: this.crrntUser,
          themeId: this.themeId,
          Id: this.Id,
          baseSetting: this.baseSetting,
          name: res.data.name,
          photo_url: res.data.photo_url

        }
        this.adminService.adminThemeUpdate(theme).subscribe((res: any) => {
          if (res) {
            this.snackBar.open('Save Setting Successfully.', '', { panelClass:"custom_sneak_bar", duration: 3000, verticalPosition: 'bottom' });
            this.themeName = localStorage.getItem('theme');
            if (this.crrntUser && this.themeName) {
              this.getthemeSetting(this.crrntUser, this.themeName);
              
            }
          }
        });
      }
    });
  }




}
