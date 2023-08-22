import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubaffComponent } from './subaff.component';

describe('SubaffComponent', () => {
  let component: SubaffComponent;
  let fixture: ComponentFixture<SubaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubaffComponent]
    });
    fixture = TestBed.createComponent(SubaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
