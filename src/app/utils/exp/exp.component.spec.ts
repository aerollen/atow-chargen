import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpComponent } from './exp.component';
import { AppModule } from '../../app.module';
import { Attribute, Experience, Skill, Statistic } from '../common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('ExpComponent', () => {
  let component: ExpComponent;
  let fixture: ComponentFixture<ExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ExpComponent]
    });
    fixture = TestBed.createComponent(ExpComponent);
    component = fixture.componentInstance;
    component.values = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('classifies standard and choice-based experience entries', () => {
    const standard: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 100
    };
    const orChoice: Experience = {
      Or: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' }],
      Quantity: 20
    };
    const pickChoice: Experience = {
      Pick: { Count: 2, Options: [{ Kind: Statistic.Attribute, Attribute: Attribute.Body }] },
      Quantity: 10
    };
    const setChoice: Experience = {
      Set: { Options: [{ Kind: Statistic.Skill, Skill: Skill.Acting }] },
      Quantity: 30
    };
    const starChoice: Experience = {
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: '*',
      Quantity: 15
    };

    expect(component.isStd(standard)).toBe(true);
    expect(component.isStd(orChoice)).toBe(false);
    expect(component.isStd(pickChoice)).toBe(false);
    expect(component.isStd(setChoice)).toBe(false);
    expect(component.isStd(starChoice)).toBe(false);
  });

  it('projects choice options with their count and quantity', () => {
    const languageOption = { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' } as const;
    const orChoice: Experience = { Or: [languageOption], Quantity: 20 };
    const pickChoice: Experience = {
      Pick: { Count: 2, Options: [{ Kind: Statistic.Attribute, Attribute: Attribute.Body }] },
      Quantity: 10
    };
    const setChoice: Experience = {
      Set: { Options: [{ Kind: Statistic.Skill, Skill: Skill.Acting }] },
      Quantity: 30
    };

    expect(component.isOr(orChoice)).toEqual([languageOption]);
    expect(component.isPick(pickChoice)).toEqual({
      Count: 2,
      Options: [{ Kind: Statistic.Attribute, Attribute: Attribute.Body }],
      Quantity: 10
    });
    expect(component.isSet(setChoice)).toEqual({
      Options: [{ Kind: Statistic.Skill, Skill: Skill.Acting }],
      Quantity: 30
    });
    expect(component.isOr(pickChoice)).toBeUndefined();
    expect(component.isPick(orChoice)).toBeUndefined();
  });

  it('aggregates standard experience and forwards a resolved choice and completion', () => {
    const standard: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 100
    };
    const languageChoice: Experience = {
      Or: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' }],
      Quantity: 20
    };
    const choices: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    const completions: unknown[] = [];
    component.values = [standard, languageChoice];
    fixture.detectChanges();
    component.choice.subscribe(change => choices.push(change));
    component.completed.subscribe(value => completions.push(value));

    expect(component.isComplete).toBe(false);
    expect(component.experience).toEqual([standard]);

    const choiceSelect = fixture.nativeElement.querySelector('app-or-exp select[title="or"]') as HTMLSelectElement;
    choiceSelect.selectedIndex = 1;
    choiceSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const selectedLanguage = {
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'English',
      Quantity: 20
    };
    expect(component.isComplete).toBe(true);
    expect(component.experience).toEqual([standard, selectedLanguage]);
    expect(choices).toEqual([{ add: [selectedLanguage], remove: [] }]);
    expect(completions).toEqual([undefined]);
  });

  it('is complete when there are no unresolved choices', () => {
    component.values = [{
      Kind: Statistic.Attribute,
      Attribute: Attribute.Dexterity,
      Quantity: 50
    }];
    fixture.detectChanges();

    expect(component.isComplete).toBe(true);
    expect(component.experience).toEqual(component.values);
  });
});
