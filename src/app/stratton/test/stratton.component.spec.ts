import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrattonComponent } from '../components/stratton.component';

describe('StrattonComponent', () => {
  let component: StrattonComponent;
  let fixture: ComponentFixture<StrattonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrattonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrattonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
