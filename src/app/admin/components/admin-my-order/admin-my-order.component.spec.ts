import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMyOrderComponent } from './admin-my-order.component';

describe('AdminMyOrderComponent', () => {
  let component: AdminMyOrderComponent;
  let fixture: ComponentFixture<AdminMyOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMyOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
