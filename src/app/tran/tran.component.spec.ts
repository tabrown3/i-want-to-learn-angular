import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranComponent } from './tran.component';

describe('TranComponent', () => {
  let component: TranComponent;
  let fixture: ComponentFixture<TranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
