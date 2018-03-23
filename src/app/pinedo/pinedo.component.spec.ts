import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinedoComponent } from './pinedo.component';

describe('PinedoComponent', () => {
  let component: PinedoComponent;
  let fixture: ComponentFixture<PinedoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinedoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
