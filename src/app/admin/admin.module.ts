import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatSidenavModule, MatListModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatRippleModule,
  MatPaginatorModule, MatDialogModule, MatSliderModule
} from '@angular/material';
import { SigninComponent } from './signin/signin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileDialogComponent } from './dialogs/profile-dialog/profile-dialog.component';
import { FeedbackDialogComponent } from './dialogs/feedback-dialog/feedback-dialog.component';
import { IngredientItemDialogComponent } from './dialogs/ingredient-item-dialog/ingredient-item-dialog.component';
import { AddMenuDialogComponent } from './dialogs/add-menu-dialog/add-menu-dialog.component';
import { AddMenuItemDialogComponent } from './dialogs/add-menu-item-dialog/add-menu-item-dialog.component';
import { AddIngredientCategoryComponent } from './dialogs/add-ingredient-category/add-ingredient-category.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxLoadingModule } from 'ngx-loading';
import { AddThemesComponent } from './dialogs/add-themes/add-themes.component';
import { HeaderComponent } from './header/header.component';
import { AdminBaseSettingComponent } from './components/admin-base-setting/admin-base-setting.component';
import { AdminBaseThemeComponent } from './components/admin-base-theme/admin-base-theme.component';
import { AdminFeedbackComponent } from './components/admin-feedback/admin-feedback.component';
import { AdminIntroScreenComponent } from './components/admin-intro-screen/admin-intro-screen.component';
import { AdminMainMenuComponent } from './components/admin-main-menu/admin-main-menu.component';
import { AdminMenuItemDetailsComponent } from './components/admin-menu-item-details/admin-menu-item-details.component';
import { AdminMenuItemsComponent } from './components/admin-menu-items/admin-menu-items.component';
import { AdminMyOrderComponent } from './components/admin-my-order/admin-my-order.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSliderModule,
    DragDropModule,
    ColorPickerModule,
    Ng5SliderModule,
    NgxLoadingModule.forRoot({
      backdropBorderRadius: '3px',
    })
  ],
  exports: [
  ],
  declarations: [SigninComponent, FeedbackDialogComponent, DashboardComponent, ProfileDialogComponent,
    IngredientItemDialogComponent,
    AddMenuDialogComponent,
    AddMenuItemDialogComponent,
    AddIngredientCategoryComponent,
    AddThemesComponent,
    HeaderComponent,
    AdminBaseSettingComponent,
    AdminBaseThemeComponent,
    AdminFeedbackComponent,
    AdminIntroScreenComponent,
    AdminMainMenuComponent,
    AdminMenuItemDetailsComponent,
    AdminMenuItemsComponent,
    AdminMyOrderComponent

  ],
  entryComponents: [FeedbackDialogComponent, ProfileDialogComponent, IngredientItemDialogComponent,
    AddMenuDialogComponent, AddMenuItemDialogComponent, AddIngredientCategoryComponent, AddThemesComponent,
  ]
})
export class AdminModule { }
