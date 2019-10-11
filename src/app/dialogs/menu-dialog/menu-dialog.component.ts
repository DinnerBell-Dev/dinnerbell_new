import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { ImageCompressService } from 'ng2-image-compress';
import { FeedbackDialogComponent } from 'src/app/admin/dialogs/feedback-dialog/feedback-dialog.component';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.scss']
})
export class MenuDialogComponent implements OnInit {
  
  currentUser;

  /**
   *Used to set start time for dialog
   *
   * @memberof MenuDialogComponent
   */
  startAt = new Date();
  /**
   *Used to subsections of menu
   *
   * @type {*}
   * @memberof MenuDialogComponent
   */
  subsections: any = [];
  /**
   *Used to store cources of prefixe menu
   *
   * @type {*}
   * @memberof MenuDialogComponent
   */
  courses: any = [];
  /**
   *setbtn text for dialog
   *
   * @memberof MenuDialogComponent
   */
  btntext = 'Create menu';
  /**
   *Used to show /hde loading indicator
   *
   * @type {Boolean}
   * @memberof MenuDialogComponent
   */
  menuloading: Boolean = false;
  /**
     * Used to store new category item information.
     *
     * @type {FormGroup}
     * @memberof MenuDialogComponent
     */
  menuForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<MenuDialogComponent>, private formBuilder: FormBuilder,public dialog: MatDialog,
    public userservice: UserService, @Inject(MAT_DIALOG_DATA) public data: any, public util: UtilService) {
    this.startAt.setMinutes(this.startAt.getMinutes() + 60);
  }
  /**
     * Executes when dialog loads.
     *
     * @memberof MenuDialogComponent
     */
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.menuForm = this.formBuilder.group({
      name: ['', Validators.required],
      user_id: this.currentUser.user._id,
      status: ['true', Validators.required],
      from_at: ['', Validators.required],
      to_at: ['', Validators.required],
      menu_type: ['Regular menu', Validators.required],
      photo_url: [''],
      subsection: [this.subsections],
      course: [this.courses],
      meal_price: [''],
      subsection_switch: ['false'],
      subsection_name: '',
      course_name: '',
      photo_name: '',
      photo_file:''
    });
    if (this.data === null || this.data === undefined) {
      this.btntext = 'Create menu';
    } else {
      this.btntext = 'Update menu';
      this.getMenu(this.data._id);
    }
  }

  public get f() { return this.menuForm.controls; }

  /**
   * No button action of alert dialog
   *
   * @memberof MenuDialogComponent
   */
  close() {
    this.dialogRef.close('No');
  }

  createMenu() {
    if (this.menuForm.get('meal_price').value === '' && this.menuForm.get('menu_type').value !== 'Regular menu') {
      this.util.showToast('Meal price cannot be empty.');
    } else {
      this.dialogRef.close(this.menuForm.value);
    }
  }

  /**
   * Executes when user clicks on image to select a picture form resource.
   *
   * @param {*} event
   * @memberof MenuDialogComponent
   */
  onFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            this.menuForm.patchValue({
              photo_url: image.imageDataUrl,
              photo_file: file
            });
            // console.log(this.menuForm.value);
            if (this.menuForm.get('photo_name').value !== '') {
                this.menuloading = true;
                this.userservice.deletePhoto(this.menuForm.get('photo_name').value).subscribe((res: any) => {
                this.menuloading = false;
                if (res.success) {
                  this.menuForm.get('photo_name').setValue('');
                  // console.log(this.menuForm.get('photo_name'));
                }
               });
            }
          });
          
        }, (error) => {
          // console.log("Error while converting");
        });
      });
    }
  }

  /**
   * Used to add subections
   */
  addSubsection() {
    this.subsections.push(this.f.subsection_name.value);
    this.menuForm.get('subsection').setValue(this.subsections);
    this.f.subsection_name.setValue('');
  }
  /**
  * Used to remove subection item
  */
  removeSubsection(item) {
    let data = {title:'Warning', message:"Menu removal will cause menu items to be deleted.This action cannot be undone.Are you sure you want to remove this subsection ?"}
    const dialogRef = this.dialog.open(WarningDialogComponent, {data:data});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.removeItem(this.subsections, item);
        this.menuForm.get('subsection').setValue(this.subsections);
      }
    });
  }

  /**
   * Used to remove item from array by value
   * @param array
   * @param item
   */
  removeItem(array, item) {
    for (var i in array) {
      if (array[i] == item) {
        array.splice(i, 1);
        break;
      }
    }
  }
  /**
    * Used to remove course item
    */
  removeCourse(item) {
    let data = {title:'Warning', message:"Menu removal will cause menu items to be deleted.This action cannot be undone.Are you sure you want to remove this course ?"}
    const dialogRef = this.dialog.open(WarningDialogComponent, {data:data});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.removeItem(this.courses, item);
        this.menuForm.get('course').setValue(this.courses);
      }
    });
   
  }

  /**
   * Used to add course item
   */
  addCourse() {
    this.courses.push(this.f.course_name.value);
    this.menuForm.get('course').setValue(this.courses);
    this.f.course_name.setValue('');
  }

  /**
* Remove leading and traling spaces in input fields
*
* @param {*} string
* @returns
* @memberof MenuDialogComponent
*/
  removeSpaces(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }

  /**
   * Used to get menu item based on id
   */
  getMenu(id) {
    this.menuloading = true;
    this.userservice.getMenu(id).subscribe((res: any) => {
      this.menuloading = false;
      let menuData = res.data[0];
      if (res.success) {
        this.menuForm.patchValue(menuData);
        this.subsections = menuData.subsection;
        this.courses = menuData.course;
        this.menuForm.get('status').setValue(String(menuData.status));
      }
    });
  }

  /**
   *Used for meal price validation
   *
   * @memberof MenuDialogComponent
   */
  priceChanged() {
    if (isNaN(this.menuForm.get('meal_price').value)) {
      this.menuForm.get('meal_price').setValue('');
    }
  }

  /**
   * Used to remove image from mongodb database
   * @param name 
   */
  removePhoto(name) {
    if (this.menuForm.get('photo_name').value !== '') {
      this.menuloading = true;
      this.userservice.deletePhoto(this.menuForm.get('photo_name').value).subscribe((res: any) => {
      this.menuloading = false;
      if (res.success) {
        this.menuForm.get('photo_name').setValue('');
        this.menuForm.get('photo_url').setValue('');
        this.menuForm.get('photo_file').setValue('');
      }
     });
    } else {
      this.menuForm.get('photo_name').setValue('');
      this.menuForm.get('photo_url').setValue('');
      this.menuForm.get('photo_file').setValue('');
    }
  }

  /**
   * Used to convert compressed image to file object
   * @param url 
   * @param filename 
   * @param mimeType 
   */
  urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }

}