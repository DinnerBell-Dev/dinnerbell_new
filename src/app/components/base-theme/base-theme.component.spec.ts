import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseThemeComponent } from './base-theme.component';

describe('BaseThemeComponent', () => {
  let component: BaseThemeComponent;
  let fixture: ComponentFixture<BaseThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
