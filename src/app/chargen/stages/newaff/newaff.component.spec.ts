import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewaffComponent } from './newaff.component';
import { AppModule } from '../../../app.module';
import { AffiliationInfo, Subaffiliation } from '../../../affiliation/affiliation';
import { AffiliationsService } from '../../../affiliation/affiliations.service';
import { Book, Experience, Skill, Statistic } from '../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

type TestAffiliation = AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>;

const citation = { Book: Book.ATimeOfWar, Page: 1 as const };
const primaryLanguage = { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' } as const;
const protocol = { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Test' } as const;

const makeSubaffiliation = (name: string): Subaffiliation => ({
  Name: name,
  Experience: [],
  Citation: citation
});

const makeAffiliation = (
  name: string,
  subaffiliations: Subaffiliation[],
  experience: Experience[] = []
): TestAffiliation => ({
  Name: name,
  Cost: 0,
  Experience: experience,
  PrimaryLanguage: primaryLanguage,
  SecondaryLanguages: [],
  Protocol: protocol,
  Citation: citation,
  Subaffiliations: subaffiliations
});

describe('NewaffComponent', () => {
  let component: NewaffComponent;
  let fixture: ComponentFixture<NewaffComponent>;
  let affiliationsByYear: Map<number, TestAffiliation[]>;
  let firstAffiliation: TestAffiliation;
  let secondAffiliation: TestAffiliation;
  let choiceAffiliation: TestAffiliation;

  beforeEach(() => {
    firstAffiliation = makeAffiliation('Affiliation A', [makeSubaffiliation('Region A')]);
    secondAffiliation = makeAffiliation('Affiliation B', [makeSubaffiliation('Region B')]);
    choiceAffiliation = makeAffiliation('Affiliation with choice', [makeSubaffiliation('Choice region')], [{
      Or: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian' }],
      Quantity: 20
    }]);
    affiliationsByYear = new Map([
      [3051, [firstAffiliation, choiceAffiliation]],
      [3052, [secondAffiliation]]
    ]);

    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [NewaffComponent],
      providers: [{
        provide: AffiliationsService,
        useValue: { At: (year: number) => affiliationsByYear.get(year) ?? [] }
      }]
    });
    fixture = TestBed.createComponent(NewaffComponent);
    component = fixture.componentInstance;
    component.currentYear = 3051;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('provides affiliations for the configured year', () => {
    expect(component.affiliations).toEqual([firstAffiliation, choiceAffiliation]);
  });

  it('excludes affiliations already selected elsewhere', () => {
    component.excludedAffiliations = [firstAffiliation];

    expect(component.affiliations).toEqual([choiceAffiliation]);
  });

  it('updates the available affiliations when the year changes', () => {
    component.currentYear = 3052;
    fixture.detectChanges();

    expect(component.affiliations).toEqual([secondAffiliation]);
  });

  it('forwards the current affiliation when either child selection changes', () => {
    const changedAffiliations: (AffiliationInfo | undefined)[] = [];
    component.affiliationChanged.subscribe(affiliation => changedAffiliations.push(affiliation));
    const affiliationSelect = fixture.nativeElement.querySelector('#aff') as HTMLSelectElement;

    affiliationSelect.selectedIndex = 1;
    affiliationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.currentAffiliation?.Name).toBe('Affiliation A');

    const subaffiliationSelect = fixture.nativeElement.querySelector('#subaff') as HTMLSelectElement;
    subaffiliationSelect.selectedIndex = 1;
    subaffiliationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(changedAffiliations).toEqual([firstAffiliation, firstAffiliation]);
  });

  it('emits changed while incomplete and complete with combined experience when both children finish', () => {
    const changes: unknown[] = [];
    const completions: Experience[][] = [];
    component.changed.subscribe(value => changes.push(value));
    component.complete.subscribe(experience => completions.push(experience));
    const affiliationSelect = fixture.nativeElement.querySelector('#aff') as HTMLSelectElement;

    affiliationSelect.selectedIndex = 1;
    affiliationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(changes).toHaveLength(1);
    expect(completions).toHaveLength(0);

    const subaffiliationSelect = fixture.nativeElement.querySelector('#subaff') as HTMLSelectElement;
    subaffiliationSelect.selectedIndex = 1;
    subaffiliationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(completions).toEqual([[]]);
  });

  it('rechecks completion after a nested experience choice changes', () => {
    const completions: Experience[][] = [];
    component.complete.subscribe(experience => completions.push(experience));
    const affiliationSelect = fixture.nativeElement.querySelector('#aff') as HTMLSelectElement;

    affiliationSelect.selectedIndex = 2;
    affiliationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const subaffiliationSelect = fixture.nativeElement.querySelector('#subaff') as HTMLSelectElement;
    subaffiliationSelect.selectedIndex = 1;
    subaffiliationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.isComplete).toBe(false);
    expect(completions).toHaveLength(0);

    const choiceSelect = fixture.nativeElement.querySelector('app-exp select[title="or"]') as HTMLSelectElement;
    choiceSelect.selectedIndex = 1;
    choiceSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(completions).toEqual([[
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 20 }
    ]]);
  });
});
