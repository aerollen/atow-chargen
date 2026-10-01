import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickExpComponent } from './pick-exp.component';
import { AppModule } from '../../app.module';
import { Attribute, Experience, Skill, Statistic, Trait } from '../common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('PickExpComponent', () => {
  let component: PickExpComponent;
  let fixture: ComponentFixture<PickExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [PickExpComponent]
    });
    fixture = TestBed.createComponent(PickExpComponent);
    component = fixture.componentInstance;
    component.count = 2;
    component.options = [
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength },
      { Kind: Statistic.Attribute, Attribute: Attribute.Body }
    ];
    component.quantity = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts incomplete with one index and empty experience per requested pick', () => {
    expect(component.indexes).toEqual([0, 1]);
    expect(component.isComplete).toBe(false);
    expect(component.experience).toEqual([]);
    expect(component.pickedOption).toEqual({ 0: undefined, 1: undefined });
  });

  it('completes after selecting distinct options for every slot', () => {
    const changes: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    const completions: unknown[] = [];
    component.choice.subscribe(change => changes.push(change));
    component.completed.subscribe(value => completions.push(value));
    const pickers = fixture.nativeElement.querySelectorAll('app-or-exp select') as NodeListOf<HTMLSelectElement>;

    pickers[0].selectedIndex = 1;
    pickers[0].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(pickers[1].options[1].disabled).toBe(true);

    pickers[1].selectedIndex = 2;
    pickers[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.isComplete).toBe(true);
    expect(component.experience).toEqual([
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 },
      { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 10 }
    ]);
    expect(changes).toHaveLength(2);
    expect(completions).toEqual([undefined]);
  });

  it('emits the old pick as removed when a slot changes its selection', () => {
    const changes: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(change => changes.push(change));
    const firstPicker = fixture.nativeElement.querySelector('app-or-exp select') as HTMLSelectElement;

    firstPicker.selectedIndex = 1;
    firstPicker.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    firstPicker.selectedIndex = 2;
    firstPicker.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(changes[1]).toEqual({
      add: [{ Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 10 }],
      remove: [{ Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: -10 }]
    });
    expect(component.experience[0]).toEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Body,
      Quantity: 10
    });
  });

  it('allows an option as many times as it appears in the options list', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(PickExpComponent);
    component = fixture.componentInstance;
    component.count = 2;
    component.options = [
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength },
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength }
    ];
    component.quantity = 10;
    fixture.detectChanges();
    const pickers = fixture.nativeElement.querySelectorAll('app-or-exp select') as NodeListOf<HTMLSelectElement>;

    pickers[0].selectedIndex = 1;
    pickers[0].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(pickers[1].options[1].disabled).toBe(false);

    pickers[1].selectedIndex = 1;
    pickers[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.isComplete).toBe(true);
    expect(component.experience).toEqual([
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 },
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 }
    ]);
  });

  it('identifies extra input requirements and builds trait sub-options', () => {
    const wildcardLanguage = {
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: '*'
    } as const;
    const exceptionalAttribute = { Kind: Statistic.Trait, Trait: Trait.ExceptionalAttribute } as const;
    const naturalAptitude = { Kind: Statistic.Trait, Trait: Trait.NaturalAptitude } as const;

    expect(component.needsExtra(wildcardLanguage)).toBe(true);
    expect(component.needsExtra({ ...wildcardLanguage, Subskill: 'English' })).toBe(false);
    expect(component.extraType(wildcardLanguage)).toBe('text');
    expect(component.extraType(exceptionalAttribute)).toBe('dropdown');
    expect(component.asOpts(exceptionalAttribute)).toHaveLength(8);
    expect(component.asOpts(naturalAptitude)).toHaveLength(Object.keys(Skill).filter(value => Number.isNaN(Number(value))).length);
  });

  it('shows and hides the configured quantity', () => {
    expect(fixture.nativeElement.textContent).toContain('+10 EXP');

    component.showQuantity = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('+10 EXP');
  });
});
