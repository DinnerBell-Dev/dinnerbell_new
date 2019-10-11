import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuDialogComponent } from './add-menu-dialog.component';

describe('AddMenuDialogComponent', () => {
  let component: AddMenuDialogComponent;
  let fixture: ComponentFixture<AddMenuDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMenuDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMenuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
