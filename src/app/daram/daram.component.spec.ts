import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaramComponent } from './daram.component';

describe('DaramComponent', () => {
  let component: DaramComponent;
  let fixture: ComponentFixture<DaramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
