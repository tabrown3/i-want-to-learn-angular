import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HamiltonComponent } from './hamilton.component';

describe('HamiltonComponent', () => {
  let component: HamiltonComponent;
  let fixture: ComponentFixture<HamiltonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HamiltonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HamiltonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
