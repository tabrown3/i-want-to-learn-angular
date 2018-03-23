import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WuComponent } from './wu.component';

describe('WuComponent', () => {
  let component: WuComponent;
  let fixture: ComponentFixture<WuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
