import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuItemDetailsComponent } from './admin-menu-item-details.component';

describe('AdminMenuItemDetailsComponent', () => {
  let component: AdminMenuItemDetailsComponent;
  let fixture: ComponentFixture<AdminMenuItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMenuItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
