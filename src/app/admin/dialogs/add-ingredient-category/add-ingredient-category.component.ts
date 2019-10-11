import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCompressService} from  'ng2-image-compress';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-add-ingredient-category',
  templateUrl: './add-ingredient-category.component.html',
  styleUrls: ['./add-ingredient-category.component.scss']
})
export class AddIngredientCategoryComponent implements OnInit {

  addCatForm: FormGroup;
  btntext = 'Create new ingredient category';
  currentUser;

  constructor(public dialogRef: MatDialogRef<AddIngredientCategoryComponent>,
    public admin_service: AdminService,
    private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * Executes when dialog loads.
   *
   * @memberof AddIngredientCategoryComponent
   */
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('adminUser'));
    this.addCatForm = this.formBuilder.group({
      name: ['', Validators.required],
      photo_url: ['', Validators.required],
      photo_name:'',
      photo_file:'',
      createdbyAdmin:true,
      _id: ''
    });
    if (this.data) {
      this.btntext = 'Update ingredient category';
      this.addCatForm.patchValue(this.data);
    }
  }

  public get f() { return this.addCatForm.controls; }

  /**
   * Yes button action of alert dialog
   *
   * @memberof AddIngredientCategoryComponent
   */
  save() {
    this.dialogRef.close('Yes');
  }

  /**
   * No button action of alert dialog
   *
   * @memberof AddIngredientCategoryComponent
   */
  close() {
    this.dialogRef.close();
  }

  /**
 * Remove leading and traling spaces in input fields
 *
 * @param {*} string
 * @returns
 * @memberof AddIngredientCategoryComponent
 */
  removeSpaces(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }

  /**
   * Executes when user clicks on create new ingredient category button.
   *
   * @memberof AddIngredientCategoryComponent
   */
  createCategory() {
    this.dialogRef.close(this.addCatForm.value);
  }

  /**
   * Executes when user clicks on image to select a picture form resource.
   *
   * @param {*} event
   * @memberof AddIngredientCategoryComponent
   */
  onFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
         //  console.log(image);
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            this.addCatForm.patchValue({
              photo_url: image.imageDataUrl,
              photo_file: file
            });
            if (this.addCatForm.get('photo_name').value !== '') {
                this.admin_service.deletePhoto(this.addCatForm.get('photo_name').value).subscribe((res: any) => {
                if (res.success) {
                  this.addCatForm.get('photo_name').setValue('');
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
