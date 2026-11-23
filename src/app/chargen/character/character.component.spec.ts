import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterComponent } from './character.component';
import { AppModule } from '../../app.module';
import { Character, Option } from '../../character/character';
import { of } from 'rxjs';
import { Attribute, Book, Phenotype, Eternal, Experience, Skill, Statistic, Trait } from '../../utils/common';
import { BackgroundInfo } from '../../background/background';
import { BackgroundsService } from '../../background/backgrounds.service';

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [CharacterComponent]
    });
    
    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    component.character = new Character({ Option: Option.Create });
  
    fixture.detectChanges(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with a minimum rating requirement for every attribute', () => {
    const attributes = [
      Attribute.Strength,
      Attribute.Body,
      Attribute.Dexterity,
      Attribute.Reflexes,
      Attribute.Intelligence,
      Attribute.Willpower,
      Attribute.Charisma,
      Attribute.Edge
    ];
    const requirements = component.Requirments;

    expect(requirements).toHaveLength(attributes.length);
    for (const attribute of attributes) {
      expect(requirements).toContainEqual({
        Kind: Statistic.Attribute,
        Attribute: attribute,
        Op: '>=',
        Level: 1
      });
    }
  });

  it('filters Stage 2 backgrounds against Stage 1 selections before passing them to the stage', () => {
    const affiliation = { Name: 'Draconis Combine', IsClanner: false };
    const preparatorySchool = TestBed.inject(BackgroundsService)
      .At(3051, 2)
      .find(background => background.Name === 'Preparatory School');
    expect(preparatorySchool).toBeDefined();

    for (const stageOneBackground of ['Fugitives', 'Back Woods']) {
      component.stageOne = {
        affYear: 3051,
        currentBackground: { Name: stageOneBackground },
        currentAffiliation: affiliation
      } as never;

      expect(component.stageTwoBackgrounds.some(background => background.Name === 'Preparatory School')).toBe(false);
    }

    component.stageOne = {
      affYear: 3051,
      currentBackground: { Name: 'Wanderers' },
      currentAffiliation: affiliation
    } as never;

    expect(component.stageTwoBackgrounds.some(background => background.Name === 'Preparatory School')).toBe(true);
  });

  it('filters Stage 2 backgrounds by affiliation before passing them to the stage', () => {
    const clanOnlyBackground = {
      Name: 'Clan-only background',
      Prereq: { IsClanner: true }
    } as BackgroundInfo;
    const generalBackground = { Name: 'General background' } as BackgroundInfo;
    const at = vi.spyOn(TestBed.inject(BackgroundsService), 'At')
      .mockReturnValue([clanOnlyBackground, generalBackground]);

    component.stageOne = {
      affYear: 3051,
      currentBackground: { Name: 'Wanderers' },
      currentAffiliation: { Name: 'Draconis Combine', IsClanner: false }
    } as never;

    expect(component.stageTwoBackgrounds).toEqual([generalBackground]);
    at.mockRestore();
  });

  it('keeps stage 0 affiliation experience when later stages retain that affiliation', () => {
    const selectedSubaffiliationExperience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Charisma,
      Quantity: 75
    } as Experience;
    const affiliation = { Name: 'Capellan Confideration' };

    component.stageZero = {
      currentAffiliation: affiliation,
      affiliationExperience: [selectedSubaffiliationExperience]
    } as never;
    component.stageOne = {
      currentAffiliation: affiliation,
      changeAffState: 'off',
      affiliationExperience: []
    } as never;
    component.stageTwo = {
      currentAffiliation: affiliation,
      changeAffState: 'off',
      affiliationExperience: []
    } as never;

    expect(component.affiliationExperience).toEqual([selectedSubaffiliationExperience]);
  });

  it('collects the Federated Suns INT 4 requirement without evaluating it', () => {
    component.stageZero = {
      currentAffiliation: {
        Name: 'Federated Suns',
        Citation: { Book: Book.ATimeOfWar, Page: 54 }
      },
      affiliationExperience: [{
        Kind: Statistic.Trait,
        Trait: Trait.NaturalAptitude,
        Skill: Skill.Protocol,
        Quantity: 100
      }],
      requirments: []
    } as never;

    expect(component.Requirments).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Intelligence,
      Op: '>=',
      Level: 4
    });
    expect(component.RequirementsForDisplay).not.toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Intelligence,
      Op: '>=',
      Level: 1
    });
  });

  it('does not apply the A Time of War INT prerequisite to the 2750 Natural Aptitude options', () => {
    component.stageZero = {
      currentAffiliation: {
        Name: 'Federated Suns',
        Citation: { Book: Book.EraReport2750, Page: 151 }
      },
      affiliationExperience: [{
        Kind: Statistic.Trait,
        Trait: Trait.NaturalAptitude,
        Skill: Skill.Tactics,
        Quantity: 100
      }],
      requirments: []
    } as never;

    expect(component.Requirments).not.toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Intelligence,
      Op: '>=',
      Level: 4
    });
  });

  it('shows Reqs in an independent toggle and hides dominated requirements from the list', () => {
    vi.spyOn(component, 'Requirments', 'get').mockReturnValue([
      { Stage: 1, Name: 'Fugitives' },
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>=', Level: 4 },
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>=', Level: 5 },
      { Or: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Body, Op: '>=', Level: 5 },
        { Affiliation: 'Clan Wolf' }
      ] }
    ]);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label[for="showReqs"]').textContent).toBe('show reqs?');
    const requirementItems = fixture.nativeElement.querySelectorAll('.requirement-item');
    expect(requirementItems).toHaveLength(3);
    expect(requirementItems[0].textContent).toContain('Stage 1: Fugitives');
    expect(requirementItems[1].querySelector('.compact-label')?.textContent).toBe('Strength');
    expect(requirementItems[1].querySelector('.compact-operator')?.textContent).toBe('>= 5');
    expect(requirementItems[2].textContent).toContain('One of:');
    expect(requirementItems[2].textContent).not.toContain('-');
    expect(requirementItems[2].querySelector('.compact-label')?.textContent).toBe('Body');
    expect(requirementItems[2].querySelector('.compact-operator')?.textContent).toBe('>= 5');
    expect((requirementItems[2].querySelector('.compact-stat') as HTMLElement).style.paddingLeft).toBe('0.75rem');
    expect(component.Requirments).toHaveLength(4);

    const checkbox = fixture.nativeElement.querySelector('#showReqs') as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.requirement-item')).toHaveLength(0);

    checkbox.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.requirement-item')).toHaveLength(3);
  });

  it('aggregates signed experience and keeps skill subskills distinct', () => {
    component.stageZero = {
      experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 20 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: -5 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: -5 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Japanese', Quantity: 15 },
        { Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: -10 }
      ] as Experience[],
      currentAffiliation: undefined,
      affiliationExperience: []
    } as never;

    expect(component.Experience).toEqual(expect.arrayContaining([
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 15 },
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 5 },
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Japanese', Quantity: 15 },
      { Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: -10 }
    ]));
    expect(component.TotalExp).toBe(25);
  });

  it('retains the selected phenotype in character experience despite its zero XP value', () => {
    const phenotype: Experience = {
      Kind: Statistic.Trait,
      Trait: Trait.Phenotype,
      Phenotype: Phenotype.Elemental,
      Quantity: 0
    };
    component.stageZero = {
      experience: [phenotype],
      currentAffiliation: undefined,
      affiliationExperience: []
    } as never;

    expect(component.Experience).toContainEqual(phenotype);
    expect(component.TotalExp).toBe(0);
  });

  it('splits affiliation experience when stage 1 changes affiliation', () => {
    const stageZeroExperience: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 20
    };
    const stageOneExperience: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Body,
      Quantity: 30
    };
    component.stageZero = {
      currentAffiliation: { Name: 'Affiliation A' },
      affiliationExperience: [stageZeroExperience]
    } as never;
    component.stageOne = {
      currentAffiliation: { Name: 'Affiliation B' },
      changeAffState: 'on',
      affiliationExperience: [stageOneExperience]
    } as never;

    expect(component.affiliationExperience).toEqual([
      { ...stageZeroExperience, Quantity: 10 },
      { ...stageOneExperience, Quantity: 15 }
    ]);
  });

  it('splits affiliation experience when stage 2 changes affiliation', () => {
    const stageZeroExperience: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 20
    };
    const stageTwoExperience: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Body,
      Quantity: 30
    };
    component.stageZero = {
      currentAffiliation: { Name: 'Affiliation A' },
      affiliationExperience: [stageZeroExperience]
    } as never;
    component.stageOne = {
      currentAffiliation: { Name: 'Affiliation A' },
      changeAffState: 'off',
      affiliationExperience: []
    } as never;
    component.stageTwo = {
      currentAffiliation: { Name: 'Affiliation B' },
      changeAffState: 'on',
      affiliationExperience: [stageTwoExperience]
    } as never;

    expect(component.affiliationExperience).toEqual([
      { ...stageZeroExperience, Quantity: 10 },
      { ...stageTwoExperience, Quantity: 15 }
    ]);
  });

  it('adds real-life stages newest-first and removes only the latest', () => {
    const affiliation = { Name: 'Affiliation A' };
    const stageTwo = {
      affYearChanged: of(3000 as Eternal),
      currentAffiliation: affiliation
    };
    const stageThree = {
      affYearChanged: of(3010 as Eternal),
      currentAffiliation: affiliation
    };
    const stageFour = {
      affYearChanged: of(3020 as Eternal),
      currentAffiliation: affiliation
    };
    component.stageTwo = stageTwo as never;

    component.addRealLife(new Event('click'), 3);
    component.stageThree = { last: stageThree } as never;
    component.addRealLife(new Event('click'), 4);
    component.stageFour = {
      last: stageFour,
      filter: (predicate: (value: typeof stageFour) => boolean) => [stageFour].filter(predicate)
    } as never;

    expect(component.RealLife.map(stage => stage.stage)).toEqual([4, 3]);
    expect(component.LatestStage3Or4).toBe(stageFour);

    component.removeRealLife(new Event('click'));

    expect(component.RealLife.map(stage => stage.stage)).toEqual([3]);
    expect(component.LatestStage3Or4).toBe(stageThree);
  });

  it('forwards the stage 0 language selection', () => {
    const language = {
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Russian',
      Quantity: 20
    } as Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string };
    let currentLanguage: typeof language | undefined;
    component.CurrentLanguage.subscribe(value => currentLanguage = value);

    component.stageZero.languageChanged.emit(language);

    expect(currentLanguage).toEqual(language);
  });

  it('toggles itemized experience visibility', () => {
    const checkbox = fixture.nativeElement.querySelector('#showExp') as HTMLInputElement;

    expect(fixture.nativeElement.querySelectorAll('.experience-item').length).toBeGreaterThan(0);
    checkbox.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.experience-item').length).toBe(0);

    checkbox.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.experience-item').length).toBeGreaterThan(0);
  });
});
