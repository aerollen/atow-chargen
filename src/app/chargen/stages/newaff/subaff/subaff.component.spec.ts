import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubaffComponent } from './subaff.component';
import { AppModule } from '../../../../app.module';
import { Subaffiliation } from '../../../../affiliation/affiliation';
import { Attribute, Book, Experience, Skill, Statistic } from '../../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('SubaffComponent', () => {
  let component: SubaffComponent;
  let fixture: ComponentFixture<SubaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SubaffComponent]
    });
    fixture = TestBed.createComponent(SubaffComponent);
    component = fixture.componentInstance;
    const citation = { Book: Book.ATimeOfWar, Page: 1 as const };
    component.subaffiliations = [
      {
        Name: 'Standard region',
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: -4 }
        ],
        Citation: citation
      },
      {
        Name: 'Choice region',
        Experience: [{
          Or: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' }],
          Quantity: 20
        }],
        Citation: citation
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts without a selected subaffiliation', () => {
    expect(component.currentSubaffiliation).toBeUndefined();
    expect(component.experience).toEqual([]);
    expect(component.subaffSubTotal).toBe(0);
    expect(component.isComplete).toBe(false);
  });

  it('updates the selected subaffiliation, experience, subtotal, and output', () => {
    let changedSubaffiliation: Subaffiliation | undefined;
    component.subaffiliationChanged.subscribe(subaffiliation => changedSubaffiliation = subaffiliation);
    const select = fixture.nativeElement.querySelector('#subaff') as HTMLSelectElement;

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.currentSubaffiliation?.Name).toBe('Standard region');
    expect(component.experience).toEqual(component.currentSubaffiliation?.Experience);
    expect(component.subaffSubTotal).toBe(6);
    expect(component.isComplete).toBe(true);
    expect(changedSubaffiliation).toBe(component.currentSubaffiliation);
  });

  it('remains incomplete until an optional choice is selected and forwards that choice', () => {
    const choices: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(choice => choices.push(choice));
    const subaffiliationSelect = fixture.nativeElement.querySelector('#subaff') as HTMLSelectElement;

    subaffiliationSelect.selectedIndex = 2;
    subaffiliationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.currentSubaffiliation?.Name).toBe('Choice region');
    expect(component.isComplete).toBe(false);

    const choiceSelect = fixture.nativeElement.querySelector('app-exp select[title="or"]') as HTMLSelectElement;
    choiceSelect.selectedIndex = 1;
    choiceSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.isComplete).toBe(true);
    expect(component.experience).toEqual([
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English', Quantity: 20 }
    ]);
    expect(choices).toContainEqual({
      add: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English', Quantity: 20 }],
      remove: []
    });
  });

  it('hides the selector and remains incomplete when there are no subaffiliations', () => {
    component.subaffiliations = [];
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('div[hidden]') as HTMLDivElement).hidden).toBe(true);
    expect(component.currentSubaffiliation).toBeUndefined();
    expect(component.subaffSubTotal).toBe(0);
    expect(component.isComplete).toBe(false);
  });
});