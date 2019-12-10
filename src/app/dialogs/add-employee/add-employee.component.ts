import {Component, OnInit, Inject} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material";
import {UserService} from "src/app/services/user.service";
import {UtilService} from "src/app/services/util.service";
import {CountryService} from "src/app/services/country.service";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  /**
 * To get all countries
 *
 * @memberof AddEmployeeComponent
 */
  countries;
  /**
   * To get all states
   *
   * @memberof AddEmployeeComponent
   */
  states;
  /**
   * To get all cities
   *
   * @memberof AddEmployeeComponent
   */
  cities;
  /**
   * To get all states based on country
   *
   * @type {*}
   * @memberof AddEmployeeComponent
   */
  statesArray: any = [];
  /**
   * To get all cities based on states
   *
   * @type {*}
   * @memberof AddEmployeeComponent
   */
  citiesArray: any = [];
  /**
   * To get country code based on selected country by user
   *
   * @memberof AddEmployeeComponent
   */

  
  currentUser;
  /**
   *setbtn text for dialog
   *
   * @memberof AddEmployeeComponent
   */
  btntext = 'Add employee';
  /**
   *setbtn text for dialog
   *
   * @memberof AddEmployeeComponent
   */
   dialogTitle = 'New employee';
  /**
   *Used to show /hde loading indicator
   *
   * @type {Boolean}
   * @memberof AddEmployeeComponent
   */
 tabletloading: Boolean = false;
  /**
     * Used to store new category item information.
     *
     * @type {FormGroup}
     * @memberof AddEmployeeComponent
     */
  employeeForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddEmployeeComponent>, private formBuilder: FormBuilder,public dialog: MatDialog,
    public userservice: UserService, @Inject(MAT_DIALOG_DATA) public data: any, 
    public util: UtilService,private countryservice: CountryService,) {

  }
  /**
     * Executes when dialog loads.
     *
     * @memberof AddEmployeeComponent
     */
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.employeeForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['', Validators.required],
      user_id: this.currentUser.user._id,
      email: ['', Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.compose([Validators.required,
      Validators.pattern('')
      ])],
      countrycode: ['', Validators.required],
      zipcode: ['', Validators.compose([Validators.required,
      Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$|^[0-9]{6}(?:-[0-9]{4})?$|^[0-9]{7}(?:-[0-9]{4})?$')
      ])],
      streetAddress: ['', Validators.required],
    });
    this.setCountriesData();
    if (this.data.empData) {
      this.btntext = 'Update employee';
      this.dialogTitle = 'Edit employee';
      this.employeeForm.patchValue(this.data.empData);
      this.updateLocationValues();
    }
  }
  
  updateLocationValues(){
    const values: any = this.employeeForm.value;
    this.data.countries.forEach(item => {
      if (values.country === item.name) {
        this.employeeForm.get('country').setValue(item.id);
      }
    });
  }
  
  /**
  * Function to get all countries, states, cities using country service
  *
  * @memberof AddEmployeeComponent
  */
  setCountriesData() {
    this.countries = this.data.countries;
    this.states = this.data.states;
    this.cities = this.data.cities;
  }
  /**
   * Executes when user changes/select country from drop down
   *
   * @param {*} countryid
   * @param {*} [change]
   * @memberof HomeComponent
   */
  countryChange(countryid, change?) {
    this.countries.forEach(item => {
      if (item.id === countryid) {
        this.employeeForm.controls['countrycode'].setValue(item.countrycode);
      }
    });

    this.statesArray = [];
    if (change === true) {
      this.employeeForm.controls['state'].setValue('');
      this.employeeForm.controls['city'].setValue('');

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
   * @memberof HomeComponent
   */
  stateChange(stateid, change?) {
    this.citiesArray = [];
    if (change === true) {
      this.employeeForm.controls['city'].setValue('');
      this.employeeForm.controls['city'].markAsTouched();
    }
    this.cities.forEach(item => {
      if (item.state_id ===  stateid) {
        this.citiesArray.push(item);
      }
    });
  }

  public get f() { return this.employeeForm.controls; }

  /**
   * No button action of alert dialog
   *
   * @memberof AddEmployeeComponent
   */
  close() {
    this.dialogRef.close('No');
  }

 async addEmployee() {
   const values: any = this.employeeForm.value;
    this.statesArray.forEach(item => {
      if (values.state === item.id) {
        values.state = item.name;
        this.employeeForm.get('state').setValue(item.name);
      }
    });

    this.countries.forEach(item => {
      if (values.country === item.id) {
        values.country = item.name;
        this.employeeForm.get('country').setValue(item.name);
      }
    });

    this.citiesArray.forEach(item => {
      if (values.city === item.id) {
        values.city = item.name;
        this.employeeForm.get('city').setValue(item.name);
      }
    });
    this.statesArray = [];
    this.citiesArray = [];
    if (this.data.empData) {
      this.tabletloading = true;
          this.userservice.updateEmployee(this.data.empData._id, this.employeeForm.value).subscribe((res: any) => {
            this.tabletloading = false;
            if(res.success){
              this.util.showToast('Employee updated successfully.');
               this.dialogRef.close(this.employeeForm.value);
            } else if(res.success === false) {
              this.util.showToast(res.error.message);
            }
          });
    } else {
      this.tabletloading = true;
      const data ={employee:this.employeeForm.value,restaurant:this.data.restaurantData}
      try {
         await this.userservice.addEmployee(data).subscribe((res: any) => {
            this.tabletloading = false;
            console.log(res);
            if(res.success == true){
              this.util.showToast('New member created successfully.');
              this.dialogRef.close(this.employeeForm.value);
            }
             else  {
              this.util.showToast(res.error.message);
            }
          },
          error => {
            console.log('EROOR' + error)
          });
        }
        catch(e) {
          console.log(e)
        }
    }
    
  }
  /**
 * Remove leading and traling spaces in input fields
 *
 * @param {*} string
 * @returns
 * @memberof AddEmployeeComponent
 */
  removeSpaces(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }

}