import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetExpComponent } from './set-exp.component';

describe('SetExpComponent', () => {
  let component: SetExpComponent;
  let fixture: ComponentFixture<SetExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetExpComponent]
    });
    fixture = TestBed.createComponent(SetExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
