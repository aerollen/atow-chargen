import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewaffComponent } from './newaff.component';

describe('NewaffComponent', () => {
  let component: NewaffComponent;
  let fixture: ComponentFixture<NewaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewaffComponent]
    });
    fixture = TestBed.createComponent(NewaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
