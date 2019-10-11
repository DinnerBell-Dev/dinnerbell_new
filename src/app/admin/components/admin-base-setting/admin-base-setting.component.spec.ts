import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBaseSettingComponent } from './admin-base-setting.component';

describe('AdminBaseSettingComponent', () => {
  let component: AdminBaseSettingComponent;
  let fixture: ComponentFixture<AdminBaseSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBaseSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBaseSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
