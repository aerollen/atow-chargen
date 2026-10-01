import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrExpComponent } from './or-exp.component';
import { AppModule } from '../../app.module';
import { Experience, Skill, Statistic } from '../common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('OrExpComponent', () => {
  let component: OrExpComponent;
  let fixture: ComponentFixture<OrExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [OrExpComponent]
    });
    fixture = TestBed.createComponent(OrExpComponent);
    component = fixture.componentInstance;
    component.options = [
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' },
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian' }
    ];
    component.quantity = 20;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts incomplete with no selected experience', () => {
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedValue).toBeUndefined();
    expect(component.experience).toBeUndefined();
    expect(component.isComplete).toBe(false);
  });

  it('emits the selected option with its quantity', () => {
    const changes: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(change => changes.push(change));
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const selectedExperience = {
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'English',
      Quantity: 20
    };
    expect(component.selectedIndex).toBe(1);
    expect(component.selectedValue).toEqual(component.options[0]);
    expect(component.experience).toEqual(selectedExperience);
    expect(component.isComplete).toBe(true);
    expect(changes).toEqual([{ add: [selectedExperience], remove: [] }]);
  });

  it('removes the previous option when the selection changes', () => {
    const changes: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(change => changes.push(change));
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    select.selectedIndex = 2;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(changes).toHaveLength(2);
    expect(changes[1]).toEqual({
      add: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 20 }],
      remove: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English', Quantity: -20 }]
    });
  });

  it('disables configured options and respects label and quantity display inputs', () => {
    component.disabledOptionIndexes = [1];
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(component.disabledIndexes).toEqual([false, true]);
    expect(select.options[2].disabled).toBe(true);
    expect(select.textContent).toContain('Language/English');
    expect(fixture.nativeElement.textContent).toContain('+20 EXP');

    component.showLabel = false;
    component.showQuantity = false;
    fixture.detectChanges();

    expect(select.textContent).toContain('English');
    expect(fixture.nativeElement.textContent).not.toContain('+20 EXP');
  });

  it('emits correctly signed experience when quantity is negative', () => {
    component.quantity = -5;
    fixture.detectChanges();
    const changes: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(change => changes.push(change));
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    select.selectedIndex = 2;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(changes[0].add[0].Quantity).toBe(-5);
    expect(changes[1].remove[0].Quantity).toBe(5);
    expect(changes[1].add[0].Quantity).toBe(-5);
  });
});
