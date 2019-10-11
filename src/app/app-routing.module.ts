import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { AuthGuard } from './services/auth.guard';
import { CreatepasswordComponent } from './createpassword/createpassword.component';
import { NotFoundComponent } from './not-found/not-found.component';

/**
* App routes for user
*/
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'createpassword/:token', component: CreatepasswordComponent },
  { path: 'notfound', component: NotFoundComponent },
  {
    path: 'admin', loadChildren: './admin/admin.module#AdminModule'
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
