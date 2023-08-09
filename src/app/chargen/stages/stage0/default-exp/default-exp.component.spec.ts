import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultExpComponent } from './default-exp.component';

describe('DefaultExpComponent', () => {
  let component: DefaultExpComponent;
  let fixture: ComponentFixture<DefaultExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultExpComponent]
    });
    fixture = TestBed.createComponent(DefaultExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
