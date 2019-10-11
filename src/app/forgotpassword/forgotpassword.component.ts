import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  /**
   * Variable to get all form data
   *
   * @type {FormGroup}
   * @memberof ForgotpasswordComponent
   */
  forgotForm: FormGroup;
  /**
   * To show/hide loading indicator
   *
   * @memberof ForgotpasswordComponent
   */
  loading = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar) { }

  /**
   * Executes whrn forgot password page loads
   *
   * @memberof ForgotpasswordComponent
   */
  ngOnInit() {
    // Initialize form variables and validate them using regex pattern
    this.forgotForm = this.formBuilder.group({
      emailOrCustomerID: ['', Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      ])
      ],
    });
  }

  /**
   * Convenience getter for easy access to form fields
   *
   * @readonly
   * @memberof ForgotpasswordComponent
   */
  get f() { return this.forgotForm.controls; }

  /**
   * Executes when user clicks on submit button
   *
   * @returns
   * @memberof ForgotpasswordComponent
   */
  onSubmit() {

    // Stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }
    this.loading = true;
    // Using auth service to send password reset intructions to user's entered email
    this.auth.forgotpassword(this.forgotForm.value).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.snackBar.open(' Instructions for password reset sent to your registered email, check your email.', '',
          { duration: 3000, verticalPosition: 'top' });
        this.router.navigate(['/login']); // Navigate to login page when password reset email is sent.
      } else {
        this.snackBar.open('' + res.error.message, '', { duration: 3000, verticalPosition: 'top' });
      }
    },
      error => {
        this.snackBar.open('' + error, '', { duration: 3000, verticalPosition: 'top' });
        this.loading = false;
      });
  }


}
