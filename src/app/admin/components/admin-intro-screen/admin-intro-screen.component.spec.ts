import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIntroScreenComponent } from './admin-intro-screen.component';

describe('AdminIntroScreenComponent', () => {
  let component: AdminIntroScreenComponent;
  let fixture: ComponentFixture<AdminIntroScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminIntroScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminIntroScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
