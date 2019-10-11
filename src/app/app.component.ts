import { Component } from '@angular/core';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public adminservice: AdminService) {
    this.updateLastLogin();
  }
  updateLastLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const data = { lastlogin: Date.now() };
      this.adminservice.updateUser(currentUser.user._id, data).subscribe((res: any) => {
        if (res.success) {
          localStorage.setItem('currentUser', JSON.stringify(res));
        } else {
          // console.log('Something went wrong');
        }
      });
    }
  }

  ngOnInit() { 
   
  }
}

