import { AdminService } from './../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UpgradeDialogComponent } from '../dialogs/upgrade-dialog/upgrade-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryService } from '../services/country.service';
import { AuthService } from '../services/auth.service';
import { VerifyPhoneService } from '../services/verifyphone.service';
import { AddingredientComponent } from '../dialogs/addingredient/addingredient.component';
import { IngredientCategoryComponent } from '../dialogs/ingredient-category/ingredient-category.component';
import { UserService } from '../services/user.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FeedbackDialogComponent } from '../admin/dialogs/feedback-dialog/feedback-dialog.component';
import { MenuDialogComponent } from '../dialogs/menu-dialog/menu-dialog.component';
import { MenuItemDialogComponent } from '../dialogs/menu-item-dialog/menu-item-dialog.component';
import { WarningDialogComponent } from '../dialogs/warning-dialog/warning-dialog.component';
import { AddEmployeeComponent } from '../dialogs/add-employee/add-employee.component';
import { TeamMemberComponent } from '../dialogs/team-member/team-member.component';
import { AccessCodesComponent } from '../dialogs/access-codes/access-codes.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  /**
   *Used for weckly renewal switch in tablet settings
   *
   * @memberof HomeComponent
   */
  weaklyRenewalSwitch = 'false';
  /**
   *Used to store all team members data in tablet settings
   *
   * @memberof HomeComponent
   */
  teamMembers: any = [];


  /**
   * To show/hide list view in menus tab
   *
   * @type {Boolean}
   * @memberof HomeComponent
   */
  listview: Boolean = false;


  /**
   * To disable btn when loading in account settings company profile tab
   */
  profileloading: Boolean = false;
  /**
   * Used to show/hide draggable handle.
   *
   * @type {Boolean}
   * @memberof HomeComponent
   */
  drag: Boolean = false;

  /**
   * Used to show/hide draggable handle in menus.
   *
   * @type {Boolean}
   * @memberof HomeComponent
   */
  dragMenus: Boolean = false;
  /**
   * To disable btn when loading in account settings of login and security tab
   */
  securityloading: Boolean = false;
  /**
   * show/hide loading indicator in ingredints section
   */
  ingredientloading: Boolean = false;

  /**
   * show/hide loading indicator in ingredints section
   */
  menuloading: Boolean = false;
  /**
   * show/hide loading indicator in teablet settings
   */
  tabletloading: Boolean = false;
  /**
   * To show error message in case of existing email in account settings
   *
   * @memberof HomeComponent
   */
  existEmail;
  /**
   * To show phone number validation error
   *
   * @type {String}
   * @memberof HomeComponent
   */
  verifyStartError: String;
  /**
   *  To show verify code validation error
   *
   * @type {String}
   * @memberof HomeComponent
   */
  verifyError: String;
  /**
   * Used to store current user's data
   */
  currentUser: any = '';
  /**
 * Used to switch account setting tab
 *
 * @memberof HomeComponent
 */
  accountSettingTab = 'companyprofile';
  /**
   *Used to switch menu settings tab
   *
   * @memberof HomeComponent
   */
  menuSettingTab = 'customization';
  /**
   * Used to show/hide input feild to update info in account settings
   */
  updateVenue: Boolean = false;
  updateContact: Boolean = false;
  updateLocation: Boolean = false;
  updatePhone: Boolean = false;
  updateEmail: Boolean = false;
  updatePassword: Boolean = false;
  sendCode: Boolean = false;
  confirmCode: Boolean = false;

  /**
   * Used to store company profile form data in account settings
   *
   * @type {FormGroup}
   * @memberof HomeComponent
   */
  companyprofileForm: FormGroup;
  /**
   * Used to store login and security form data in account settings
   *
   * @type {FormGroup}
   * @memberof HomeComponent
   */
  securityForm: FormGroup;
  /**
   *Used to store menu settings data
   *
   * @type {FormGroup}
   * @memberof HomeComponent
   */
  menu_customizationForm: FormGroup;
  /**
   * Used to store tablet settings data
   */
  tablet_settingsForm: FormGroup;
  /**
  * Drop down options for buisiness type selector
  *
  * @memberof HomeComponent
  */
  typesBusiness = ['Bar/Club', 'Bakery/Deli', 'Cafe/Brasserie/Bistro', 'Event/Catering', 'Hospitality - Other', 'Quick-Service',
    'Restaurant', 'Retail - Other', 'Takeaway/Delivery', 'Hotel'];

  /**
 * To get all countries
 *
 * @memberof HomeComponent
 */
  countries;
  /**
   * To get all states
   *
   * @memberof HomeComponent
   */
  states;
  /**
   * To get all cities
   *
   * @memberof HomeComponent
   */
  cities;
  /**
   * To get all states based on country
   *
   * @type {*}
   * @memberof HomeComponent
   */
  statesArray: any = [];
  /**
   * To get all cities based on states
   *
   * @type {*}
   * @memberof HomeComponent
   */
  citiesArray: any = [];
  /**
   * To get country code based on selected country by user
   *
   * @memberof HomeComponent
   */

  /**
  * Used to store ingredient categories's data.
  */
  ingredientCategories;
  /**
   * Used to store selected category data
   *
   * @memberof HomeComponent
   */
  selectedIngredientCategory;
  /**
   *Used to store selected category ingredient items.
   *
   * @memberof HomeComponent
   */
  selectedIngredientCategoryItems;

  /**
   * Used to store all menus in menus tab
   */
  menus: any = [];
  /**
   * Used to show all menu items of selected menu in menus section
   */
  menuItems: any = [];

  /**
   * Used to store selected menu value
   */
  selectedMenuCat: any = [];

  /**
   * Used for drop down menu of menu design settings
   */

  menuDesignSettings = "Base theme";
  wasClicked = false;
  wasOpenMenu = false;
  haveThemes :boolean = false;
  isSelectedTheme :boolean = false;

  constructor(public util: UtilService, private router: Router, public adminservice: AdminService,
    public authservice: AuthService, public dialog: MatDialog, private formBuilder: FormBuilder,
    private countryservice: CountryService, private verifyservice: VerifyPhoneService, public userservice: UserService) {

  }


  onClick(data) {
    this.authservice.toggleMenusClose();
    this.authservice.getHeaderTitle(data);
    this.authservice.getViewIcon('false');
  }

  dropDownMenus() {
    this.wasOpenMenu = !this.wasOpenMenu;
  }

  headerTitle(data){
      this.authservice.getHeaderTitle(data);
  }


  // updateThemeSetting


  /**
   * Executes when home page loads.
   *
   * @memberof HomeComponent
   */
  ngOnInit() {
    this.authservice.getViewIcon('false');
    this.adminservice.themeCustomize.subscribe((data: any) => {
      this.menuDesignSettings = "Base settings";
    });
    this.authservice.menuToggle.subscribe((data: any) => {
      this.wasClicked = !this.wasClicked;
    });
    this.adminservice.haveTheme.subscribe((data: any) => {
      if (data == 'true') {
        this.haveThemes = true;
      }
      if (data == 'false') {
        this.haveThemes = false;
      }
    });
    this.adminservice.selectedTheme.subscribe((data : any) => {
      this.isSelectedTheme = true;
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.setdata(this.currentUser.user._id);
    this.getCountriesData();
    this.initUserForms();
    // used to get ingredient categories
    this.getIngredientCategories(this.currentUser.user._id);
    // used to get all menus
    this.getMenus();
    //used to get menu customization settings
    this.getMenuCustomizations(this.currentUser.user._id);
    // Used to get all employees in tablet settings
    this.getAllEmployees();

    this.adminservice.updateDefaultSetting(this.currentUser.user._id).subscribe( (res : any ) =>{
      console.log(res);
    });
  }

  /**
   * Used to initialize forms in account settings
   */

  initUserForms() {
    this.companyprofileForm = this.formBuilder.group(
      {
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
        businesstype: ['', Validators.required],
        companyname: ['', Validators.compose([Validators.required,
        Validators.pattern('')
        ])],
        occupation: ['', Validators.compose([Validators.required,
        Validators.pattern('')
        ])],
        cuisinesserved: ['', Validators.compose([Validators.required,
        Validators.pattern('')
        ])],
        countrycode: ['', Validators.required],
      });

    this.securityForm = this.formBuilder.group(
      {
        phone: ['', Validators.required],
        email: ['', Validators.compose([Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])],
        oldpassword: ['', Validators.compose([Validators.minLength(8), Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
        ])],
        newpassword: ['', Validators.compose([Validators.minLength(8), Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
        ])],
        confirmpassword: ['', Validators.compose([Validators.minLength(8), Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
        ])],
        countrycode: ['', Validators.required],
        verifycode: ['', Validators.required],
      });

    this.menu_customizationForm = this.formBuilder.group(
      {
        _id: [''],
        ingredient_type: [''],
        ingredient_quantity: [''],
        spice_title: [''],
        spice_number_options: [''],
        prefrences_title: [''],
      });

    this.tablet_settingsForm = this.formBuilder.group(
      {
        _id: [''],
        ingredient_type: [''],
        ingredient_quantity: [''],
        spice_title: [''],
        spice_number_options: [''],
        prefrences_title: [''],
      });


    // set data to company profile form in account settings.
    if (this.currentUser) {
      this.companyprofileForm.patchValue(this.currentUser.user);
      this.securityForm.patchValue(this.currentUser.user);
      this.weaklyRenewalSwitch = this.currentUser.user.weaklyRenewalSwitch;
    }

  }

  /**
   * Convenience getter for easy access to form fields
   *
   * @readonly
   * @memberof RegistrationComponent
   */
  public get cf() { return this.companyprofileForm.controls; }
  public get sf() { return this.securityForm.controls; }


  /**
   * Executes when user clicks on logout button.
   *
   * @memberof HomeComponent
   */
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Used to get updated status of logged in user.
   *
   * @param {*} id
   * @memberof HomeComponent
   */
  setdata(id) {
    this.adminservice.getSingleUser(id).subscribe((data: any) => {
      localStorage.setItem('currentUser', JSON.stringify(data));
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    });

  }

  /**
   * Opens dialog to update user's plan
   */
  openUpgradeDialog() {
    const dialogRef = this.dialog.open(UpgradeDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        // console.log('Yes clicked');
      }
    });
  }

  /**
   * Used to set active tab of account setting page
   *
   * @param {*} val
   * @memberof HomeComponent
   */
  setTab(val) {
    this.accountSettingTab = val;
    // To update user data on tab change in account
    this.verifyError = '';
    this.verifyStartError = '';
    this.existEmail = '';
    this.companyprofileForm.patchValue(this.currentUser.user);
    this.securityForm.patchValue(this.currentUser.user);
  }

  /**
  * Used to set active tab of menu setting page
  *
  * @param {*} val
  * @memberof HomeComponent
  */
  setMenuSettingsTab(val) {
    this.menuSettingTab = val;
  }

  /**
   * Used to update user's venue info in account settings
   */
  updateVenueInfo() {
    this.updateVenue = false;
    this.updateUserData(this.currentUser.user._id, this.companyprofileForm.value);
  }

  /**
   * To update user data from account setting page
   * @param id
   * @param data
   */
  updateUserData(id, data) {
    this.profileloading = true;
    this.adminservice.updateUser(id, data).subscribe((res: any) => {
      if (res.success) {
        this.profileloading = false;
        this.util.showToast('Data updated successfully');
        this.setdata(id);
      } else {
        this.profileloading = false;
        this.util.showToast('Something went wrong');
      }
    });
  }
  /**
  * Used to update user's contact info in account settings
  */
  updateContactInfo() {
    this.updateContact = false;
    this.updateUserData(this.currentUser.user._id, this.companyprofileForm.value);
  }
  /**
   * To set countries selector data
   */
  updateLocationValues() {
    this.updateLocation = true;
    const values: any = this.companyprofileForm.value;
    this.countries.forEach(item => {
      if (values.country === item.name) {
        this.companyprofileForm.get('country').setValue(item.id);
      }
    });
  }
  /**
   * Used to update user's location in account settings
   */
  updateLocationInfo() {
    this.updateLocation = false;
    // To convert country,state,cities id to name
    const values: any = this.companyprofileForm.value;
    this.statesArray.forEach(item => {
      if (values.state === item.id) {
        values.state = item.name;
        this.companyprofileForm.get('state').setValue(item.name);
      }
    });

    this.countries.forEach(item => {
      if (values.country === item.id) {
        values.country = item.name;
        this.companyprofileForm.get('country').setValue(item.name);
      }
    });

    this.citiesArray.forEach(item => {
      if (values.city === item.id) {
        values.city = item.name;
        this.companyprofileForm.get('city').setValue(item.name);
      }
    });
    this.updateUserData(this.currentUser.user._id, this.companyprofileForm.value);
    this.statesArray = [];
    this.citiesArray = [];
  }

  /**
   * Used to send phone number verification code in account settings
   */
  sentCode() {
    // this.updatePhone = true;
    this.securityForm.get('phone').markAsTouched();
    this.getPhone();
  }
  /**
   * Used to verify code sent in account settings
   */
  verifyCode() {
    this.verifyPhone();
  }
  /**
   * Used to update email info in account settings
   */
  updateEmailInfo() {
    this.securityloading = true;
    this.authservice.updateEmail(this.currentUser.user._id, this.securityForm.value).subscribe((res: any) => {
      if (res.success) {
        this.securityloading = false;
        this.updateEmail = false;
        this.existEmail = '';
        this.util.showToast('Email updated successfully');
        this.setdata(this.currentUser.user._id);
      } else {
        this.securityloading = false;
        this.updateEmail = true;
        this.util.showToast(res.error.message);
        this.existEmail = res.email;
        this.securityForm.get('email').setValue(this.currentUser.user.email);
      }
    });
  }
  /**
   * Used to update phone info in account settings
   */
  updatePasswordInfo() {
    if (this.securityForm.get('newpassword').value != this.securityForm.get('confirmpassword').value) {
      this.util.showToast('New password and confirm password not matched');
      this.updatePassword = true;

    } else {
      this.securityloading = true;
      this.updatePassword = false;
      this.authservice.updatePassword(this.currentUser.user._id, this.securityForm.value).subscribe((res: any) => {
        if (res.success) {
          this.securityloading = false;
          this.util.showToast('Password changed successfully');
          this.setdata(this.currentUser.user._id);
          this.securityForm.get('oldpassword').setValue('');
          this.securityForm.get('newpassword').setValue('');
          this.securityForm.get('confirmpassword').setValue('');
          this.securityForm.get('oldpassword').markAsUntouched();
          this.securityForm.get('newpassword').markAsUntouched();
          this.securityForm.get('confirmpassword').markAsUntouched();


        } else {
          this.securityloading = false;
          this.util.showToast(res.message);
        }
      });
    }

  }
  /**
 * Remove leading and traling spaces in input fields
 *
 * @param {*} string
 * @returns
 * @memberof HomeComponent
 */
  removeSpaces(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }

  /**
  * Function to get all countries, states, cities using country service
  *
  * @memberof HomeComponent
  */
  getCountriesData() {
    this.countryservice.getCountries().subscribe((data) => {
      this.countries = data;
    });
    this.countryservice.getCities().subscribe((data) => {
      this.cities = data;

    });
    this.countryservice.getStates().subscribe((data) => {
      this.states = data;

    });
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
        this.companyprofileForm.controls['countrycode'].setValue(item.countrycode);
      }
    });

    this.statesArray = [];
    if (change === true) {
      this.companyprofileForm.controls['state'].setValue('');
      this.companyprofileForm.controls['city'].setValue('');

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
      this.companyprofileForm.controls['city'].setValue('');
      this.companyprofileForm.controls['city'].markAsTouched();

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
   * @memberof HomeComponent
   */
  getPhone() {
    if (this.securityForm.controls['countrycode'].value !== '' && this.securityForm.controls['phone'].value !== '') {
      const data = {
        via: 'sms',
        country_code: this.securityForm.controls['countrycode'].value,
        phone_number: this.securityForm.controls['phone'].value
      };
      this.securityloading = true;
      this.verifyservice.start(data).subscribe((res: any) => {
        if (res.message) {
          this.securityloading = false;
          this.util.showToast('Message sent to your mobile');
        }
        this.confirmCode = true;
        this.updatePhone = false;
        this.verifyStartError = '';
      },
        error => {
          this.securityloading = false;
          this.verifyStartError = error;
        });
    }
  }

  /**
   * Verify code sent to user's phone number via twillio
   *
   * @memberof HomeComponent
   */
  verifyPhone() {
    if (this.securityForm.controls['verifycode'].value !== '' && this.securityForm.controls['countrycode'].value !== ''
      && this.securityForm.controls['phone'].value !== '') {
      const data = {
        token: this.securityForm.controls['verifycode'].value,
        country_code: this.securityForm.controls['countrycode'].value,
        phone_number: this.securityForm.controls['phone'].value
      };
      this.securityloading = true;
      this.verifyservice.verify(data).subscribe((res) => {
        this.securityloading = false;
        this.verifyError = '';
        this.updateUserData(this.currentUser.user._id, this.securityForm.value);
        this.confirmCode = false;
      },
        error => {
          this.securityloading = false;
          this.verifyError = error;
        });
    }
  }

  /**
   * used to cancel email updation in account settings.
   */
  cancelEmailUpdate() {
    this.existEmail = '';
    this.securityForm.patchValue(this.currentUser.user);
    this.updateEmail = false;
  }

  /**
   * used to cancel password updation at account settings in login and security tab.
   */
  cancelPasswordUpdate() {

    this.securityForm.get('oldpassword').setValue('');
    this.securityForm.get('newpassword').setValue('');
    this.securityForm.get('confirmpassword').setValue('');
    this.securityForm.get('oldpassword').markAsUntouched();
    this.securityForm.get('newpassword').markAsUntouched();
    this.securityForm.get('confirmpassword').markAsUntouched();
    this.updatePassword = false;

  }
  /**
   * used to cancel location updation at account settings in company profile tab.
   */
  cancelLocation() {
    this.statesArray = '';
    this.citiesArray = '';
    this.companyprofileForm.patchValue(this.currentUser.user);
    this.updateLocation = false;
  }
  /**
   * used to cancel venue and type updation at account settings in company profile tab.
   */
  cancelVenue() {
    this.companyprofileForm.patchValue(this.currentUser.user);
    this.updateVenue = false;
  }
  /**
   * used to cancel contact updation at account settings in company profile tab.
   */
  cancelContact() {
    this.companyprofileForm.patchValue(this.currentUser.user);
    this.updateContact = false;
  }
  /**
   * used to cancel phone updation at account settings in login and security tab.
   */
  cancelPhone() {
    this.verifyStartError = '';
    this.securityForm.patchValue(this.currentUser.user);
    this.updatePhone = false;
  }


  /**
 * To open ingredient category item dialog.
 *
 * @param {*} user
 * @memberof HomeComponent
 */
  openIngredientCatItemDialog(cat) {
    if (cat === undefined || cat.length === 0) {
      this.util.showToast('Please add category first.');
    } else {
      const data = { company_id: cat.company_id, category_id: cat._id };
      const dialogRef = this.dialog.open(AddingredientComponent, { data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.photo_file !== '') {
            let input = new FormData();
            input.append('file', result.photo_file);
            this.menuloading = true;
            this.userservice.uploadPhoto(input).subscribe((res: any) => {
              this.menuloading = false;
              if (res.success) {
                result.photo_url = res.url;
                result.photo_name = res.photo_name;
                this.addIngredientCategoryItem(result);
              }
            });
          } else {
            this.addIngredientCategoryItem(result);
          }
        }
      });
    }
  }

  /**
   * Used to add ingredient category item
   * @param result 
   */
  addIngredientCategoryItem(result) {
    this.ingredientloading = true;
    this.adminservice.addIngredientCategoryItem(result).subscribe((res: any) => {
      this.ingredientloading = false;
      if (res.data) {
        this.getIngredientCategoryItems(res.data.company_id);
      }
    });
  }
  /**
   * To open ingredient category dialog.
   *
   * @memberof HomeComponent
   */
  openIngredientCatDialog() {
    const dialogRef = this.dialog.open(IngredientCategoryComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'No') {
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          this.menuloading = true;
          this.userservice.uploadPhoto(input).subscribe((res: any) => {
            this.menuloading = false;
            if (res.success) {
              result.photo_url = res.url;
              result.photo_name = res.photo_name;
              this.addCategory(result);
            }
          });
        } else {
          this.addCategory(result);
        }
      }
    });
  }

  /**
   * Used to add ingredient category
   * @param result 
   */
  addCategory(result) {
    this.ingredientloading = true;
    this.userservice.addCategory(result).subscribe((data) => {
      this.ingredientloading = false;
      this.getIngredientCategories(this.currentUser.user._id);
    });
  }

  /**
     * To get all available list of ingredient categories.
     *
     * @memberof HomeComponent
     */
  getIngredientCategories(user_id) {
    this.ingredientloading = true;
    this.userservice.getIngredientCategories(user_id).subscribe((res: any) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.ingredientloading = false;
          this.ingredientCategories = res.data;
          this.ingredientCategories.forEach(element => {
            element.drag = false;
          });
          if (this.ingredientCategories.length > 0) {
            this.selectedcat(this.ingredientCategories[0]); // to set first category selected by default from ingredient categories.
            this.getIngredientCategoryItems(this.ingredientCategories[0].company_id); // to show default selected ingredient category items
          }
        } else {
          this.ingredientloading = false;
          // clear data if no ingredient category data found.
          this.ingredientCategories = [];
          this.selectedIngredientCategory = [];
          this.selectedIngredientCategoryItems = [];
        }
      } else {
        this.ingredientloading = false;
        this.util.showToast('Something went wrong');
      }
    });
  }

  /**
  *used to get selected category ingredient items
  *
  * @param {*} category
  * @memberof HomeComponent
  */
  selectedcat(category) {
    this.selectedIngredientCategory = category;
    if (this.selectedIngredientCategory) {
      this.getIngredientCategoryItems(category.company_id);
    }
  }

  /**
   * To get list of ingredient items of selected category(based on company id).
   *
   * @param {*} compid
   * @memberof HomeComponent
   */
  getIngredientCategoryItems(compid) {
    this.ingredientloading = true;
    this.adminservice.getAllingredientCategoryitem(compid).subscribe((res: any) => {
      if (res.success) {
        this.ingredientloading = false;
        this.selectedIngredientCategoryItems = res.data;
      } else {
        this.ingredientloading = false;
        this.util.showToast('Something went wrong');
      }
    });
  }
  /**
 * Executes when user clicks on move menu of ingredient category.
 *
 * @memberof HomeComponent
 */
  moveCat(item) {
    item.drag = true;
    this.drag = true;
  }
  /**
 * Executes when ingredient category dropped after dragging.
 */
  drop(event: CdkDragDrop<string[]>) {
    this.ingredientCategories.forEach(element => {
      element.drag = false;
    });
    this.drag = false;
    moveItemInArray(this.ingredientCategories, event.previousIndex, event.currentIndex);
  }

  /**
  * Executes when user clicks on duplicate menu of ingredient category.
  *
  * @param {*} category
  * @memberof HomeComponent
  */
  duplicateCat(category) {
    this.ingredientloading = true;
    const data = { name: category.name, photo_url: category.photo_url, user_id: this.currentUser.user._id, ingredients: [] };
    this.userservice.addCategory(data).subscribe((res: any) => {
      if (res.success) {
        this.ingredientloading = false;
        this.getIngredientCategories(this.currentUser.user._id);
      } else {
        this.ingredientloading = false;
      }
    });
  }

  /**
 * To delete selected category based on category_id.
 *
 * @param {*} id
 * @memberof HomeComponent
 */
  deletecat(id) {
    this.openFeedbackDialog(id);
  }

  /**
  * Used to open feedback dialog when user tries to remove selected category
  *
  * @memberof ProfileDialogComponent
  */
  openFeedbackDialog(id) {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.adminservice.deleteCategory(id).subscribe((res: any) => {
          if (res.message) {
            this.util.showToast(res.message);
            this.getIngredientCategories(this.currentUser.user._id);
            this.selectedIngredientCategory = ''; // to clear selected category name
          } else {
            this.util.showToast('Something went wrong');
          }
        });
        dialogRef.close('Yes');
      }
    });
  }

  /**
 * Used to delete category item based on id
 * @param id
 */
  deleteCatItem(id) {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.adminservice.deleteCategoryItem(id).subscribe((res: any) => {
          if (res.message) {
            this.util.showToast(res.message);
            this.getIngredientCategoryItems(res.result.company_id);
          } else {
            this.util.showToast('Something went wrong');
          }
        });
        dialogRef.close('Yes');
      }
    });
  }

  /**
  * Used to edit category ingredient item
  * @param item
  */
  editCatItem(item) {
    const dialogRef = this.dialog.open(AddingredientComponent, { data: item });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          this.menuloading = true;
          this.userservice.uploadPhoto(input).subscribe((res: any) => {
            this.menuloading = false;
            if (res.success) {
              result.photo_url = res.url;
              result.photo_name = res.photo_name;
              this.updateIngredientCategoryItem(result.category_id, result);
            }
          });
        } else {
          this.updateIngredientCategoryItem(result.category_id, result);
        }
      }
    });
  }

  /**
   * Used to update ingredient category item
   * @param category_id 
   * @param result 
   */
  updateIngredientCategoryItem(category_id, result) {
    this.ingredientloading = true;
    this.adminservice.updateIngredientCategoryItem(category_id, result).subscribe((res: any) => {
      this.ingredientloading = false;
      if (res.ingredient) {
        this.getIngredientCategoryItems(res.ingredient.company_id);
      }
    });
  }

  /**
   * To update selected Ingredient category.
   *
   * @param {*} cat
   * @memberof HomeComponent
   */
  editCat(cat) {
    const dialogRef = this.dialog.open(IngredientCategoryComponent, { data: cat });
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'No') {
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          this.menuloading = true;
          this.userservice.uploadPhoto(input).subscribe((res: any) => {
            this.menuloading = false;
            if (res.success) {
              result.photo_url = res.url;
              result.photo_name = res.photo_name;
              result.company_id = cat.company_id;
              this.updateIngredientCategory(result._id, result);
            }
          });
        } else {
          result.company_id = cat.company_id;
          this.updateIngredientCategory(result._id, result);
        }
      }
    });
  }

  /**
   * Used to update ingredient category
   * @param _id 
   * @param result 
   */
  updateIngredientCategory(_id, result) {
    this.ingredientloading = true;
    this.userservice.updateIngredientCategory(_id, result).subscribe((res1: any) => {
      this.ingredientloading = false;
      if (res1) {
        this.ingredientloading = true;
        this.userservice.getIngredientCategories(this.currentUser.user._id).subscribe((res: any) => {
          if (res.success) {
            if (res.data.length > 0) {
              this.ingredientloading = false;
              this.ingredientCategories = res.data;
              this.ingredientCategories.forEach(element => {
                element.drag = false;
              });
              if (this.ingredientCategories.length > 0) {
                this.selectedcat(res1.user);
                this.getIngredientCategoryItems(res1.user.company_id);
              }
            } else {
              this.ingredientloading = false;
              this.ingredientCategories = [];
              this.selectedIngredientCategory = [];
              this.selectedIngredientCategoryItems = [];
            }
          } else {
            this.ingredientloading = false;
            this.util.showToast('Something went wrong');
          }
        });
      }
    });
  }

  /**
  * To open menu dialog.
  *
  * @param {*} user
  * @memberof HomeComponent
  */
  openMenuDialog() {
    const dialogRef = this.dialog.open(MenuDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'No' || result == undefined) {
      } else {
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          // console.log(result.photo_file, 'Working');
          this.menuloading = true;
          this.userservice.uploadPhoto(input).subscribe((res: any) => {
            this.menuloading = false;
            if (res.success) {
              result.photo_url = res.url;
              result.photo_name = res.photo_name;
              this.addMenu(result);
            }
          });
        } else {
          this.addMenu(result);
        }
      }
    });
  }

  /**
   * Used to add menu
   * @param result 
   */
  addMenu(result) {
    this.menuloading = true;
    this.userservice.addMenu(result).subscribe((res: any) => {
      this.menuloading = false;
      if (res) {
        this.getMenus();
      }
    });
  }

  /**
   * Used to create duplicate menu item
   */
  duplicateMenu(item) {
    let menuItems: any = [];
    this.userservice.getMenuItems(item._id).subscribe((resMenuItems: any) => {
      menuItems = resMenuItems.data;
      delete item._id;
      delete item.__v;
      item.name = item.name;
      this.menuloading = true;
      this.userservice.addMenu(item).subscribe((resAddmneu: any) => {
        this.menuloading = false;
        if (resAddmneu.data._id) {
          menuItems.forEach(element => {
            delete element._id;
            delete element.__v;
            element.menu_id = resAddmneu.data._id;
            if (element.menu_id !== undefined) {
              this.menuloading = true;
              this.userservice.addMenuItem(element).subscribe((resItem: any) => {
                this.menuloading = false;
              });
            }
          });
          this.getMenus();
        }
      });
    });
  }

  /**
   * Used to duplicate menu item
   */

  duplicateMenuItem(item) {
    delete item._id;
    delete item.__v;
    this.addMenuItem(item);
  }

  /**
   * To open add menu item dialog.
   *
   * @param {*} user
   * @memberof HomeComponent
   */
  openMenuItemDialog() {
    if (this.selectedMenuCat.length === 0) {
      this.util.showToast('Please add menu first');
    } else {
      const dialogRef = this.dialog.open(MenuItemDialogComponent, { data: this.selectedMenuCat });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'No' || result == undefined) {
        } else {
          if (result.photo_file !== '') {
            let input = new FormData();
            input.append('file', result.photo_file);
            this.menuloading = true;
            this.userservice.uploadPhoto(input).subscribe((res: any) => {
              this.menuloading = false;
              if (res.success) {
                result.photo_urls = res.url;
                result.photo_name = res.photo_name;
                this.addMenuItem(result);
              }
            });
          } else {
            this.addMenuItem(result);
          }
        }
      });
    }

  }

  /**
   * Used to add menu item
   * @param result 
   */
  addMenuItem(result) {
    this.menuloading = true;
    this.userservice.addMenuItem(result).subscribe((res: any) => {
      this.menuloading = false;
      if (res) {
        this.getMenuItems(res.data.menu_id);
      }
    });
  }

  /**
   * Used to get list of all available menus
   */
  getMenus() {
    this.menuloading = true;
    this.userservice.getMenus(this.currentUser.user._id).subscribe((res: any) => {
      this.menuloading = false;
      this.menus = res.data;
      this.menus.forEach(element => {
        element.drag = false;
      });
      // console.log('Menus', res.data);
      if (res.data.length !== 0) {
        // this.getMenuItems(res.data.menu_id);
        this.selectedMenu(this.menus[0]);
      }
    });
  }

  /**
   * Used to get list of all available menu items
   */
  getMenuItems(menu_id) {
    this.menuloading = true;
    this.userservice.getMenuItems(menu_id).subscribe((res: any) => {
      this.menuloading = false;
      if (res.success) {
        this.menuItems = res.data;
        this.menuItems.forEach(element => {
          if (element.menus.length !== 0) {
            if (element.menu_type == 'Regular menu') {
              var a = this.selectedMenuCat.subsection.indexOf(element.menus[0].section);
              if (a == -1) {
                this.menuloading = true;
                this.userservice.deleteMenuItem(element._id).subscribe((res: any) => {
                  this.menuloading = false;
                  if (res.success) {
                    this.getMenuItems(menu_id);
                  }
                });
              }
            } else {
              var a = this.selectedMenuCat.course.indexOf(element.menus[0].section);
              if (a == -1) {
                this.menuloading = true;
                this.userservice.deleteMenuItem(element._id).subscribe((res: any) => {
                  this.menuloading = false;
                  if (res.success) {
                    this.getMenuItems(menu_id);
                  }
                });
              }
            }
          }
        });
      }
    });
  }

  /**
   * Executes when user clicks on move i menus.
   *
   * @memberof HomeComponent
   */
  moveMenu(item) {
    item.drag = true;
    this.dragMenus = true;
  }

  /**
    * Executes when ingredient category dropped after dragging.
    */
  dropMenu(event: CdkDragDrop<string[]>) {

    moveItemInArray(this.menus, event.previousIndex, event.currentIndex);
    this.menus.forEach(element => {
      element.drag = false;
    });
    this.dragMenus = false;
  }
  /**
   * Executes when user clicks on menu
   * @param item
   */
  selectedMenu(item) {
    if (this.selectedMenuCat !== item) {
      this.selectedMenuCat = item;
      this.getMenuItems(this.selectedMenuCat._id);
    }
  }

  /**
   * Used to delete menu based on menu id
   */
  deleteMenu(item) {
    let countRegularMenu = 0;
    let countPrixMenu = 0;
    this.menus.forEach(element => {
      if (element.menu_type == 'Regular menu') {
        countRegularMenu = countRegularMenu + 1;
      } else {
        countPrixMenu = countPrixMenu + 1;
      }
    });
    if ((item.menu_type == 'Regular menu') && (countRegularMenu <= 1)) {
      this.util.showToast('you cannot delete only Regular Menu.');
    } else if ((item.menu_type == 'Prix-fixe menu') && (countPrixMenu <= 1)) {
      this.util.showToast('you cannot delete only Prix-Fixe Menu.');
    }
    else {
      const dialogRef = this.dialog.open(FeedbackDialogComponent, {});
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Yes') {
          this.menuloading = true;
          this.userservice.deleteMenu(item._id).subscribe((res: any) => {
            this.menuloading = false;
            // console.log('res', res);
            if (res.success) {
              this.menuItems = [];
              this.selectedMenuCat = [];
              this.getMenus();
              dialogRef.close('Yes');
            }
          });
        }
      });
    }
  }

  /**
   *Used to delete menu
   *
   * @param {*} item
   * @memberof HomeComponent
   */
  editMenu(item) {
    //  console.log('item', item);
    const dialogRef = this.dialog.open(MenuDialogComponent, { data: item });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('result', result);
      if (result == undefined || result == 'No') {

      } else {
        // console.log('result', result);
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          this.menuloading = true;
          this.userservice.uploadPhoto(input).subscribe((res: any) => {
            this.menuloading = false;
            if (res.success) {
              result.photo_url = res.url;
              result.photo_name = res.photo_name;
              this.updateMenu(item._id, result, item);
            }
          });
        } else {
          this.updateMenu(item._id, result, item);
        }
      }
    });
  }

  /**
   * Used to update menu
   * @param _id 
   * @param result 
   * @param item 
   */
  updateMenu(_id, result, item) {
    this.menuloading = true;
    this.userservice.updateMenu(_id, result).subscribe((res: any) => {
      this.menuloading = false;
      if (res) {
        // used to update menus
        this.menuloading = true;
        this.userservice.getMenus(this.currentUser.user._id).subscribe((res: any) => {
          this.menuloading = false;
          this.menus = res.data;
          this.menus.forEach(element => {
            element.drag = false;
            if (element._id == item._id) {
              this.selectedMenu(element);
            }
          });
        });
      }
    });
  }

  /**
   * Used to delete menu item
   */
  deleteMenuItem(item) {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.menuloading = true;
        this.userservice.deleteMenuItem(item._id).subscribe((res: any) => {
          this.menuloading = false;
          // console.log('res', res);
          if (res.success) {
            this.getMenuItems(item.menu_id);
            dialogRef.close('Yes');
          }
        });
      }
    });
  }

  /**
   * Used to edit menu item
   */
  editMenuItem(item) {
    // console.log('Home Item ', item);
    const dialogRef = this.dialog.open(MenuItemDialogComponent, { data: item });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'No' || result == undefined) {

      } else {
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          this.menuloading = true;
          this.userservice.uploadPhoto(input).subscribe((res: any) => {
            this.menuloading = false;
            if (res.success) {
              result.photo_urls = res.url;
              result.photo_name = res.photo_name;
              this.updateMenuItem(item._id, result, item, dialogRef);
            }
          });
        } else {
          this.updateMenuItem(item._id, result, item, dialogRef);
        }
      }
    });

  }

  /**
   * Used to update menu item
   * @param _id 
   * @param result 
   * @param item 
   * @param dialogRef 
   */
  updateMenuItem(_id, result, item, dialogRef) {
    this.menuloading = true;
    this.userservice.updateMenuItem(_id, result).subscribe((res: any) => {
      this.menuloading = false;
      if (res.success) {
        this.getMenuItems(item.menu_id);
        dialogRef.close('Yes');
      }
    });
  }
  /**
   *Used to get menu custizations settings
   *
   * @param {*} userid
   * @memberof HomeComponent
   */
  getMenuCustomizations(userid) {
    this.userservice.getMenuCustomization(userid).subscribe((res: any) => {
      if (res.data.length !== 0) {
        // console.log('Data ', res.data);
        this.menu_customizationForm.patchValue(res.data[0]);
      }
    });
  }

  /**
   *Used to get menu settings data
   *
   * @memberof HomeComponent
   */
  submitMenuCustomization() {
    if (this.menu_customizationForm.get('ingredient_type').value == 'Toggle') {
      this.menu_customizationForm.get('ingredient_quantity').setValue(0);
    } else {
      this.menu_customizationForm.get('ingredient_quantity').setValue(parseInt(this.menu_customizationForm.get('ingredient_quantity').value));
    }
    this.menu_customizationForm.get('spice_number_options').setValue(parseInt(this.menu_customizationForm.get('spice_number_options').value));
    // console.log('Customazation: ', this.menu_customizationForm.value);
    this.userservice.updateMenuCustomization(this.menu_customizationForm.get('_id').value, this.menu_customizationForm.value).subscribe((res: any) => {
      //  console.log('Data ', res);
      if (res.success) {
        let data = { title: 'Confirmation', show: false, yesbtn: 'OK', message: "Modifier settings has been updated." }
        const dialogRef = this.dialog.open(WarningDialogComponent, { data: data });
        // this.util.showActionToast('Modifier settings has been updated','OK');
      }
    });
  }


  /**
   * Used to add new employee in tablet settings
   */
  addNewEmployee() {
    const dataToSend = { countries: this.countries, states: this.states, cities: this.cities, restaurantData: this.currentUser.user }
    const dialogRef = this.dialog.open(AddEmployeeComponent, { data: dataToSend });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === 'No') {
      } else {
        if (result) {
          this.getAllEmployees();
        }
      }
    });
  }
  /**
   *Used to get list of all available employees
   *
   * @memberof HomeComponent
   */
  getAllEmployees() {
    this.tabletloading = true;
    this.userservice.getEmployees(this.currentUser.user._id).subscribe((res: any) => {
      this.tabletloading = false;
      if (res.data) {
        this.teamMembers = res.data;
      }
    });
  }

  /**
   *Used to edit employee data
   *
   * @param {*} item
   * @memberof HomeComponent
   */
  editEmployee(item) {
    const dataItem = JSON.parse(JSON.stringify(item));
    const dataToSend = { empData: dataItem, countries: this.countries, states: this.states, cities: this.cities }
    const dialogRef = this.dialog.open(AddEmployeeComponent, { data: dataToSend });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === 'No') {
      } else {
        if (result) {
          this.getAllEmployees();
        }
      }
    });
  }

  /**
   * Used to delete Employee
   */
  deleteEmployee(item) {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.userservice.deleteEmployee(item._id).subscribe((res: any) => {
          if (res.message) {
            this.util.showToast(res.message);
            this.getAllEmployees();
          } else {
            this.util.showToast('Something went wrong');
          }
        });
        dialogRef.close('Yes');
      }
    });
  }

  /**
   * Used to check value of weakly renewal switch
   */
  radioChange() {
    // console.log(this.weaklyRenewalSwitch);
    this.adminservice.updateUser(this.currentUser.user._id, { weaklyRenewalSwitch: this.weaklyRenewalSwitch }).subscribe((res: any) => {
      if (res.success) {
        this.weaklyRenewal(res.user);
        this.setdata(res.user._id);
        if (res.user.weaklyRenewalSwitch == 'true') {
          this.util.showToast('Weakly renewal turned On successfully.');
        } else {
          this.util.showToast('Weakly renewal turned Off successfully.');
        }
      } else {
        this.util.showToast('Something went wrong');
      }
    });
  }
  /**
   * Used to email new codes to all employees
   */
  resetCodes() {
    this.userservice.resetCodes(this.currentUser.user).subscribe((res: any) => {
      if (res.success == true) {
        this.util.showToast(res.message);
        this.getAllEmployees();
      } else {
        this.util.showToast('Something went wrong');
      }
    });
  }

  viewEmployee(item) {
    const dataItem = JSON.parse(JSON.stringify(item));
    const dialogRef = this.dialog.open(TeamMemberComponent, { data: dataItem });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === 'No') {
      } else {
        if (result == 'Yes') {
          this.getAllEmployees();
        }
      }
    });
  }

  weaklyRenewal(user) {
    this.userservice.weaklyRenewal(user).subscribe((res: any) => {
      if (res.success == true) {
        this.getAllEmployees();
      }
    });
  }

  openAccessCodes() {
    const dataItem = JSON.parse(JSON.stringify(this.teamMembers));
    const dialogRef = this.dialog.open(AccessCodesComponent, { data: dataItem });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === 'No') {
      } else {
        if (result == 'Yes') {
          //  this.getAllEmployees();
        }
      }
    });
  }

  settingsChanged(value) {
    //  console.log(value);
  }

}
