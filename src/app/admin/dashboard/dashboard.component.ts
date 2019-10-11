import { AddMenuItemDialogComponent } from './../dialogs/add-menu-item-dialog/add-menu-item-dialog.component';
import { AddMenuDialogComponent } from './../dialogs/add-menu-dialog/add-menu-dialog.component';
import { IngredientItemDialogComponent } from './../dialogs/ingredient-item-dialog/ingredient-item-dialog.component';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { UtilService } from '../../services/util.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ProfileDialogComponent } from '../dialogs/profile-dialog/profile-dialog.component';
import { AddIngredientCategoryComponent } from '../dialogs/add-ingredient-category/add-ingredient-category.component';
import { FeedbackDialogComponent } from '../dialogs/feedback-dialog/feedback-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddThemesComponent } from '../dialogs/add-themes/add-themes.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentUser;

  /**
   * Used to store all registred user's data
   *
   * @memberof DashboardComponent
   */
  users: any = '';
  /**
   * Used to store selected user's data.
   */
  selecteduser: any = '';
  /**
   * Used to update selected user's data
   *
   * @type {FormGroup}
   * @memberof DashboardComponent
   */
  updateForm: FormGroup;
  /**
   * Actions specified in update dialog box
   *
   * @memberof DashboardComponent
   */
  actions;

  /**
   * To show/hide list view
   *
   * @type {Boolean}
   * @memberof DashboardComponent
   */
  listview: Boolean = false;

  /**
   * Used to switch account setting tab
   *
   * @memberof DashboardComponent
   */
  accountSettingTab = 'companyprofile';

  /**
   * Used to store ingredient categories's data.
   */
  ingredientCategories;
  /**
   * Used to store selected category data
   *
   * @memberof DashboardComponent
   */

  /**
   * List Of Themes
   */
  themeList;

  selectedIngredientCategory;
  /**
   *Used to store selected category ingredient items.
   *
   * @memberof DashboardComponent
   */
  selectedIngredientCategoryItems;

  /**
   * Used to show loading indicator at diffrent pages
   *
   * @type {Boolean}
   * @memberof DashboardComponent
   */
  userloading: Boolean = false;
  ingredientloading: Boolean = false;
  menuloading: Boolean = false;
  settingsloading: Boolean = false;
  wasClicked = false;
  selectedTheme: boolean = false;
  haveThemes: boolean = false;
  addnewTheme: boolean = false;
  ActiveTheme: boolean = false;

  /**
   * Used to show/hide draggable handle.
   *
   * @type {Boolean}
   * @memberof DashboardComponent
   */
  drag: Boolean = false;
  menuDesignSettings = "Base theme";

  constructor(public adminservice: AdminService, public util: UtilService, private formBuilder: FormBuilder,
    public dialog: MatDialog, private router: Router,
    private authservice: AuthService) {
  }

  /**
   * Executes when dashboard page loads.
   *
   * @memberof DashboardComponent
   */
  ngOnInit() {
     localStorage.removeItem('theme');
    // if (haveTheme) {
    //   this.selectedTheme = true;
    // }
    this.authservice.menuToggle.subscribe((data: any) => {
      this.wasClicked = !this.wasClicked;
    });
    this.adminservice.removeNewTheme.subscribe((data: any) => {
      localStorage.removeItem('newTheme');
      this.addnewTheme  = false;
      this.haveThemes = false;
      this.ActiveTheme = false;
    });

    this.adminservice.haveTheme.subscribe((data: any) => {
      if(data == 'true'){
        this.haveThemes = true;
      }
      if(data == 'false'){
        this.haveThemes = false;
      }
    });

    this.adminservice.deleteThemes.subscribe((data: any) => {
      this.addnewTheme  = false;
      this.haveThemes = false;
      this.ActiveTheme = false;
      this.menuDesignSettings = "Base theme";

    });
    this.adminservice.themeCustomize.subscribe((data: any) => {
      this.addnewTheme  = false;
      this.menuDesignSettings = "Base settings";
      this.selectedTheme = true;
      this.ActiveTheme = true;
    });

    this.adminservice.addNewTheme.subscribe((data: any) => {
      localStorage.setItem('newTheme', 'true');
      this.addnewTheme  = true; 
      this.menuDesignSettings = "Base settings";
      this.selectedTheme = true;
      this.ActiveTheme = true;
    });

    this.currentUser = JSON.parse(localStorage.getItem('adminUser'));
    // this.selectedTheme = localStorage.getItem('theme');

    this.loadData();
    this.getIngredientCategories();
    this.getThemsList();
    this.updateForm = this.formBuilder.group({
      action: ['', Validators.required]
    });
  }

  onClick(data) {
    this.authservice.toggleMenusClose();
    this.authservice.getHeaderTitle(data);
    this.authservice.getViewIcon('false');
    this.menuDesignSettings = "Base theme";
    localStorage.removeItem('newTheme');
    localStorage.removeItem('theme');
  }

  /**
   * Use admin service to list all registered users in app.
   *
   * @memberof DashboardComponent
   */
  loadData() {
    this.userloading = true;
    this.adminservice.getAllUsers().subscribe((res: any) => {
      if (res) {
        this.userloading = false;
        this.users = res;
      } else {
        this.userloading = false;
        this.util.showToast('Something went wrong');
      }

    });
  }

  /**
   * To open profile dialog with selected user's data
   *
   * @param {*} user
   * @memberof DashboardComponent
   */
  openProfileDialog(user) {
    const dialogRef = this.dialog.open(ProfileDialogComponent, { data: user });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.loadData();
      }
    });
  }

  /**
   * To open add ingredient category dialog.
   *
   * @param {*} user
   * @memberof DashboardComponent
   */
  openAddIngredientCatDialog() {
    const dialogRef = this.dialog.open(AddIngredientCategoryComponent);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result) {
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          this.ingredientloading = true;
          this.adminservice.uploadPhoto(input).subscribe((res: any) => {
            this.ingredientloading = false;
            if (res.success) {
              result.photo_url = res.url;
              result.photo_name = res.photo_name;
              this.addIngredientCategory(result);
            }
          });
        } else {
          this.addIngredientCategory(result);
        }
      }
    });
  }

  /**
 * Used to add ingredient category
 * @param result 
 */
  addIngredientCategory(result) {
    this.ingredientloading = true;
    this.adminservice.addIngredientCategory(result).subscribe((res: any) => {
      this.ingredientloading = false;
      if (res) {
        this.getIngredientCategories();
      }
    });
  }


  /**
 * To get all available list of ingredient categories.
 *
 * @memberof DashboardComponent
 */
  getThemsList() {
    this.ingredientloading = true;
    this.adminservice.getThemesList().subscribe((res: any) => {

      if (res.success) {
        if (res.data.length > 0) {
          this.ingredientloading = false;
          this.themeList = res.data;
          // console.log(this.themeList);
        } else {
          this.ingredientloading = false;
          // clear data if no ingredient category data found.
          this.themeList = [];
        }
      } else {
        this.ingredientloading = false;
        this.util.showToast('Something went wrong');
      }
    });
  }

  // openAddthemeDialog() {
  //   const dialogRef = this.dialog.open(AddThemesComponent);
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       if (result.photo_file !== '') {
  //         let input = new FormData();
  //         input.append('file', result.photo_file);
  //         this.ingredientloading = true;
  //         this.adminservice.uploadPhoto(input).subscribe((res: any) => {
  //           this.ingredientloading = false;
  //           if (res.success) {
  //             result.photo_url = res.url;
  //             result.photo_name = res.photo_name;
  //             this.addBaseTheme(result);
  //           }
  //         });
  //       } else {
  //         this.addBaseTheme(result);
  //       }
  //     }
  //   });
  // }

  /**
   * Used to add ingredient category
   * @param result 
   */
  // addBaseTheme(result) {
  //   this.ingredientloading = true;
  //   this.adminservice.addBaseTheme(result).subscribe((res: any) => {
  //     this.ingredientloading = false;
  //     if (res) {
  //       this.getThemsList();
  //     }
  //   });
  // }

  /**
  * To open ingredient category item dialog.
  *
  * @param {*} user
  * @memberof DashboardComponent
  */
  openIngredientCatItemDialog(cat) {
    if (cat === undefined || cat.length === 0) {
      this.util.showToast('Please add category first.');
    } else {
      const data = { company_id: cat.company_id, category_id: cat._id };
      const dialogRef = this.dialog.open(IngredientItemDialogComponent, { data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.photo_file !== '') {
            let input = new FormData();
            input.append('file', result.photo_file);
            this.ingredientloading = true;
            this.adminservice.uploadPhoto(input).subscribe((res: any) => {
              this.ingredientloading = false;
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
  * To open add menu dialog.
  *
  * @param {*} user
  * @memberof DashboardComponent
  */
  openAddMenuDialog() {
    const dialogRef = this.dialog.open(AddMenuDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {

      }
    });
  }

  /**
   * To open add menu item dialog.
   *
   * @param {*} user
   * @memberof DashboardComponent
   */
  openAddMenuItemDialog() {
    const dialogRef = this.dialog.open(AddMenuItemDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {

      }
    });
  }


  /**
   * Executes when admin clicks on logout button.
   */
  logout() {
    localStorage.clear();
    this.router.navigate(['/admin/signin']);
  }

  /**
   * Used to set active tab of account setting page
   *
   * @param {*} val
   * @memberof DashboardComponent
   */
  setTab(val) {
    this.accountSettingTab = val;
  }

  /**
   * To get all available list of ingredient categories.
   *
   * @memberof DashboardComponent
   */
  getIngredientCategories() {
    this.ingredientloading = true;
    this.adminservice.getIngredientCategories().subscribe((res: any) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.ingredientloading = false;
          this.ingredientCategories = res.data;
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
   * To get list of ingredient items of selected category(based on company id).
   *
   * @param {*} compid
   * @memberof DashboardComponent
   */
  getIngredientCategoryItems(compid) {
    this.ingredientloading = true;
    this.adminservice.getAllingredientCategoryitem(compid).subscribe((res: any) => {
      if (res.success) {
        this.ingredientloading = false;
        this.selectedIngredientCategoryItems = res.data;
        // console.log('Data ingredients Items', res);
      } else {
        this.ingredientloading = false;
        this.util.showToast('Something went wrong');
      }
    });
  }

  /**
   * To delete selected category based on category_id.
   *
   * @param {*} id
   * @memberof DashboardComponent
   */
  deletecat(id) {
    this.openFeedbackDialog(id);
  }

  /**
   * To update selected category.
   *
   * @param {*} cat
   * @memberof DashboardComponent
   */
  editCat(cat) {
    const dialogRef = this.dialog.open(AddIngredientCategoryComponent, { data: cat });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          this.ingredientloading = true;
          this.adminservice.uploadPhoto(input).subscribe((res: any) => {
            this.ingredientloading = false;
            if (res.success) {
              result.photo_url = res.url;
              result.photo_name = res.photo_name;
              this.updateIngredientCategory(result._id, result, cat);
            }
          });
        } else {
          this.updateIngredientCategory(result._id, result, cat);
        }
      }
    });
  }

  /**
   * Used to update ingredient category
   * @param _id 
   * @param result 
   * @param cat 
   */
  updateIngredientCategory(_id, result, cat) {
    this.ingredientloading = true;
    this.adminservice.updateIngredientCategory(_id, result).subscribe((result: any) => {
      this.ingredientloading = false;
      if (result) {
        this.adminservice.getIngredientCategories().subscribe((res: any) => {
          if (res.success) {
            if (res.data.length > 0) {
              this.ingredientloading = false;
              this.ingredientCategories = res.data;
              if (this.ingredientCategories.length > 0) {
                this.ingredientCategories.forEach(element => {
                  if (element.company_id == cat.company_id) {
                    this.selectedcat(element);
                  }
                });
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
   * Executes when user clicks on duplicate menu of ingredient category.
   *
   * @param {*} category
   * @memberof DashboardComponent
   */
  duplicateCat(category) {
    // console.log('Duplicate click', category);
    this.ingredientloading = true;
    const data = { name: category.name, photo_url: category.photo_url };
    this.adminservice.addIngredientCategory(data).subscribe((res: any) => {
      if (res.success) {
        this.ingredientloading = false;
        this.getIngredientCategories();
      } else {
        this.ingredientloading = false;
      }
    });
  }

  /**
   *used to get selected category ingredient items
   *
   * @param {*} category
   * @memberof DashboardComponent
   */
  selectedcat(category) {
    if (this.selectedIngredientCategory !== category) {
      this.selectedIngredientCategory = category;
      // console.log(category);
      if (this.selectedIngredientCategory) {
        this.getIngredientCategoryItems(category.company_id);
      }
    }
  }


  /**
   * Executes when user clicks on move menu of ingredient category.
   *
   * @memberof DashboardComponent
   */
  moveCat() {
    // console.log('move');
    this.drag = true;
  }

  /**
   * Used to open feedback dialog when admin tries to remove selected category
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
            this.getIngredientCategories();
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
   * Executes when ingredient category dropped after dragging.
   */
  drop(event: CdkDragDrop<string[]>) {
    this.drag = false;
    moveItemInArray(this.ingredientCategories, event.previousIndex, event.currentIndex);
  }

  /**
   * Used to edit category ingredient item
   * @param item 
   */
  editCatItem(item) {
    const dialogRef = this.dialog.open(IngredientItemDialogComponent, { data: item });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.photo_file !== '') {
          let input = new FormData();
          input.append('file', result.photo_file);
          this.ingredientloading = true;
          this.adminservice.uploadPhoto(input).subscribe((res: any) => {
            this.ingredientloading = false;
            if (res.success) {
              result.photo_url = res.url;
              result.photo_name = res.photo_name;
              this.updateIngredientCatItem(result.category_id, result);
            }
          });
        } else {
          this.updateIngredientCatItem(result.category_id, result);
        }
      }
    });
  }

  /**
   * Used to update ingredient category item
   * @param category_id 
   * @param result 
   */
  updateIngredientCatItem(category_id, result) {
    this.ingredientloading = true;
    this.adminservice.updateIngredientCategoryItem(category_id, result).subscribe((res: any) => {
      this.ingredientloading = false;
      if (res.ingredient) {
        this.getIngredientCategoryItems(res.ingredient.company_id);
      }
    });
  }

  /**
   * Used to delete category item based on id
   * @param id 
   */
  deleteCatItem(item) {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.adminservice.deleteCategoryItem(item._id).subscribe((res: any) => {
          if (res.message) {
            this.util.showToast(res.message);
            this.getIngredientCategoryItems(item.company_id);
          } else {
            this.util.showToast('Something went wrong');
          }
        });
        dialogRef.close('Yes');
      }
    });
  }

}
