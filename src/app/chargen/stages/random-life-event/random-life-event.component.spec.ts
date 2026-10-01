import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomLifeEventComponent } from './random-life-event.component';
import { AppModule } from '../../../app.module';
import { RngService } from '../../../utils/rng.service';
import { Attribute, Experience, Range, Skill, Statistic } from '../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('RandomLifeEventComponent', () => {
  let component: RandomLifeEventComponent;
  let fixture: ComponentFixture<RandomLifeEventComponent>;
  let rolls: number[];

  beforeEach(() => {
    rolls = [3, 4];
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [RandomLifeEventComponent],
      providers: [{
        provide: RngService,
        useValue: { Roll: () => rolls.shift()! }
      }]
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

  [
    { roll: 2, severity: 'Catastrophic!', experience: -200, denominator: 2 },
    { roll: 3, severity: 'Horrific!', experience: -150, denominator: 3 },
    { roll: 7, severity: 'Mundane', experience: 0, denominator: undefined },
    { roll: 11, severity: 'Awesome!', experience: 150, denominator: 3 },
    { roll: 12, severity: 'Blessed!', experience: 200, denominator: 2 }
  ].forEach(({ roll, severity, experience, denominator }) => {
    it(`maps roll ${roll} to ${severity}`, () => {
      component.currentRoll = roll as Range<2, 13>;

      expect(component.outcome.Severity).toBe(severity);
      expect(component.outcome.Experience[2]).toBe(experience);
      expect(component.outcome.Denominator).toBe(denominator);
    });
  });

  it('clamps modified rolls to the supported outcome range', () => {
    component.currentRoll = 2;
    component.modifiers = -10;
    expect(component.outcome.Severity).toBe('Catastrophic!');

    component.currentRoll = 12;
    component.modifiers = 10;
    expect(component.outcome.Severity).toBe('Blessed!');
  });

  it('rerolls using two dice and increments the reroll count', () => {
    rolls.push(2, 5);

    component.reroll();

    expect(component.currentRoll).toBe(7);
    expect(component.rerollCount).toBe(1);
  });

  it('completes a mundane outcome when accepted and disables rerolling', () => {
    const completions: Experience[][] = [];
    component.currentRoll = 7;
    component.complete.subscribe(experience => completions.push(experience));

    (fixture.nativeElement.querySelector('#accept') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(component.acceptance).toBe(true);
    expect(component.isComplete).toBe(true);
    expect(completions).toEqual([[]]);
    expect((fixture.nativeElement.querySelector('#reroll') as HTMLInputElement).disabled).toBe(true);
  });

  it('waits for a nonzero experience allocation, then emits changed and complete', () => {
    const changes: unknown[] = [];
    const completions: Experience[][] = [];
    component.currentRoll = 8;
    component.changed.subscribe(value => changes.push(value));
    component.complete.subscribe(experience => completions.push(experience));

    (fixture.nativeElement.querySelector('#accept') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(component.isComplete).toBe(false);
    expect(completions).toHaveLength(0);

    const allocationSelect = fixture.nativeElement.querySelector('app-set-exp app-pick-exp select[title="or"]') as HTMLSelectElement;
    allocationSelect.selectedIndex = 1;
    allocationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.isComplete).toBe(true);
    expect(changes).toHaveLength(1);
    expect(completions).toEqual([[
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 20 }
    ]]);
    expect(component.experience).toEqual([
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 20 }
    ]);
  });

  it('rounds allocation amounts up for positive and negative values', () => {
    expect(component.round(5, 2)).toBe(3);
    expect(component.round(-5, 2)).toBe(-2);
  });
});