import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HochComponent } from './hoch.component';

describe('HochComponent', () => {
  let component: HochComponent;
  let fixture: ComponentFixture<HochComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HochComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HochComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
