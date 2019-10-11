import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';
import { ImageCompressService } from 'ng2-image-compress';
import { FeedbackDialogComponent } from 'src/app/admin/dialogs/feedback-dialog/feedback-dialog.component';

@Component({
  selector: 'app-menu-item-dialog',
  templateUrl: './menu-item-dialog.component.html',
  styleUrls: ['./menu-item-dialog.component.scss']
})
export class MenuItemDialogComponent implements OnInit {

  /**
   *Used to save ingredient title temporary
   *
   * @memberof MenuItemDialogComponent
   */
  saveIngredientTitle;
  /**
   * Used to store new category item information.
   *
   * @type {FormGroup}
   * @memberof MenuDialogComponent
   */
  menuItemForm: FormGroup;

  /**
   * Used to store ingredint category added by user
   */
  userIngredientCat: any = [];

  /**
   * Used to store questions temporarily
   */
  menuItemQues: any = [];

  /**
   * Used to store option value for menu subsection/course
   */
  section_course: any = [];

  /**
   * Used to temporary store size and prize value
   */
  addSizePrize: any = [];

  /**
   *Temporary stores menus value
   *
   * @type {*}
   * @memberof MenuItemDialogComponent
   */
  addMenus: any = [];
  /**
   * Used to show/hide loading
   */
  menuloading: Boolean = false;

  /**
   * Used to store selected ingredients value temporarily
   */
  selectedIngredients: any = [];
  /**
   *Used to store final craeted ingredients
   *
   * @type {*}
   * @memberof MenuItemDialogComponent
   */
  ingredientsArray: any = [];
  /**
   * Used to store labels data
   */
  labels: any = [];
  /**
   *Used to set menu name based on menu type
   *
   * @memberof MenuItemDialogComponent
   */
  menuName;

  /**
   *Used to get selected user category item
   *
   * @memberof MenuItemDialogComponent
   */
  selectedUserCatItem;
  /**
   * Used to temporary store the category ids
   */
  tempArray: any = [];
  /**
   *Used to store old data temporary in case of cancel editing ingredients
   *
   * @type {*}
   * @memberof MenuItemDialogComponent
   */
  oldData:any=[];
  /**
   * Used to show ingredients while creating ingedient category
   */
  catIngredientsToShow: any = [];
  /**
   * Used to show /hide update layout  for ingredients section
   */
  updateIngredient: Boolean = false;
  /**
   * Used to show /hide create layout  for ingredients section
   */
  createCategory: Boolean = false;
  /**
   * Used to show /hide update layout  for ingredient title section
   */
  updateIngredientTitle: Boolean = false;

  /**
   *Used to set the btn text of menu item dialog
   *
   * @memberof MenuItemDialogComponent
   */
  btnText = 'Add new item';

  /**
   *Used to set modifiers title
   *
   * @type {*}
   * @memberof MenuItemDialogComponent
   */
  modifiers: any = ['Spice options', 'Personal preferences', 'Ingredients'];
  /**
   * Used to show/hide spice option modifier
   */
  spiceoptions: Boolean = false;
  /**
   *Used to show/hide personnel preferences modifier
   *
   * @type {Boolean}
   * @memberof MenuItemDialogComponent
   */
  personnelpref: Boolean = false;
  /**
   *Used to show/hide ingredients modifier
   *
   * @type {Boolean}
   * @memberof MenuItemDialogComponent
   */
  showIngredients: Boolean = false;
  /**
   * Used to store menu item data;
   */
  menuItem: any = '';
  // spiceOptionsArray: any = ['Extra Spicy','Hot','Medium','Mild','Not Hot'];
  /**
   * Used to set spice option values
   */
  spiceOptionsArray: any = [];
  /**
   *Used to get selected ingredients on edit 
   *
   * @type {*}
   * @memberof MenuItemDialogComponent
   */
  editIngredientsArray: any = [];
  /**
   * Used to store current user data
   */
  currentUser;

  /**
   *Used to set quantity value for ingredients
   *
   * @type {Number}
   * @memberof MenuItemDialogComponent
   */
  maxIngredientQty: Number = 1;


