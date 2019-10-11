import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientItemDialogComponent } from './ingredient-item-dialog.component';

describe('IngredientItemDialogComponent', () => {
  let component: IngredientItemDialogComponent;
  let fixture: ComponentFixture<IngredientItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
