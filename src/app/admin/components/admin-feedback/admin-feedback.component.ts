
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ColorPickerService } from 'ngx-color-picker';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material';
import { ImageCompressService } from 'ng2-image-compress';
import { AuthService } from 'src/app/services/auth.service';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.scss']
})
export class AdminFeedbackComponent implements OnInit {



  feedbackSetting: any = {
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
  }


  public themeId = null;
  public Id = null;
  public crrntUser;
  public themeName;
  wasClicked = false;
  newthemeName : boolean = false;
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
    floor: 18,
    ceil: 26,
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

  onPreviw() {
    this.wasClicked = !this.wasClicked;
  }

  layoutType(data) {
    this.feedbackSetting.layOutType = data;
  }

  bgimageStyle(data) {
    this.feedbackSetting.imagestyle = data;
  }

  removeLocalImg() {
    this.feedbackSetting.LocalImgUrl = '';
  }

  /** Upload Image */
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
                this.feedbackSetting.LocalImgUrl = res.url;
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
  uploadfeedback() {
    let theme = {
      themeId: this.themeId,
      Id: this.Id,
      userId: this.crrntUser,
      feedbackSetting: this.feedbackSetting
    }
    this.adminService.adminThemeUpdate(theme).subscribe((res: any) => {
      if (res) {
        this.snackBar.open('Save Setting Successfully.', '', { panelClass:"custom_sneak_bar", duration: 3000, verticalPosition: 'bottom' });
      }
    });
  }


  /** Get Theme Setting */
  getthemeSetting(theme) {
    let data = {
      name: theme
    }
    this.adminService.getThemeAdminSetting(data).subscribe((res: any) => {
      if (res.data !== null && res.data.baseSetting) {
        let dataHeader = res.data.baseSetting;
        this.headerSetting = {
          fontFamily: dataHeader.fontFamily,
          priceFamily: dataHeader.priceFamily,
          navBarIcon: dataHeader.navBarIcon,
          navbarTxt: dataHeader.navbarTxt,
          navbarBg: dataHeader.navbarBg,
          navbarBorder: dataHeader.navbarBorder,
          neutralTxt:  dataHeader.neutralTxt,
          neutralbg:  dataHeader.neutralbg,
          confirmTxt:  dataHeader.confirmTxt,
          confirmBtn:  dataHeader.confirmBtn,
          
        }
      }
      if (res.data !== null && res.data.feedbackSetting) {
        let data = res.data.feedbackSetting;
        this.feedbackSetting = {
          layOutType: data.layOutType,
          excellentColor: data.excellentColor,
          listBg: data.listBg,
          Excellentbg: data.Excellentbg,
          verygoodColor: data.verygoodColor,
          verygoodbg: data.verygoodbg,
          goodColor: data.goodColor,
          gooddbg: data.gooddbg,
          notgoodColor: data.notgoodColor,
          notgooddbg: data.notgooddbg,
          badColor: data.badColor,
          badbg: data.badbg,
          titlesize: data.titlesize,
          categorysize: data.categorysize,
          assignsize: data.assignsize,
          marginTop: data.marginTop,
          LocalImgUrl: data.LocalImgUrl,
          imagestyle: data.imagestyle,
        }

      }
      if (res.data._id) {
        this.Id = res.data._id;
        this.themeId = res.data.themeId;
      }
    });
  }



  public onEventLog(event: string, data: any): void {
    // console.log(event, data);
  }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('adminUser'));
    this.crrntUser = currentUser.user._id;
    this.themeName = localStorage.getItem('theme');
    let theme = localStorage.getItem('newTheme');
    if(theme){
      this.newthemeName = true;
    }else{
      this.newthemeName = false;
    }
    if (this.crrntUser && this.themeName) {
      this.getthemeSetting(this.themeName);
    }

    this.authService.getViewIcon('true');
    this.authService.previewToggle.subscribe((data: any) => {
      this.wasClicked = !this.wasClicked;
    });
  }

}
