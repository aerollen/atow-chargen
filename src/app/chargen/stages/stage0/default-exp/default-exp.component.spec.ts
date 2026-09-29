import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultExpComponent } from './default-exp.component';
import { AppModule } from '../../../../app.module';

import { beforeEach, describe, expect, it } from 'vitest';

describe('DefaultExpComponent', () => {
  let component: DefaultExpComponent;
  let fixture: ComponentFixture<DefaultExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [DefaultExpComponent]
    });
    fixture = TestBed.createComponent(DefaultExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('includes the default attribute and starting-skill experience', () => {
    expect(component.defaultExperience.length).toBe(10);
  });
});