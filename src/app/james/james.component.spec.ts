import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JamesComponent } from './james.component';

describe('JamesComponent', () => {
  let component: JamesComponent;
  let fixture: ComponentFixture<JamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
