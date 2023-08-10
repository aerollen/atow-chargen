import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickExpComponent } from './pick-exp.component';

describe('PickExpComponent', () => {
  let component: PickExpComponent;
  let fixture: ComponentFixture<PickExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickExpComponent]
    });
    fixture = TestBed.createComponent(PickExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
