import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThemesComponent } from './add-themes.component';

describe('AddThemesComponent', () => {
  let component: AddThemesComponent;
  let fixture: ComponentFixture<AddThemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddThemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
