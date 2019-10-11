import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { UtilService } from 'src/app/services/util.service';
import { ImageCompressService} from  'ng2-image-compress';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-ingredient-category',
  templateUrl: './ingredient-category.component.html',
  styleUrls: ['./ingredient-category.component.scss']
})
export class IngredientCategoryComponent implements OnInit {

  importItems: Boolean = false;

   /**
   * Used to store new category item information.
   *
   * @type {FormGroup}
   * @memberof IngredientCategoryComponent
   */
  ingredientCat: FormGroup;
  /**
   * show/hide loading indicator in ingredints section
   */
  ingredientloading: Boolean = false;
  /**
   * Used to store ingredint category added by admin
   */
  adminIngredientCat: any = [];
  /**
   * used to store ingredients from selected category
   */
  loadedIngredients:any = [];
  /**
   * Select/unselect ingredient in ingredient category dialog
   */
  selectedIngredient: Boolean = false;

  /**
   * Used to store selected ingredients from ingredient category
   */
  selectedIngredients: any = [];
  /**
   * Button used to create/update ingredient category
   */
  btntext = 'Create new ingredient category';

  constructor(public dialogRef: MatDialogRef<IngredientCategoryComponent>,private formBuilder: FormBuilder,
    public userservice: UserService,public adminservice: AdminService, public util: UtilService, @Inject(MAT_DIALOG_DATA) public data: any) { }
/**
   * Executes when dialog loads.
   *
   * @memberof IngredientCategoryComponent
   */
  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAdminIngredientCategories();
    this.ingredientCat = this.formBuilder.group({
      name: ['', Validators.required],
      selectedCat: '',
      photo_name:'',
      photo_url: ['', Validators.required],
      photo_file:'',
      ingredients:[this.selectedIngredients],
      user_id: currentUser.user._id,
      _id: ''
    });
    if (this.data) {
      this.btntext = 'Update ingredient category';
      this.ingredientCat.patchValue(this.data);
      this.ingredientCat.get('selectedCat').setValue(this.data.company_id);
      // this.getIngredientCategoryItems(this.data.company_id);
    }
  }

  public get f() { return this.ingredientCat.controls; }

  /**
   * No button action of alert dialog
   *
   * @memberof IngredientCategoryComponent
   */
  close() {
    this.dialogRef.close('No');
  }

    /**
* Remove leading and traling spaces in input fields
*
* @param {*} string
* @returns
* @memberof IngredientCategoryComponent
*/
removeSpaces(string) {
  return string.replace(/^\s+|\s+$/g, '');
}

/**
   * To get all available list of ingredient categories.
   *
   * @memberof IngredientCategoryComponent
   */
  getAdminIngredientCategories() {
    this.ingredientloading = true;
    this.adminservice.getIngredientCategories().subscribe((res: any) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.ingredientloading = false;
          this.adminIngredientCat = res.data;
        } else {
          this.ingredientloading = false;
          // clear data if no ingredient category data found.
          this.adminIngredientCat = [];
        }
      } else {
        this.ingredientloading = false;
        this.util.showToast('Something went wrong');
      }
    });
  }

    /**
   * To get list of ingredient items of selected category(based on company id).
   *
   * @param {*} compid
   * @memberof IngredientCategoryComponent
   */
  loadIngredients() {
    this.ingredientloading = true;
    this.selectedIngredients = []; // clear previously selected ingredients
    let compid = this.ingredientCat.get('selectedCat').value;
    if(compid !==''){
      this.adminservice.getAllingredientCategoryitem(compid).subscribe((res: any) => {
        if (res.success) {
          this.ingredientloading = false;
          res.data.forEach(element => {
            element.selected = false;
          });
          this.loadedIngredients = res.data;
        } else {
          this.ingredientloading = false;
          this.util.showToast('Something went wrong');
        }
      });
    }
  }

  /**
   * Used to get selected ingredients to add in a category
   */
  getSelectedIngredients(item) {
    if(item.selected == false) {
      item.selected = true;
      // this.selectedIngredients.push(item._id);
      this.selectedIngredients.push(item);
    } else {
      item.selected = false;
      // this.selectedIngredients.pop(item._id);
      this.selectedIngredients.pop(item);
    }
  }
   /**
   * Executes when user clicks on image to select a picture form resource.
   *
   * @param {*} event
   * @memberof IngredientCategoryComponent
   */
  onFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      let files: any = Array.from(event.target.files);
      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          // console.log(image);
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            this.ingredientCat.patchValue({
              photo_url: image.imageDataUrl,
              photo_file: file
            });
            if (this.ingredientCat.get('photo_name').value !== '') {
                this.userservice.deletePhoto(this.ingredientCat.get('photo_name').value).subscribe((res: any) => {
                if (res.success) {
                  this.ingredientCat.get('photo_name').setValue('');
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
   * Used to created new ingredient category with selected ingredients.
   */
  createIngredientCategory() {
    this.ingredientCat.get('ingredients').setValue(this.selectedIngredients);
    // console.log('Form : ', this.ingredientCat.value);
    this.dialogRef.close(this.ingredientCat.value);
  }

  /**
   * To get list of ingredient items of selected category(based on company id).
   *
   * @param {*} compid
   * @memberof HomeComponent
   */
  // getIngredientCategoryItems(compid) {
  //   this.ingredientloading = true;
  //   this.adminservice.getAllingredientCategoryitem(compid).subscribe((res: any) => {
  //     if (res.success) {
  //       this.ingredientloading = false;
  //       res.data.forEach(element => {
  //         element.selected = false;
  //       });
  //       this.loadedIngredients = res.data;
  //       this.selectedIngredient = res.data;
  //     } else {
  //       this.ingredientloading = false;
  //       this.util.showToast('Something went wrong');
  //     }
  //   });
  // }

  /**
   * Executes when user clicks on import button to import items from categories
   */
  importIngredientItems(){
    if(this.adminIngredientCat.length>0) {
      this.importItems = true;
    } else {
      this.util.showToast('No categories avalable to import.');
    }

  }

  /**
   * Used to remove image from mongodb database
   * @param name 
   */
  removePhoto(name) {
    if (this.ingredientCat.get('photo_name').value !== '') {
      this.userservice.deletePhoto(this.ingredientCat.get('photo_name').value).subscribe((res: any) => {
      if (res.success) {
        this.ingredientCat.get('photo_name').setValue('');
        this.ingredientCat.get('photo_url').setValue('');
        this.ingredientCat.get('photo_file').setValue('');
      }
     });
    } else {
      this.ingredientCat.get('photo_name').setValue('');
      this.ingredientCat.get('photo_url').setValue('');
      this.ingredientCat.get('photo_file').setValue('');
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
