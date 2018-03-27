import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSearchHomeComponent } from './app-search-home.component';

describe('AppSearchHomeComponent', () => {
  let component: AppSearchHomeComponent;
  let fixture: ComponentFixture<AppSearchHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSearchHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSearchHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
