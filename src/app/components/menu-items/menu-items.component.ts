import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ThemePalette, MatSnackBar } from '@angular/material';
import { ColorPickerService } from 'ngx-color-picker';
import { AdminService } from 'src/app/services/admin.service';
import { ImageCompressService } from 'ng2-image-compress';
import { Options } from 'ng5-slider';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit {


  menuItemSetting: any = {
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

  headerSetting: any = {
    fontFamily: 'Roboto',
    priceFamily: 'Roboto',
    navBarIcon: '#fff',
    navbarTxt: '#fff',
    navbarBg: '#171732',
    navbarBorder: '#252660',
    listSelect: '#33358E',
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
      floor: 24,
      ceil: 32,
      step: 1,
      showTicks: true
    };
    options2: Options = {
      floor: 32,
      ceil: 40,
      step: 1,
      showTicks: true
    };
    options3: Options = {
      floor: 18,
      ceil: 26,
      step: 1,
      showTicks: true
    };
    options4: Options = {
      floor: 18,
      ceil: 26,
      step: 1,
      showTicks: true
    };
    options5: Options = {
      floor: 14,
      ceil: 22,
      step: 1,
      showTicks: true
    };
    options6: Options = {
      floor: 14,
      ceil: 22,
      step: 1,
      showTicks: true
    };

  onPreviw() {
    this.wasClicked = !this.wasClicked;
  }

  layoutType(data) {
    this.menuItemSetting.layOutType = data;
  }

  bgimageStyle(data) {
    this.menuItemSetting.imagestyle = data;
  }

  removeLocalImg() {
    this.menuItemSetting.LocalImgUrl = '';
  }


  /** Upload Image */
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            // this.menuItemSetting.LocalImgUrl = image.imageDataUrl;
            let input = new FormData();
            input.append('file', file);
            this.adminService.uploadPhoto(input).subscribe((res: any) => {
              if (res) {
                this.menuItemSetting.LocalImgUrl = res.url;
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
      menuItemSetting: this.menuItemSetting
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
          listSelect: dataHeader.listSelect,
        }
      }
      if (res.data !== null && res.data.menuItemSetting) {
        let data = res.data.menuItemSetting;
        this.menuItemSetting = {
          layOutType: data.layOutType,
          listBg: data.listBg,
          spicy: data.spicy,
          popular: data.popular,
          special: data.special,
          new: data.new,
          header: data.header,
          subsection: data.subsection,
          headerColor: data.headerColor,
          subsectionColor: data.subsectionColor,
          itemtitle: data.itemtitle,
          price: data.price,
          itemtitleColor: data.itemtitleColor,
          priceColor: data.priceColor,
          itemtitle2: data.itemtitle2,
          price2: data.price2,
          itemtitle2Color: data.itemtitle2Color,
          price2Color: data.price2Color,
          spacing: data.spacing,
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
