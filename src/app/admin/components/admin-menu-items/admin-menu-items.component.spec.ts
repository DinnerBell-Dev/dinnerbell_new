import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuItemsComponent } from './admin-menu-items.component';

describe('AdminMenuItemsComponent', () => {
  let component: AdminMenuItemsComponent;
  let fixture: ComponentFixture<AdminMenuItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMenuItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
