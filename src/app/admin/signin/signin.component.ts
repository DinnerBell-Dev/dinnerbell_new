import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  /**
    * Variable to get all login form data
    *
    * @type {FormGroup}
    * @memberof LoginComponent
    */
  loginForm: FormGroup;
  /**
  * To show/hide loading indicator
  *
  * @memberof LoginComponent
  */
  loading = false;
  /**
   * To show error message in case of email not found on server during login
   *
   * @memberof LoginComponent
   */
  notexistEmail;
  /**
   * To show password error in case of invalid/incorrect password
   *
   * @type {Boolean}
   * @memberof LoginComponent
   */
  passworderror: Boolean = false;

  constructor(private formBuilder: FormBuilder, private adminservice: AdminService,
    private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    // Initialize form variables and validate them using regex pattern
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      ])
      ],
      password: ['', Validators.compose([Validators.required,
      Validators.pattern('')
      ])
      ],
    });
    // check if admin already logged in or not.
    this.checklogin();
  }

  /**
  * Convenience getter for easy access to form fields
  *
  * @readonly
  * @memberof LoginComponent
  */
  get f() { return this.loginForm.controls; }

  /**
    * Executes when user clicks on login button
    *
    * @returns
    * @memberof LoginComponent
    */
  onSubmit() {
    // console.log(this.loginForm.value);
    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    // Using auth service to perfom login based on user's data
    this.adminservice.signin(this.loginForm.value).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.passworderror = false;
        this.snackBar.open('You are successfully logged in.', '', { duration: 3000, verticalPosition: 'top' });
        localStorage.setItem('adminUser', JSON.stringify(res));
        this.router.navigate(['/admin/dashboard']); // Navigate to home page after successfull login
      } else if (res.email === this.loginForm.get('email').value) {
        this.notexistEmail = res.email; // To show error message in case email not found during login
        this.passworderror = false; // Hide password error
        this.snackBar.open('' + res.error.message, '', { duration: 3000, verticalPosition: 'top' });
      } else {
        this.passworderror = true;  // To show password error in case of incorrect/invalid password
        this.snackBar.open('' + res.error.message, '', { duration: 3000, verticalPosition: 'top' });
      }
    },
      error => {
        this.snackBar.open('' + error, '', { duration: 3000, verticalPosition: 'top' });
        this.loading = false;
      });

  }

  /**
   * Checks if admin already logged in or not , if yes then redirect to dashboard
   *
   * @memberof SigninComponent
   */
  checklogin() {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (adminUser) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

}
