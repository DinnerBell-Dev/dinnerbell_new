import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SigninComponent } from './signin/signin.component';
import { AdminAuthGuard } from '../services/adminauth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

/**
* Admin routes.
*/
const routes: Routes = [
  { path: 'admin', redirectTo: '/admin/signin', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminAuthGuard]},
  { path: 'signin', component: SigninComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
