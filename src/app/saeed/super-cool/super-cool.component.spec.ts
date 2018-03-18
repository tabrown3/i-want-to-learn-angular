import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperCoolComponent } from './super-cool.component';

describe('SuperCoolComponent', () => {
  let component: SuperCoolComponent;
  let fixture: ComponentFixture<SuperCoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperCoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperCoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
