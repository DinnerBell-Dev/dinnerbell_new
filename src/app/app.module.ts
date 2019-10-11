import { AdminAuthGuard } from './services/adminauth.guard';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { VerifyPhoneService } from './services/verifyphone.service';
import { CountryService } from './services/country.service';
import { AuthService } from './services/auth.service';
import { AdminService } from './services/admin.service';
import { UtilService } from './services/util.service';
import { HTTP_INTERCEPTORS , HttpClientModule } from '@angular/common/http';
import { IntercepterService } from './services/intercepter.service';
import { MatSnackBarModule, MatDialogModule, MatButtonModule, MatSidenavModule, 
MatListModule, MatTableModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatPaginatorModule,
 MatChipsModule, MatIconModule, MatSliderModule} from '@angular/material';
import { HomeComponent } from './home/home.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './/app-routing.module';
import { JwtInterceptor } from './services/jwt.intercepter';
import { CreatepasswordComponent } from './createpassword/createpassword.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UpgradeDialogComponent } from './dialogs/upgrade-dialog/upgrade-dialog.component';
import { NgxLoadingModule } from 'ngx-loading';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddingredientComponent } from './dialogs/addingredient/addingredient.component';
import { IngredientCategoryComponent } from './dialogs/ingredient-category/ingredient-category.component';
import { UserService } from './services/user.service';
import { MenuDialogComponent } from './dialogs/menu-dialog/menu-dialog.component';
import { MenuItemDialogComponent } from './dialogs/menu-item-dialog/menu-item-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ImageCompressService,ResizeOptions } from 'ng2-image-compress';
import { CurrencyFormatterDirective } from './directives/currency-formatter.directive';
import { CurrencyPipePipe } from './pipes/currency-pipe.pipe';
import { WarningDialogComponent } from './dialogs/warning-dialog/warning-dialog.component';
import { AddEmployeeComponent } from './dialogs/add-employee/add-employee.component';
import {TeamMemberComponent} from './dialogs/team-member/team-member.component';
import { AccessCodesComponent } from './dialogs/access-codes/access-codes.component';
import { IntroScreenComponent } from './components/intro-screen/intro-screen.component';
import { BaseSettingsComponent } from './components/base-settings/base-settings.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MenuItemsComponent } from './components/menu-items/menu-items.component';
import { MyOrderComponent } from './components/my-order/my-order.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MenuItemDetailsComponent } from './components/menu-item-details/menu-item-details.component';
import { BaseThemeComponent } from './components/base-theme/base-theme.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { AddThemesComponent } from './admin/dialogs/add-themes/add-themes.component';
import { HeaderComponent } from './header/header.component';
import { Ng5SliderModule } from 'ng5-slider';
import { CarouselModule } from 'ngx-bootstrap/carousel';

 

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    ForgotpasswordComponent,
    CreatepasswordComponent,
    NotFoundComponent,
    UpgradeDialogComponent,
    WarningDialogComponent,
    AddingredientComponent,
    IngredientCategoryComponent,
    MenuDialogComponent,
    MenuItemDialogComponent,
    CurrencyFormatterDirective,
    CurrencyPipePipe,
    AddEmployeeComponent,
    TeamMemberComponent,
    AccessCodesComponent,
    IntroScreenComponent,
    BaseSettingsComponent,
    MainMenuComponent,
    MenuItemsComponent,
    MyOrderComponent,
    FeedbackComponent,
    MenuItemDetailsComponent,
    BaseThemeComponent,
    HeaderComponent
    
  ],
  entryComponents: [UpgradeDialogComponent,WarningDialogComponent,AddingredientComponent,IngredientCategoryComponent,TeamMemberComponent,
  MenuDialogComponent,MenuItemDialogComponent,AddEmployeeComponent,AccessCodesComponent,IntroScreenComponent,BaseSettingsComponent,
MainMenuComponent,MenuItemsComponent,MyOrderComponent,FeedbackComponent,MenuItemDetailsComponent,BaseThemeComponent,  ],
  exports: [ CurrencyPipePipe ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AdminModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonModule,
    AppRoutingModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSliderModule,
    DragDropModule,
    Ng5SliderModule,
    OwlDateTimeModule,
    ColorPickerModule,
    OwlNativeDateTimeModule,
    NgxLoadingModule.forRoot({
      backdropBorderRadius: '3px',
  }),
    CarouselModule.forRoot()
  ],
  providers: [
    CountryService,
    VerifyPhoneService,
    AuthService,
    UtilService,
    AdminAuthGuard,
    AdminService,
    UserService,
    CurrencyPipePipe,
    ImageCompressService,
    ResizeOptions,
    { provide: HTTP_INTERCEPTORS, useClass: IntercepterService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
