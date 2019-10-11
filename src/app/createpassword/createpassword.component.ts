import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-createpassword',
  templateUrl: './createpassword.component.html',
  styleUrls: ['./createpassword.component.scss']
})
export class CreatepasswordComponent implements OnInit {
  /**
   * To show/hide loading indicator
   *
   * @memberof CreatepasswordComponent
   */
  loading = false;
  /**
   * To show/hide password validation message.
   *
   * @type {Boolean}
   * @memberof CreatepasswordComponent
   */
  passhint: Boolean = false;
  /**
   * Used to store password from data.
   *
   * @type {FormGroup}
   * @memberof CreatepasswordComponent
   */
  passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    // Initialize form variables and validate them using regex pattern
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(4), Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$')
      ])],
      token: [this.activeRoute.snapshot.params.token, Validators.required]
    });
    this.checkPasswordLink();
  }

  get f() { return this.passwordForm.controls; }

  /**
   * Execute when user clicks on create button.
   */
  onSubmit() {
    // Stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }
    this.loading = true;
    // Using auth service to create password.
    this.auth.createpassword(this.passwordForm.value).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.router.navigate(['/home']); // Navigate to home page when password is created.
      } else {
        this.snackBar.open('' + res.error, '', { duration: 3000, verticalPosition: 'top' });
      }
    },
      error => {
        this.snackBar.open('' + error, '', { duration: 3000, verticalPosition: 'top' });
        this.loading = false;
      });
  }

  /**
   * Used to check if pasword link is valid/invalid based on create password token
   *
   * @memberof CreatepasswordComponent
   */
  checkPasswordLink() {
    this.auth.checkToken(this.activeRoute.snapshot.params.token).subscribe((res: any) => {
      if (res.success === false) {
        this.router.navigate(['/notfound']); // Navigate to home page when password is created.
      }
    });
  }

}
