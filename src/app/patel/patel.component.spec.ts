import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatelComponent } from './patel.component';

describe('PatelComponent', () => {
  let component: PatelComponent;
  let fixture: ComponentFixture<PatelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
