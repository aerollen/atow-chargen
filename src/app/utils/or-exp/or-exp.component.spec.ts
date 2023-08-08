import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrExpComponent } from './or-exp.component';

describe('OrExpComponent', () => {
  let component: OrExpComponent;
  let fixture: ComponentFixture<OrExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrExpComponent]
    });
    fixture = TestBed.createComponent(OrExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
