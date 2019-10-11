import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCompressService} from  'ng2-image-compress';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-ingredient-item-dialog',
  templateUrl: './ingredient-item-dialog.component.html',
  styleUrls: ['./ingredient-item-dialog.component.scss']
})
export class IngredientItemDialogComponent implements OnInit {

  /**
   * Used to store new category item information.
   *
   * @type {FormGroup}
   * @memberof IngredientItemDialogComponent
   */
  addCatItemForm: FormGroup;
  btntext = 'Add new ingredient';
  titletext = 'new ingredient';

  constructor(public dialogRef: MatDialogRef<IngredientItemDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, public admin_service: AdminService,) { }

  /**
   * Executes when dialog loads.
   *
   * @memberof IngredientItemDialogComponent
   */
  ngOnInit() {
    //  console.log('my ', this.data);
    this.addCatItemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      photo_url: ['', Validators.required],
      photo_name:'',
      photo_file:'',
      company_id: [''],
      category_id: ['']
    });
    if (this.data.name) {
      this.btntext = 'Update ingredient';
      this.titletext = 'Edit ingredient'
      this.addCatItemForm.get('category_id').setValue(this.data._id);
      this.addCatItemForm.patchValue(this.data);
    }
  }

  public get f() { return this.addCatItemForm.controls; }

  /**
   * Yes button action of alert dialog
   *
   * @memberof IngredientItemDialogComponent
   */
  save() {
    this.dialogRef.close('Yes');
  }

  /**
   * No button action of alert dialog
   *
   * @memberof IngredientItemDialogComponent
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Executes when user clicks on create ingredient button to add ingredient item.
   *
   * @memberof IngredientItemDialogComponent
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
   * @memberof IngredientItemDialogComponent
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
                this.admin_service.deletePhoto(this.addCatItemForm.get('photo_name').value).subscribe((res: any) => {
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
      this.admin_service.deletePhoto(this.addCatItemForm.get('photo_name').value).subscribe((res: any) => {
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
