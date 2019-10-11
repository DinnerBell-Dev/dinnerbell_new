import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { UserService } from 'src/app/services/user.service';
import { ImageCompressService} from  'ng2-image-compress';

@Component({
  selector: 'app-addingredient',
  templateUrl: './addingredient.component.html',
  styleUrls: ['./addingredient.component.scss']
})
export class AddingredientComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  labels: any = [];

  /**
   * Used to store new category item information.
   *
   * @type {FormGroup}
   * @memberof AddingredientComponent
   */
  addCatItemForm: FormGroup;
  btntext = 'Add new ingredient';
  titletext = 'new ingredient';


  constructor(public dialogRef: MatDialogRef<AddingredientComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private formBuilder: FormBuilder, public userservice: UserService) { }

   /**
   * Executes when dialog loads.
   *
   * @memberof AddingredientComponent
   */
  ngOnInit() {
      //  console.log('my ', this.data);
      this.getLabels();
      this.addCatItemForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        photo_url: ['', Validators.required],
        photo_file:'',
        photo_name:'',
        company_id: [''],
        category_id: [''],
        label:['', Validators.required],
        price:[undefined, Validators.compose([Validators.required,
          Validators.pattern('^[0-9]*$')
          ])],
      });
      if (this.data.name) {
        this.btntext = 'Update ingredient';
        this.titletext = 'Edit ingredient'
        this.addCatItemForm.get('category_id').setValue(this.data._id);
        this.addCatItemForm.patchValue(this.data);
        // this.labels = this.data.label;
      }
  }

   /**
   * Used to get all labels available
   */
  getLabels() {
    this.userservice.getAllLabels().subscribe((res: any) => {
      if (res) {
        // console.log('Labels ', res);
        this.labels = res.data;
      }
    });
  }


  public get f() { return this.addCatItemForm.controls; }

  /**
   * No button action of alert dialog
   *
   * @memberof AddingredientComponent
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Executes when user clicks on create ingredient button to add ingredient item.
   *
   * @memberof AddingredientComponent
   */
  createIngredientItem() {
    if (this.data.name) {
      this.dialogRef.close(this.addCatItemForm.value);
    } else {
      this.addCatItemForm.patchValue(this.data);
      this.dialogRef.close(this.addCatItemForm.value);
    }

  }

  /**
   * Executes when user clicks on image to select a picture form resource.
   *
   * @param {*} event
   * @memberof AddingredientComponent
   */
  onFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          // console.log(image);
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            this.addCatItemForm.patchValue({
              photo_url: image.imageDataUrl,
              photo_file: file
            });
            if (this.addCatItemForm.get('photo_name').value !== '') {
                this.userservice.deletePhoto(this.addCatItemForm.get('photo_name').value).subscribe((res: any) => {
                if (res.success) {
                  this.addCatItemForm.get('photo_name').setValue('');
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
* Remove leading and traling spaces in input fields
*
* @param {*} string
* @returns
* @memberof IngredientItemDialogComponent
*/
  removeSpaces(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }

  /**
   * Used to remove image from mongodb database
   * @param name 
   */
  removePhoto(name) {
    if (this.addCatItemForm.get('photo_name').value !== '') {
      this.userservice.deletePhoto(this.addCatItemForm.get('photo_name').value).subscribe((res: any) => {
      if (res.success) {
        this.addCatItemForm.get('photo_name').setValue('');
        this.addCatItemForm.get('photo_url').setValue('');
        this.addCatItemForm.get('photo_file').setValue('');
      }
     });
    } else {
      this.addCatItemForm.get('photo_name').setValue('');
      this.addCatItemForm.get('photo_url').setValue('');
      this.addCatItemForm.get('photo_file').setValue('');
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
