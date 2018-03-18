import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrownComponent } from './brown.component';

describe('BrownComponent', () => {
  let component: BrownComponent;
  let fixture: ComponentFixture<BrownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
