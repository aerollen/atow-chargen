import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffComponent } from './aff.component';
import { AppModule } from '../../../../app.module';
import { AffiliationInfo, Subaffiliation } from '../../../../affiliation/affiliation';
import { Attribute, Book, Experience, Skill, Statistic } from '../../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('AffComponent', () => {
  let component: AffComponent;
  let fixture: ComponentFixture<AffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [AffComponent]
    });
    fixture = TestBed.createComponent(AffComponent);
    component = fixture.componentInstance;
    const citation = { Book: Book.ATimeOfWar, Page: 1 };
    const primaryLanguage = { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' } as const;
    const protocol = { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Test' } as const;
    component.affiliations = [
      {
        Name: 'Standard affiliation',
        Cost: 0,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: -4 }
        ],
        PrimaryLanguage: primaryLanguage,
        SecondaryLanguages: [],
        Protocol: protocol,
        Citation: citation,
        Subaffiliations: [{ Name: 'Test region', Experience: [], Citation: citation }]
      },
      {
        Name: 'Choice affiliation',
        Cost: 0,
        Experience: [{
          Or: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' }],
          Quantity: 20
        }],
        PrimaryLanguage: primaryLanguage,
        SecondaryLanguages: [],
        Protocol: protocol,
        Citation: citation,
        Subaffiliations: []
      }
    ] as (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)[];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with no affiliation selected', () => {
    expect(component.currentAffiliation).toBeUndefined();
    expect(component.subaffiliations).toEqual([]);
    expect(component.affSubTotal).toBe(0);
    expect(component.isComplete).toBe(false);
  });

  it('updates the selected affiliation, subtotal, and output', () => {
    let changedAffiliation: { Name: string } | undefined;
    component.affiliationChanged.subscribe(affiliation => changedAffiliation = affiliation);
    const select = fixture.nativeElement.querySelector('#aff') as HTMLSelectElement;

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.currentAffiliation?.Name).toBe('Standard affiliation');
    expect(component.subaffiliations).toMatchObject([{ Name: 'Test region' }]);
    expect(component.affSubTotal).toBe(6);
    expect(component.isComplete).toBe(true);
    expect(changedAffiliation).toBe(component.currentAffiliation);
  });

  it('remains incomplete until an optional choice is selected and forwards that choice', () => {
    const choices: (Record<'add', Experience[]> & Record<'remove', Experience[]>)[] = [];
    component.choice.subscribe(choice => choices.push(choice));
    const affiliationSelect = fixture.nativeElement.querySelector('#aff') as HTMLSelectElement;

    affiliationSelect.selectedIndex = 2;
    affiliationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.currentAffiliation?.Name).toBe('Choice affiliation');
    expect(component.isComplete).toBe(false);

    const choiceSelect = fixture.nativeElement.querySelector('app-exp select[title="or"]') as HTMLSelectElement;
    choiceSelect.selectedIndex = 1;
    choiceSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.isComplete).toBe(true);
    expect(choices).toContainEqual({
      add: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English', Quantity: 20 }],
      remove: []
    });
  });
});