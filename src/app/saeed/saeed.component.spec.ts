import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaeedComponent } from './saeed.component';

describe('SaeedComponent', () => {
  let component: SaeedComponent;
  let fixture: ComponentFixture<SaeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
