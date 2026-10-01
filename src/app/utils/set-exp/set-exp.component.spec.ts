import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetExpComponent } from './set-exp.component';
import { AppModule } from '../../app.module';
import { Attribute, Experience, Skill, Statistic } from '../common';

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
    component.options = [
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength },
      { Kind: Statistic.Attribute, Attribute: Attribute.Body }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes positive allocations within their bounds', () => {
    expect(component.quantity).toBe(5);
    expect(component.min).toBe(1);
    expect(component.max).toBe(5);
    expect(component.remaining).toBe(0);
    expect(component.total).toBe(5);
    expect(component.unspent).toBe(0);
    expect(component.isComplete).toBe(false);
  });

  it('keeps the total fixed while distributing an allocation recursively', () => {
    component.counter.nativeElement.valueAsNumber = 2;
    component.quantityChanged();
    fixture.detectChanges();

    expect(component.quantity).toBe(2);
    expect(component.remaining).toBe(3);
    expect(component.recSetExp?.limit).toBe(3);
    expect(component.subtotal).toBe(3);
    expect(component.total).toBe(5);
    expect(component.unspent).toBe(3);
  });

  it('initializes negative allocations with signed bounds', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(SetExpComponent);
    component = fixture.componentInstance;
    component.limit = -5;
    component.options = [
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength },
      { Kind: Statistic.Attribute, Attribute: Attribute.Body }
    ];
    fixture.detectChanges();

    expect(component.quantity).toBe(-5);
    expect(component.min).toBe(-5);
    expect(component.max).toBe(-1);
    expect(component.remaining).toBe(0);
    expect(component.total).toBe(-5);
  });

  it('emits the selected experience once the allocation is complete', () => {
    const changes: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(change => changes.push(change));
    const select = fixture.nativeElement.querySelector('app-pick-exp select[title="or"]') as HTMLSelectElement;

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const selectedExperience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 5
    };
    expect(component.isComplete).toBe(true);
    expect(component.experience).toEqual([selectedExperience]);
    expect(changes).toEqual([{ add: [selectedExperience], remove: [] }]);
  });

  it('honors a selected option limit and leaves the remainder to recursive allocation', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(SetExpComponent);
    component = fixture.componentInstance;
    component.limit = 5;
    component.options = [{ Kind: Statistic.Skill, Skill: Skill.Acting, Limit: 3 }];
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('app-pick-exp select[title="or"]') as HTMLSelectElement;

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.properLimit).toBe(3);
    expect(component.quantity).toBe(3);
    expect(component.remaining).toBe(2);
    expect((fixture.nativeElement.querySelector('#quantity') as HTMLInputElement).max).toBe('3');
  });

  it('applies and clears a skill specialty', () => {
    const skill: Experience & { Kind: Statistic.Skill } = {
      Kind: Statistic.Skill,
      Skill: Skill.Acting,
      Quantity: 5
    };

    expect(component.handleSpeciality(skill, 'Performance')).toEqual({
      ...skill,
      Speciality: 'Performance'
    });
    expect(component.handleSpeciality({ ...skill, Speciality: 'Performance' }, '')).toEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Acting,
      Quantity: 5
    });
  });
});
