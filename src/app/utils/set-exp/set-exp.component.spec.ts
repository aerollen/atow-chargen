import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetExpComponent } from './set-exp.component';
import { AppModule } from '../../app.module';

import { beforeEach, describe, expect, it } from 'vitest';

describe('SetExpComponent', () => {
  let component: SetExpComponent;
  let fixture: ComponentFixture<SetExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SetExpComponent]
    });
    fixture = TestBed.createComponent(SetExpComponent);
    component = fixture.componentInstance;
    component.limit = 5;
    component.options = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