  constructor(public dialogRef: MatDialogRef<MenuItemDialogComponent>, private formBuilder: FormBuilder,
    public util: UtilService, public adminservice: AdminService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, public userservice: UserService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getUserIngredientCategories();
    this.getLabels();
    this.menuItemForm = this.formBuilder.group({
      name: ['', Validators.required],
      user_id: this.currentUser.user._id,
      menu_id: this.data._id,
      photo_urls: [''],
      photo_name:'',
      photo_file:'',
      description: ['', Validators.required],
      status: ['true', Validators.required],
      label: ['', Validators.required],
      item_type: '',
      menu_type: this.data.menu_type,
      portion_size: [''],
      weight: [''],
      calories: [''],
      price: [''],
      section: '',
      spice_options: [this.spiceOptionsArray],
      question: '',
      questions: [this.menuItemQues],
      ingredients: [this.selectedIngredients],
      ingredientCustomTitle: '',
      size_prize: [this.addSizePrize],
      menus: [this.addMenus],
      selectedCategory: [],
      modifier: '',
      ingredientItemTitle: '',
      editingredientItemTitle:''
    });

    this.setSpiceOptions();

    if (this.data.menu_type === 'Regular menu') {
      this.menuName = 'Subsections';
      this.section_course = this.data.subsection;
    } else {
      this.section_course = this.data.course;
      this.menuName = 'Courses';
    }
    if (!this.data.menu_id) {
      this.btnText = 'Add new item';
    } else {
      this.btnText = 'Update item';
      this.setSubsectionsCourses(this.data.menu_id);
      this.getMenuItem(this.data._id);
    }

  }
  


/**
 *Used to set values for subsections/courses
 *
 * @param {*} menuid
 * @memberof MenuItemDialogComponent
 */
setSubsectionsCourses(menuid) {
    this.menuloading = true;
    this.userservice.getMenu(menuid).subscribe((res: any) => {
      this.menuloading = false;
      if (res.length !== 0) {
        let result = res.data[0];
        if (result.menu_type === 'Regular menu') {
          this.menuName = 'Subsections';
          this.section_course = result.subsection;
        } else {
          this.section_course = result.course;
          this.menuName = 'Courses';
        }
      }
    })
  }

  /**
   *Used to set spice options values based on number of spice options
   *
   * @memberof MenuItemDialogComponent
   */
  setSpiceOptions() {
    this.menuloading = true;
    this.userservice.getMenuCustomization(this.currentUser.user._id).subscribe((res: any) => {
      this.menuloading = false;
      if (res.data.length !== 0) {
        this.maxIngredientQty = res.data[0].ingredient_quantity;
        if (res.data[0].spice_number_options == 3) {
          this.spiceOptionsArray = ['Extra Spicy', 'Hot', 'Medium'];
        } else {
          this.spiceOptionsArray = ['Extra Spicy', 'Hot', 'Medium', 'Mild', 'Not Hot'];
        }
      }
    });
  }

  /**
   * Used to get all labels available
   */
  getLabels() {
    this.userservice.getAllLabels().subscribe((res: any) => {
      if (res) {
        this.labels = res.data;
      }
    });
  }

  public get f() { return this.menuItemForm.controls; }

  /**
   * No button action of alert dialog
   *
   * @memberof MenuItemDialogComponent
   */
  close() {
    this.dialogRef.close('No');
  }

