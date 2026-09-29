import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomLifeEventComponent } from './random-life-event.component';
import { AppModule } from '../../../app.module';

import { beforeEach, describe, expect, it } from 'vitest';

describe('RandomLifeEventComponent', () => {
  let component: RandomLifeEventComponent;
  let fixture: ComponentFixture<RandomLifeEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [RandomLifeEventComponent]
    });
    fixture = TestBed.createComponent(RandomLifeEventComponent);
    component = fixture.componentInstance;
    component.stage = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('returns the mundane outcome for a roll of seven', () => {
    component.currentRoll = 7;

    expect(component.outcome.Severity).toBe('Mundane');
    expect(component.outcome.Experience[2]).toBe(0);
  });
});