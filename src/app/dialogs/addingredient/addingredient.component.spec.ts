import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingredientComponent } from './addingredient.component';

describe('AddingredientComponent', () => {
  let component: AddingredientComponent;
  let fixture: ComponentFixture<AddingredientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddingredientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
