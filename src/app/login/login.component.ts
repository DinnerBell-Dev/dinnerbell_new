
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../services/admin.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    public adminservice: AdminService
  ) {
  }

  /**
   * Executes when login page loads
   *
   * @memberof LoginComponent
   */
  ngOnInit() {
    // Initialize form variables and validate them using regex pattern
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      ])
      ],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required,
      Validators.pattern('^(?=.*?[A-Za-z0-9~!@#$%^&*()_+]).{8,}$')
      ])
      ],
    });

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

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    // Using auth service to perfom login based on user's data
    this.auth.signin(this.loginForm.value).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.passworderror = false;
        this.snackBar.open('You are successfully logged in.', '', { duration: 3000, verticalPosition: 'top' });
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.router.navigate(['/home']); // Navigate to home page after successfull login
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
   * Check user already logged in or not, if yes then redirect to home page.
   *
   * @memberof LoginComponent
   */
  checklogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.router.navigate(['/home']);
    }
  }

}
