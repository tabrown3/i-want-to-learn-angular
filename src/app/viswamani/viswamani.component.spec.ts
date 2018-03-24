import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViswamaniComponent } from './viswamani.component';

describe('ViswamaniComponent', () => {
  let component: ViswamaniComponent;
  let fixture: ComponentFixture<ViswamaniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViswamaniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViswamaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
