import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage0Component } from './stage0.component';

describe('Stage0Component', () => {
  let component: Stage0Component;
  let fixture: ComponentFixture<Stage0Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Stage0Component]
    });
    fixture = TestBed.createComponent(Stage0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
