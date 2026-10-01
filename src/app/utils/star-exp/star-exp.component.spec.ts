import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarExpComponent } from './star-exp.component';
import { AppModule } from '../../app.module';
import { Experience, Skill, Statistic, Trait } from '../common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('StarExpComponent', () => {
  let component: StarExpComponent;
  let fixture: ComponentFixture<StarExpComponent>;
  let exp: Experience = {
    Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 5 
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [StarExpComponent]
    });
    fixture = TestBed.createComponent(StarExpComponent);
    component = fixture.componentInstance;
    component.exp = exp;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts incomplete until the wildcard skill receives a subskill', () => {
    expect(component.skillName).toBe('Language');
    expect(component.experience).toBeUndefined();
    expect(component.isComplete).toBe(false);
    expect(fixture.nativeElement.querySelector('#skill')).not.toBeNull();
  });

  it('resolves a skill on blur and emits the selected experience', () => {
    const choices: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(choice => choices.push(choice));
    const input = fixture.nativeElement.querySelector('#skill') as HTMLInputElement;

    input.value = 'Russian';
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const selectedSkill = {
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Russian',
      Quantity: 5
    };
    expect(component.experience).toEqual(selectedSkill);
    expect(component.isComplete).toBe(true);
    expect(choices).toEqual([{ add: [selectedSkill], remove: [] }]);
  });

  it('emits the previous skill with negative quantity when replacing it', () => {
    const choices: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(choice => choices.push(choice));
    const input = fixture.nativeElement.querySelector('#skill') as HTMLInputElement;

    input.value = 'Russian';
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    input.value = 'Japanese';
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(choices).toHaveLength(2);
    expect(choices[1]).toEqual({
      add: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Japanese', Quantity: 5 }],
      remove: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: -5 }]
    });
  });

  it('does not emit a choice for empty or unchanged input', () => {
    const choices: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(choice => choices.push(choice));
    const input = fixture.nativeElement.querySelector('#skill') as HTMLInputElement;

    input.value = '';
    input.dispatchEvent(new Event('blur'));
    input.value = 'Russian';
    input.dispatchEvent(new Event('blur'));
    input.dispatchEvent(new Event('blur'));

    expect(choices).toHaveLength(1);
  });

  it('resolves a Compulsion trigger on blur', () => {
    component.exp = {
      Kind: Statistic.Trait,
      Trait: Trait.Compulsion,
      Trigger: '*',
      Quantity: -10
    };
    fixture.detectChanges();
    const choices: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(choice => choices.push(choice));
    const input = fixture.nativeElement.querySelector('#compulsion') as HTMLInputElement;

    input.value = 'Claustrophobia';
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.isComplete).toBe(true);
    expect(choices).toEqual([{
      add: [{ Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Claustrophobia', Quantity: -10 }],
      remove: []
    }]);
  });

  it('respects label and quantity display inputs', () => {
    expect(fixture.nativeElement.textContent).toContain('Language/');
    expect(fixture.nativeElement.textContent).toContain('+5 EXP');

    component.showLabel = false;
    component.showQuantity = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Language/');
    expect(fixture.nativeElement.textContent).not.toContain('+5 EXP');
  });
});
