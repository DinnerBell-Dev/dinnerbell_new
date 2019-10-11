import { CountryService } from './../services/country.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VerifyPhoneService } from '../services/verifyphone.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  /**
   * Variable to get all registration data
   *
   * @type {FormGroup}
   * @memberof RegistrationComponent
   */
  registerForm: FormGroup;

  /**
   * To show/hide loading indicator
   *
   * @memberof RegistrationComponent
   */
  loading = false;
  /**
   * To get all countries
   *
   * @memberof RegistrationComponent
   */
  countries;
  /**
   * To get all states
   *
   * @memberof RegistrationComponent
   */
  states;
  /**
   * To get all cities
   *
   * @memberof RegistrationComponent
   */
  cities;
  /**
   * To get all states based on country
   *
   * @type {*}
   * @memberof RegistrationComponent
   */
  statesArray: any = [];
  /**
   * To get all cities based on states
   *
   * @type {*}
   * @memberof RegistrationComponent
   */
  citiesArray: any = [];
  /**
   * To show phone number validation error
   *
   * @type {String}
   * @memberof RegistrationComponent
   */
  verifyStartError: String;
  /**
   *  To show verify code validation error
   *
   * @type {String}
   * @memberof RegistrationComponent
   */
  verifyError: String;
  /**
   * To show/hide password validation message
   *
   * @type {Boolean}
   * @memberof RegistrationComponent
   */
  passhint: Boolean = false;
  /**
   * To get country code based on selected country by user
   *
   * @memberof RegistrationComponent
   */
  countryCode;
  /**
   * To show error message in case of existing email on server during registration
   *
   * @memberof RegistrationComponent
   */
  existEmail;
  /**
   * Drop down options for buisiness type selector
   *
   * @memberof RegistrationComponent
   */
  typesBusiness = ['Bar/Club', 'Bakery/Deli', 'Cafe/Brasserie/Bistro', 'Event/Catering', 'Hospitality - Other', 'Quick-Service',
    'Restaurant', 'Retail - Other', 'Takeaway/Delivery', 'Hotel'];

  /**
   * To highlight verify code field with green border.
   */
  verifySuccess: Boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private countryservice: CountryService,
    private verifyservice: VerifyPhoneService, private auth: AuthService, private snackBar: MatSnackBar) { }

  /**
   * Executes when registration page loads
   *
   * @memberof RegistrationComponent
   * */

  ngOnInit() {
    /**
     * Initialize form variables and validate them using regex pattern
     *
     * @memberof RegistrationComponent
     */
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      ])],
      fullname: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-zA-Z ]*$')
      ])],
      country: ['', Validators.required],
      city: ['', Validators.compose([Validators.required,
      Validators.pattern('')
      ])],
      state: ['', Validators.required],
      address: ['', Validators.compose([Validators.required,
      Validators.pattern('')
      ])],
      zipcode: ['', Validators.compose([Validators.required,
      Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$|^[0-9]{6}(?:-[0-9]{4})?$|^[0-9]{7}(?:-[0-9]{4})?$')
      ])],
      website: ['', Validators.compose([Validators.pattern('^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}')])],
      countrycode: ['', Validators.required],
      phone: ['', Validators.required],
      verifycode: ['', Validators.required],
      businesstype: ['', Validators.required],
      notes: ['', Validators.compose([Validators.required,
      Validators.pattern('')
      ])],

      companyname: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-zA-Z ]*$')
      ])],
      occupation: ['', Validators.compose([Validators.required,
      Validators.pattern('')
      ])],
      cuisinesserved: ['', Validators.compose([Validators.required,
      Validators.pattern('')
      ])],

      digitalmenu: [false, Validators.required],
      graphicdesign: [false, Validators.required],
      branding: [false, Validators.required],
      marketting: [false, Validators.required],
      photovideo: [false, Validators.required],
      web: [false, Validators.required],
    });
    this.getCountriesData(); // Load all coutry related data.
  }

  /**
   * Convenience getter for easy access to form fields
   *
   * @readonly
   * @memberof RegistrationComponent
   */
  public get f() { return this.registerForm.controls; }

  /**
   * Executes when user clicks on register button
   *
   * @returns
   * @memberof RegistrationComponent
   * */
  onSubmit() {

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    // To convert country,state,cities id to name
    const values: any = this.registerForm.value;
    this.statesArray.forEach(item => {
      if (values.state === item.id) {
        values.state = item.name;
      }
    });

    this.countries.forEach(item => {
      if (values.country === item.id) {
        values.country = item.name;
      }
    });

    this.citiesArray.forEach(item => {
      if (values.city === item.id) {
        values.city = item.name;
      }
    });

    this.loading = true;
    // Using auth service to register user's data

    // console.log('Signup ', values);

    this.auth.signup(values).subscribe((res: any) => {
      if (res.success) {
        this.snackBar.open('' + res.message, '', { duration: 5000, verticalPosition: 'top' });
        this.router.navigate(['/login']); // Navigate to login page
      } else if (res.email === this.registerForm.get('email').value) {
        this.existEmail = res.email; // To show exising email error if occurs
        this.snackBar.open('' + res.error.message, '', { duration: 3000, verticalPosition: 'top' });
      } else {
        this.snackBar.open('' + res.error.message, '', { duration: 3000, verticalPosition: 'top' });
      }
      this.loading = false;

    },
      error => {
        this.loading = false;
        this.snackBar.open('' + error, '', { duration: 3000, verticalPosition: 'top' });
      });


  }

  /**
   * Function to get all countries, states, cities using country service
   *
   * @memberof RegistrationComponent
   */
  getCountriesData() {
    // this.loading = true;
    this.countryservice.getCountries().subscribe((data) => {
      this.countries = data;
    });
    this.countryservice.getCities().subscribe((data) => {
      this.cities = data;
    });
    this.countryservice.getStates().subscribe((data) => {
      this.states = data;
      // this.loading = false;
    });
  }

  /**
   * Reset form controls when user changes/select country from drop down
   *
   * @memberof RegistrationComponent
   */
  resetformcontrols() {
    this.verifySuccess = false;
    this.registerForm.controls['verifycode'].setValue('');
    this.registerForm.controls['verifycode'].enable();
    this.registerForm.controls['verifycode'].markAsUntouched();
    this.registerForm.controls['phone'].setValue('');
    this.registerForm.controls['phone'].enable();
    this.registerForm.controls['phone'].markAsUntouched();

  }


  /**
   * Executes when user changes/select country from drop down
   *
   * @param {*} countryid
   * @param {*} [change]
   * @memberof RegistrationComponent
   */
  countryChange(countryid, change?) {
    this.resetformcontrols();
    this.countries.forEach(item => {
      if (item.id === countryid) {
        this.registerForm.controls['countrycode'].setValue(item.countrycode);
        this.countryCode = item.countrycode;
        this.verifyStartError = '';
      }
    });


    this.statesArray = [];
    if (change === true) {
      this.registerForm.controls['state'].setValue('');
      this.registerForm.controls['city'].setValue('');

    }
    this.states.forEach(item => {
      if (item.country_id === countryid) {
        this.statesArray.push(item);
      }
    });
  }

  /**
   * Executes when user changes/select states from drop down
   *
   * @param {*} stateid
   * @param {*} [change]
   * @memberof RegistrationComponent
   */
  stateChange(stateid, change?) {
    this.resetformcontrols();
    this.citiesArray = [];
    if (change === true) {
      this.registerForm.controls['city'].setValue('');
      this.registerForm.controls['city'].markAsTouched();

    }
    this.cities.forEach(item => {
      if (item.state_id === stateid) {
        this.citiesArray.push(item);
      }
    });
  }


  /**
   * Send verification code to user's contact number
   *
   * @memberof RegistrationComponent
   */
  getPhone() {
    // this.registerForm.controls['verifycode'].setValue('');
    this.registerForm.controls['verifycode'].enable();
    this.registerForm.controls['verifycode'].markAsUntouched();
    this.verifySuccess = false;
    if (this.registerForm.controls['countrycode'].value === '') {
      this.verifyStartError = 'Please select country';
    } else if (this.registerForm.controls['countrycode'].value !== '' && this.registerForm.controls['phone'].value !== '') {
      const data = {
        via: 'sms',
        country_code: this.registerForm.controls['countrycode'].value,
        phone_number: this.registerForm.controls['phone'].value
      };

      this.verifyservice.start(data).subscribe((res: any) => {
        if (res.success) {
          this.verifyStartError = '';
          this.snackBar.open('Message sent to your mobile', '', { duration: 5000, verticalPosition: 'top' });
        }

      },
        error => {
          this.verifyStartError = error;
        });
    }
  }

  /**
   * Verify code sent to user's phone number via twillio
   *
   * @memberof RegistrationComponent
   */
  verifyPhone() {
    if (this.registerForm.controls['verifycode'].value !== '' && this.registerForm.controls['countrycode'].value !== ''
      && this.registerForm.controls['phone'].value !== '') {
      const data = {
        token: this.registerForm.controls['verifycode'].value,
        country_code: this.registerForm.controls['countrycode'].value,
        phone_number: this.registerForm.controls['phone'].value
      };

      this.verifyservice.verify(data).subscribe((res) => {
        this.verifyError = '';
        this.registerForm.controls['verifycode'].disable();
        this.verifySuccess = true;
      },
        error => {
          this.verifyError = error;
          this.verifySuccess = false;
        });
    }
  }

  /**
   * Remove leading and traling spaces in input fields
   *
   * @param {*} string
   * @returns
   * @memberof RegistrationComponent
   */
  removeSpaces(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }


}
