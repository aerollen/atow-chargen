import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage0Component } from './stage0.component';
import { AppModule } from 'src/app/app.module';
import { Archtype } from 'src/app/utils/common';

describe('Stage0Component', () => {
  let component: Stage0Component;
  let fixture: ComponentFixture<Stage0Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage0Component]
    });
    fixture = TestBed.createComponent(Stage0Component);
    component = fixture.componentInstance;
    component.archtype = Archtype.Academic;
    component.startingYear = 3051;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
