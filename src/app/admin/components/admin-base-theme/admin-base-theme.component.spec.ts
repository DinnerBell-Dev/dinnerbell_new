import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBaseThemeComponent } from './admin-base-theme.component';

describe('AdminBaseThemeComponent', () => {
  let component: AdminBaseThemeComponent;
  let fixture: ComponentFixture<AdminBaseThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBaseThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBaseThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
