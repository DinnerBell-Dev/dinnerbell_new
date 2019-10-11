import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemDetailsComponent } from './menu-item-details.component';

describe('MenuItemDetailsComponent', () => {
  let component: MenuItemDetailsComponent;
  let fixture: ComponentFixture<MenuItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
