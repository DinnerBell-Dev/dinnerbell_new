import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ColorPickerService } from 'ngx-color-picker';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material';
import { ImageCompressService } from 'ng2-image-compress';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-intro-screen',
  templateUrl: './intro-screen.component.html',
  styleUrls: ['./intro-screen.component.scss']
})
export class IntroScreenComponent implements OnInit {

  selectedStatic: Boolean = false;
  selectedSlideshow: Boolean = false;
  selectedVideo: Boolean = false;
  selectedOverlay: Boolean = false;

  introSetting: any ={
    LocalImgUrl: '',
    imagestyle: "fix",
    logoUrl: '',
    videoUrl: '',
    slide1 : '',
    slide2 : '',
    slide3 : '',
    slide4 : '',
    slide5 : '',
    slide6 : '',
  }
  wasClicked = false;
  public slideImages: Array<any> = [];
  public slideShow: boolean = false;
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

  onPreviw() {
    this.wasClicked = !this.wasClicked;
  }
  
  bgimageStyle(data) {
    this.introSetting.imagestyle = data;
  }

  removeLocalImg() {
    this.introSetting.LocalImgUrl = '';
  }
  removeVideo() {
    this.introSetting.videoUrl = '';
  }

  removeLogoImg() {
    this.introSetting.logoUrl = '';
  }


  removeSlide(data){
    if(data == 1){
      this.introSetting.slide1 = '';
    }
    if(data == 2){
      this.introSetting.slide2 = '';
    }
    if(data == 3){
      this.introSetting.slide3 = '';
    }
    if(data == 4){
      this.introSetting.slide4 = '';
    }
    if(data == 5){
      this.introSetting.slide5 = '';
    }
    if(data == 6){
      this.introSetting.slide6 = '';
    }
  }


  /** Slide Images */
  onSlideChange(event: any, index) {
    this.introSetting.videoUrl = '';
    this.introSetting.LocalImgUrl = '';
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), files[0].type).then((file: any) => {
            // this.introSetting.LocalImgUrl = image.imageDataUrl;
            let input = new FormData();
            input.append('file', file);
            this.adminService.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                if (index == 1) {
                  this.introSetting.slide1 = res.url;
                  // this.introSetting.slide1 = res.url;
                }
                if (index == 2) {
                  this.introSetting.slide2 = res.url;
                }
                if (index == 3) {
                  this.introSetting.slide3 = res.url;
                }
                if (index == 4) {
                  this.introSetting.slide4 = res.url;
                }
                if (index == 5) {
                  this.introSetting.slide5 = res.url;
                }
                if (index == 6) {
                  this.introSetting.slide6 = res.url;
                }
              }
            });
          });
        }, (error) => {
          // console.log("Error while converting");
        });
      });
    }
  }


  /** Static Images */
  onFileChange(event: any) {
    this.introSetting.videoUrl = '';
    this.introSetting.slide1 = '';
    this.introSetting.slide2 = '';
    this.introSetting.slide3 = '';
    this.introSetting.slide4 = '';
    this.introSetting.slide5 = '';
    this.introSetting.slide6 = '';
    this.slideShow = false;
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), files[0].type).then(file => {
            // this.introSetting.LocalImgUrl = image.imageDataUrl;
            let input = new FormData();
            input.append('file', file);
            this.adminService.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                this.introSetting.LocalImgUrl = res.url;
              }
            });
          });
        }, (error) => {
          // console.log("Error while converting");
        });
      });
    }
  }

  /** Logo Over Lay */
  uploadLogo(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), files[0].type).then(file => {
            // this.introSetting.logoUrl = image.imageDataUrl;
            let input = new FormData();
            input.append('file', file);
            // console.log(file)
            this.adminService.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                this.introSetting.logoUrl = res.url;
              }
            });
          });
        }, (error) => {
          // console.log("Error while converting");
        });
      });
    }
  }





  /** Video Upload */
  onvideoChange(event: any) {
    this.introSetting.LocalImgUrl = '';
    this.slideShow = false;
    this.introSetting.slide1 = '';
    this.introSetting.slide2 = '';
    this.introSetting.slide3 = '';
    this.introSetting.slide4 = '';
    this.introSetting.slide5 = '';
    this.introSetting.slide6 = '';
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.urltoFile(reader.result, Date.now().toString(), files[0].type).then(file => {
          let input = new FormData();
          input.append('file', file);
          // console.log(file);
          this.adminService.uploadVideos(input).subscribe((res: any) => {
            if (res) {
              this.introSetting.videoUrl = res.url;
            }
          });
        });
      };
      // console.log(this.introSetting.videoUrl);


    }
  }

  urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then(function(res) { return res.arrayBuffer(); })
      .then(function(buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }



  /** Save Menus Setting */
  uploadIntoSettings() {
    let theme = {
      name: this.themeName,
      themeId: this.themeId,
      userId: this.crrntUser,
      Id: this.Id,
      introSetting: this.introSetting
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
      if (res.data !== null && res.data.introSetting) {
        let data = res.data.introSetting;
        this.introSetting = {
          LocalImgUrl: data.LocalImgUrl,
          imagestyle: data.imagestyle,
          logoUrl: data.logoUrl,
          videoUrl: data.videoUrl,
          slide1: data.slide1,
          slide2: data.slide2,
          slide3: data.slide3,
          slide4: data.slide4,
          slide5: data.slide5,
          slide6: data.slide6,
        }

      }
      if (res.data._id) {
        this.themeId = res.data.themeId;
        this.Id = res.data._id;
      }
    });
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

  selectedValue(value) {
    switch (value) {
      case 'static-image':
        this.selectedStatic = true;
        this.selectedSlideshow = false;
        this.selectedVideo = false;
        this.selectedOverlay = false;
        break;
      case 'slide-show':
        this.selectedStatic = false;
        this.selectedSlideshow = true;
        this.selectedVideo = false;
        this.selectedOverlay = false;
        break;
      case 'video-intro':
        this.selectedStatic = false;
        this.selectedSlideshow = false;
        this.selectedVideo = true;
        this.selectedOverlay = false;
        break;
      case 'logo-overlay':
        this.selectedStatic = false;
        this.selectedSlideshow = false;
        this.selectedVideo = false;
        this.selectedOverlay = true;
        break;
    }
  }


}
