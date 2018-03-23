import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MamedbekovComponent } from './mamedbekov.component';

describe('MamedbekovComponent', () => {
  let component: MamedbekovComponent;
  let fixture: ComponentFixture<MamedbekovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MamedbekovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MamedbekovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
