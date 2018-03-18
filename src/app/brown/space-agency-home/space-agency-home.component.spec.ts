import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAgencyHomeComponent } from './space-agency-home.component';

describe('SpaceAgencyHomeComponent', () => {
  let component: SpaceAgencyHomeComponent;
  let fixture: ComponentFixture<SpaceAgencyHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceAgencyHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceAgencyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