  /**
* Remove leading and traling spaces in input fields
*
* @param {*} string
* @returns
* @memberof MenuItemDialogComponent
*/
  removeSpaces(string) {
    return string.replace(/^\s+|\s+$/g, '');
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
          this.urltoFile(image.imageObjectUrl, Date.now().toString(), 'image/jpg').then(file => {
            this.menuItemForm.patchValue({
              photo_urls: image.imageDataUrl,
              photo_file: file
            });
            if (this.menuItemForm.get('photo_name').value !== '') {
                this.menuloading = true;
                this.userservice.deletePhoto(this.menuItemForm.get('photo_name').value).subscribe((res: any) => {
                this.menuloading = false;
                if (res.success) {
                  this.menuItemForm.get('photo_name').setValue('');
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
   * Used to add menu item
   */
  addMenuItem() {
    this.dialogRef.close(this.menuItemForm.value);
  }
  /**
   * Used to add Question
   */
  addQuestion() {
    this.menuItemQues.push(this.menuItemForm.get('question').value);
    this.menuItemForm.get('questions').setValue(this.menuItemQues);
    this.f.question.setValue('');
  }

  /**
   * Used to remove question
   */
  removeQuestion(item) {
    this.removeItem(this.menuItemQues, item);
    this.menuItemForm.get('questions').setValue(this.menuItemQues);
  }

  /**
   * Used to remove item from array by value
   * @param array
   * @param item
   */
  removeItem(array, item) {
    for (var i in array) {
      if (array[i] === item) {
        array.splice(i, 1);
        break;
      }
    }
  }

  /**
   *To clear form array/spice options
   *
   * @memberof MenuItemDialogComponent
   */
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  /**
   * Used to get selected ingredients from used ingredients
   */
  getSelectedIngredients(item) {
    if (item.selected == false) {
      item.selected = true;
      item.draft = true;
      delete item.company_id;
    } else {
      item.selected = false;
      item.draft = false;
    }
  }

  /**
   * Used to add size_price value
   */
  addSizePrice() {
    this.addSizePrize.push({
      portion_size: this.f.portion_size.value,
      weight: this.f.weight.value,
      calories: this.f.calories.value,
      price: this.f.price.value,
      default: false,
      defaultname: 'Make default'
    });
    this.menuItemForm.get('size_prize').setValue(this.addSizePrize);
    this.menuItemForm.get('portion_size').setValue('');
    this.menuItemForm.get('weight').setValue('');
    this.menuItemForm.get('calories').setValue('');
    this.menuItemForm.get('price').setValue('');
    this.menuItemForm.get('portion_size').markAsUntouched();
    this.menuItemForm.get('price').markAsUntouched();
  }

  /**
  * Used to remove Size and Price value
  */
  removeSizePrice(item) {
    this.removeItem(this.addSizePrize, item);
    this.menuItemForm.get('size_prize').setValue(this.addSizePrize);
  }

  /**
   * Used to add menus value
   */
  addMenuValues() {
    this.addMenus.push({
      section: this.f.section.value,
    });
    this.menuItemForm.get('menus').setValue(this.addMenus);
  }

  /**
   * Used to remove menus value
   */
  removeMenus(item) {
    this.removeItem(this.addMenus, item);
    this.menuItemForm.get('menus').setValue(this.addMenus);
  }

  /**
   * To get all available list of ingredient categories.
   *
   * @memberof IngredientCategoryComponent
   */
  getUserIngredientCategories() {
    this.menuloading = true;
    this.userservice.getIngredientCategories(this.currentUser.user._id).subscribe((res: any) => {
      this.menuloading = false;
      if (res.success) {
        // console.log(res.data);
        if (res.data.length > 0) {
          this.userIngredientCat = res.data;
        } else {
          this.userIngredientCat = [];
        }
      } else {
        this.util.showToast('Something went wrong');
      }
    });
  }

  /**
  * To get list of ingredient items of selected category(based on company id).
  *
  * @param {*} company_id
  * @memberof IngredientCategoryComponent
  */
  loadIngredients(comp) {

    var a = this.tempArray.indexOf(this.selectedUserCatItem.company_id);
    if (a == -1) {
      if (this.selectedUserCatItem.company_id != '') {
        this.menuloading = true;
        this.adminservice.getAllingredientCategoryitem(this.selectedUserCatItem.company_id).subscribe((res: any) => {
          this.menuloading = false;
          if (res.success) {
            res.data.forEach(element => {
              element.selected = false;
              if (this.maxIngredientQty !== 0) {
                element.quantity = this.maxIngredientQty;
              }
            });
            this.tempArray.push(this.selectedUserCatItem.company_id);
            let data = {
              company_id: this.selectedUserCatItem.company_id,
              categoryName: this.selectedUserCatItem.name,
              data: res.data
            }
            this.catIngredientsToShow.push(data);
          } else {
            this.menuloading = false;
          }
        });
      }
    }

  }

  /**
   * Used to add modifier
   */
  addModifier() {
    if (this.menuItemForm.get('modifier').value === 'Spice options') {
      this.spiceoptions = true;
      this.menuItemForm.get('modifier').setValue('');
      this.removeItem(this.modifiers, 'Spice options');
      if (this.menuItemForm.get('spice_options').value.length == 0) {
        this.menuloading = true;
        this.userservice.getMenuCustomization(this.currentUser.user._id).subscribe((res: any) => {
          this.menuloading = false;
          if (res.data.length !== 0) {
            this.maxIngredientQty = res.data[0].ingredient_quantity;
            if (res.data[0].spice_number_options == 3) {
              this.spiceOptionsArray = ['Extra Spicy', 'Hot', 'Medium'];
              this.menuItemForm.get('spice_options').setValue(this.spiceOptionsArray);
            } else {
              this.spiceOptionsArray = ['Extra Spicy', 'Hot', 'Medium', 'Mild', 'Not Hot'];
              this.menuItemForm.get('spice_options').setValue(this.spiceOptionsArray);
            }
          }
        });
      }
      this.menuItemForm.get('spice_options').setValue(this.spiceOptionsArray);
    }
    if (this.menuItemForm.get('modifier').value === 'Personal preferences') {
      this.personnelpref = true;
      this.menuItemForm.get('modifier').setValue('');
      this.removeItem(this.modifiers, 'Personal preferences');
    }
    if (this.menuItemForm.get('modifier').value === 'Ingredients') {
      this.showIngredients = true;
      this.menuItemForm.get('modifier').setValue('');
      this.removeItem(this.modifiers, 'Ingredients');
    }
  }

  /**
   *Used to save ingredients
   *
   * @memberof MenuItemDialogComponent
   */
  saveEssantials() {
    this.selectedIngredients = [];
    for (let i = 0; i < this.catIngredientsToShow.length; i++) {
      let ingredients =[];
      for (let j = 0; j < this.catIngredientsToShow[i].data.length; j++) {
        if(this.catIngredientsToShow[i].data[j].selected){
          ingredients.push(this.catIngredientsToShow[i].data[j]);
        }
      }
      if(ingredients.length !== 0){
        let item = { company_id: this.catIngredientsToShow[i].company_id,
          categoryName: this.catIngredientsToShow[i].categoryName,
          data: ingredients}
        this.selectedIngredients.push(item);
      }
    }
    this.tempArray = [];
    this.ingredientsArray.push({
      custumTitle: this.menuItemForm.get('ingredientCustomTitle').value,
      ingredients: this.selectedIngredients, update: false
    });
    this.menuItemForm.get('ingredients').setValue(this.ingredientsArray);
    this.menuItemForm.get('ingredientCustomTitle').setValue('');
    this.menuItemForm.get('ingredientCustomTitle').markAsUntouched();
    this.menuItemForm.get('selectedCategory').setValue('');
    this.selectedIngredients = [];
    this.createCategory = false;
    this.catIngredientsToShow = [];

  }

  /**
   *Used to remove modifier
   *
   * @param {*} modifier
   * @memberof MenuItemDialogComponent
   */
  remove(modifier) {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        if (modifier === 'Spice options') {
          this.spiceoptions = false;
          if (this.modifiers.indexOf('Spice options') == -1) {
            this.modifiers.push('Spice options');
          }
          this.spiceOptionsArray = [];
          this.menuItemForm.get('spice_options').setValue(this.spiceOptionsArray);
        }
        if (modifier === 'Personal preferences') {
          this.personnelpref = false;
          this.menuItemQues = [];
          this.menuItemForm.get('questions').setValue(this.menuItemQues);
          if (this.modifiers.indexOf('Personal preferences') == -1) {
            this.modifiers.push('Personal preferences');
          }
        }
        if (modifier === 'Ingredients') {
          this.showIngredients = false;
          this.selectedIngredients = [];
          this.ingredientsArray = [];
          this.tempArray = [];
          this.catIngredientsToShow = [];
          this.menuItemForm.get('selectedCategory').setValue('');
          this.menuItemForm.get('ingredientCustomTitle').setValue('');
          this.menuItemForm.get('ingredientCustomTitle').markAsUntouched();
          this.createCategory = false;
          this.menuItemForm.get('ingredients').setValue(this.selectedIngredients);
          if (this.modifiers.indexOf('Ingredients') == -1) {
            this.modifiers.push('Ingredients');
          }
        }
      }
    });
  }

  /**
   * Used to get menu item based on id
   */
  getMenuItem(id) {
    this.menuloading = true;
    this.userservice.getMenuItem(id).subscribe((res: any) => {
      this.menuloading = false;
      if (res.success) {
        this.menuItem = res.data[0];
        this.menuItemForm.patchValue(this.menuItem);
        this.addSizePrize = this.menuItem.size_prize;
        this.addMenus = this.menuItem.menus;
        this.menuItemQues = this.menuItem.questions;
        this.menuItemForm.get('status').setValue(String(this.menuItem.status));
        if (this.menuItemQues.length !== 0) {
          this.personnelpref = true;
        }
        if (this.menuItem.ingredients.length !== 0) {
          this.showIngredients = true;
          this.ingredientsArray = this.menuItem.ingredients;
        }
        if (this.menuItem.spice_options.length !== 0) {
          this.spiceoptions = true;
          this.spiceOptionsArray = this.menuItem.spice_options;
        }
      }
    });
  }
  /**
   *Used to set size prize default
   *
   * @param {*} item
   * @memberof MenuItemDialogComponent
   */
  setSizePrizeDefault(item) {
    this.addSizePrize.forEach(element => {
      if (item == element) {
        element.default = true;
        element.defaultname = 'Default';
      } else {
        element.default = false;
        element.defaultname = 'Make default';
      }
    });
  }

  /**
   *Used to perform validation for number value
   *
   * @memberof MenuItemDialogComponent
   */
  priceChanged() {
    if (isNaN(this.menuItemForm.get('weight').value)) {
      this.menuItemForm.get('weight').setValue('');
    }
    if (isNaN(this.menuItemForm.get('calories').value)) {
      this.menuItemForm.get('calories').setValue('');
    }
    if (isNaN(this.menuItemForm.get('price').value)) {
      this.menuItemForm.get('price').setValue('');
    }
  }

  /**
   *Used to edit selected ingredient item
   *
   * @param {*} item
   * @memberof MenuItemDialogComponent
   */
  editIngredientItem(item) {
    
    this.editIngredientsArray = item;
    this.oldData = JSON.parse(JSON.stringify(item));
    item.update = true;
    this.updateIngredient = true;
    item.ingredients.forEach(element => {
      this.editIngredientsArray.ingredients= [];
      this.menuloading = true;
      this.adminservice.getAllingredientCategoryitem(element.company_id).subscribe((res: any) => {
        this.menuloading = false;
        if (res.success) {
          res.data.forEach(item => {
            element.data.forEach(item2 => {
              if(item._id == item2._id){
                item.selected = item2.selected;
              } else if(item.selected == undefined){
                item.selected = false;
              }
              if (this.maxIngredientQty !== 0) {
                item.quantity = this.maxIngredientQty;
              }
            });
          });
          let itemdetails ={categoryName:element.categoryName,company_id:element.company_id,data:res.data}
          this.editIngredientsArray.ingredients.push(itemdetails);
        }
      });
    });
  }
  /**
   *Used to remove selected ingredient item
   *
   * @param {*} item
   * @memberof MenuItemDialogComponent
   */
  removeIngredientItem(item) {
    this.removeItem(this.ingredientsArray, item);
    this.menuItemForm.get('ingredients').setValue(this.ingredientsArray);
  }
  /**
   *Used to cancel update of selected item
   *
   * @param {*} item
   * @memberof MenuItemDialogComponent
   */
  cancelIngredientUpdate(item) {
    item.ingredients = this.oldData.ingredients;
    item.update = false;
    this.updateIngredient = false;
  }
  
  /**
   *executes when update btn clicked
   *
   * @param {*} item
   * @memberof MenuItemDialogComponent
   */
  editIngredientupdate(item) {
    this.selectedIngredients =[];
    for (let i = 0; i < item.ingredients.length; i++) {
      let ingredients =[];
      for (let j = 0; j < item.ingredients[i].data.length; j++) {
        if(item.ingredients[i].data[j].selected){
          ingredients.push(item.ingredients[i].data[j]);
        }
      }
      if(ingredients.length !== 0){
        let itemdetails = { company_id: item.ingredients[i].company_id,
          categoryName: item.ingredients[i].categoryName,
          data: ingredients}
        this.selectedIngredients.push(itemdetails);
      }
     
    }
    item.ingredients = this.selectedIngredients;
    this.menuItemForm.get('ingredients').setValue(this.ingredientsArray);
    item.update = false;
    this.updateIngredient = false;
  }

  /**
   * To get list of ingredient items of in case of edit ingredient
   *
   * @param {*} company_id
   * @memberof IngredientCategoryComponent
   */
   loadEditIngredients(company_id) {
    let count =0;
    for (let index = 0; index < this.editIngredientsArray.ingredients.length; index++) {
      const element = this.editIngredientsArray.ingredients[index];
      if(element.company_id === company_id){
        count = count +1;
      }
    }
    if(count == 0){
      this.menuloading = true;
      this.adminservice.getAllingredientCategoryitem(company_id).subscribe((res: any) => {
        this.menuloading = false;
        if (res.success) {
          res.data.forEach(item => {
            if(item.selected == undefined){
              item.selected = false;
            }
            if (this.maxIngredientQty !== 0) {
              item.quantity = this.maxIngredientQty;
            }
          });
          let itemdetails = {categoryName:this.selectedUserCatItem.name,company_id:this.selectedUserCatItem.company_id,data:res.data}
          this.editIngredientsArray.ingredients.push(itemdetails);
        }
      });
    }
  }

  /**
   * Used to remove image from mongodb database
   * @param name 
   */
  removePhoto(name) {
    if (this.menuItemForm.get('photo_name').value !== '') {
      this.menuloading = true;
      this.userservice.deletePhoto(this.menuItemForm.get('photo_name').value).subscribe((res: any) => {
      this.menuloading = false;
      if (res.success) {
        this.menuItemForm.get('photo_name').setValue('');
        this.menuItemForm.get('photo_urls').setValue('');
        this.menuItemForm.get('photo_file').setValue('');
      }
     });
    } else {
      this.menuItemForm.get('photo_name').setValue('');
      this.menuItemForm.get('photo_urls').setValue('');
      this.menuItemForm.get('photo_file').setValue('');
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

  /**
   * Used to get selected user category item
   * @param value 
   */
  getCategoryData(value){
    this.selectedUserCatItem = value
  }

  /**
   *used to update ingredient title when edit
   *
   * @param {*} item
   * @memberof MenuItemDialogComponent
   */
  updateIngredientItemTitle(item){
    if(this.ingredientsArray.length !== 0){
      let data = this.ingredientsArray.map(function(e) 
      { return e.custumTitle; }).indexOf(this.menuItemForm.get('ingredientItemTitle').value);
      if(data !== -1){
        this.util.showToast('Title already taken.Try with new one.');
      } else {
        item.custumTitle = this.menuItemForm.get('ingredientItemTitle').value;
        this.updateIngredientTitle = false;
      }
    } else {
      this.updateIngredientTitle = false;
    }
  }

  /**
   *Used to create new ingredient category title
   *
   * @memberof MenuItemDialogComponent
   */
  createIngredientCategoryTitle(){
    if(this.ingredientsArray.length !== 0){
      let data = this.ingredientsArray.map(function(e) 
      { return e.custumTitle; }).indexOf(this.menuItemForm.get('ingredientCustomTitle').value);
      if(data !== -1){
        this.util.showToast('Title already taken.Try with new one.');
        this.createCategory = false;
      } else {
        this.createCategory = true;
      }
    } else {
      this.createCategory = true;
    }
  }

  /**
   *Used to edit ingredient category title on create new category
   *
   * @memberof MenuItemDialogComponent
   */
  editIngredientCategoryTitleOnCreate(){
    this.updateIngredientTitle = true;
    this.saveIngredientTitle = this.menuItemForm.get('ingredientCustomTitle').value;
    this.menuItemForm.get('editingredientItemTitle').setValue(this.menuItemForm.get('ingredientCustomTitle').value);
  }

  /**
   *Used to update ingredient category title when creating category
   *
   * @memberof MenuItemDialogComponent
   */
  updateIngredientCategoryTitleOnCreate(){
    this.menuItemForm.get('ingredientCustomTitle').setValue(this.menuItemForm.get('editingredientItemTitle').value);
    if(this.ingredientsArray.length !== 0){
      let data = this.ingredientsArray.map(function(e) 
      { return e.custumTitle; }).indexOf(this.menuItemForm.get('ingredientCustomTitle').value);
      if(data !== -1){
        this.util.showToast('Title already taken.Try with new one.');
        this.menuItemForm.get('ingredientCustomTitle').setValue(this.saveIngredientTitle);
      } else {
        this.saveIngredientTitle = '';
        this.updateIngredientTitle = false;
      }

    } else {
      this.updateIngredientTitle = false;
    }
  }

}