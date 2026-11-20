import { TestBed } from '@angular/core/testing';
import { Attribute, Phenotype, Skill, Statistic, Trait } from '../utils/common';

import { BackgroundsService } from './backgrounds.service';

import { beforeEach, describe, expect, it } from 'vitest';

describe('BackgroundsService', () => {
  let service: BackgroundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns backgrounds for the requested stage', () => {
    expect(service.At(3055, 1).length).toBeGreaterThan(0);
  });

  it('provides the available trait choices for Fugitives', () => {
    const fugitives = service.At(3055, 1).find(background => background.Name === 'Fugitives');

    expect(fugitives?.Experience.find(experience => 'Or' in experience)).toEqual({
      Or: [
        Trait.CombatSense,
        Trait.GoodHearing,
        Trait.GoodVision,
        Trait.Patient,
        Trait.ThickSkinned,
        Trait.Toughness
      ].map(Trait => ({ Kind: Statistic.Trait, Trait })),
      Quantity: 100
    });
  });

  it('includes Trueborn Crèche when the Clan eugenics program begins', () => {
    const beforeIntroduction = service.At(2818, 1)
      .find(background => background.Name === 'Trueborn Crèche');
    const creche = service.At(2819, 1)
      .find(background => background.Name === 'Trueborn Crèche');

    expect(beforeIntroduction).toBeUndefined();
    expect(creche?.Cost).toBe(300);
    expect(creche?.Prereq).toMatchObject({
      And: expect.arrayContaining([
        { IsClanner: true },
        { Kind: Statistic.Trait, Trait: Trait.Phenotype, Op: '>', Level: 0 },
        { Kind: Statistic.Trait, Trait: Trait.Trueborn, Op: '>', Level: 0 }
      ])
    });
    expect(creche?.Experience).toContainEqual({
      Kind: Statistic.Trait,
      Trait: Trait.Trueborn,
      Quantity: 200
    });
    expect(creche?.Experience).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Reflexes,
      Quantity: 125
    });
    expect(creche?.Experience.find(experience => 'Or' in experience)).toEqual({
      Or: [
        { Kind: Statistic.Trait, Trait: Trait.Phenotype, Phenotype: Phenotype.Aerospace },
        { Kind: Statistic.Trait, Trait: Trait.Phenotype, Phenotype: Phenotype.Elemental },
        { Kind: Statistic.Trait, Trait: Trait.Phenotype, Phenotype: Phenotype.MechWarrior }
      ],
      Quantity: 0
    });
    expect(creche?.Experience.find(experience => 'Pick' in experience))
      .toMatchObject({ Pick: { Count: 5 }, Quantity: 15 });
  });

  it('applies Born Mercenary Brat rules for each era', () => {
    const bornMercenaryBrat = (year: number) => service.At(year, 1)
      .find(background => background.Name === 'Born Mercenary Brat');
    const starLeague = bornMercenaryBrat(2700);
    const starLeagueEnd = bornMercenaryBrat(2770);
    const postStarLeague = bornMercenaryBrat(2771);
    const pre3132 = bornMercenaryBrat(3131);
    const standard = bornMercenaryBrat(3132);

    expect(starLeague?.Cost).toBe(220);
    expect(starLeagueEnd?.Cost).toBe(220);
    expect(starLeague?.Experience).toContainEqual({
      Kind: Statistic.Trait,
      Trait: Trait.Reputation,
      Quantity: -100
    });
    expect(postStarLeague?.Cost).toBe(245);
    expect(postStarLeague?.Experience).toContainEqual({
      Kind: Statistic.Trait,
      Trait: Trait.Reputation,
      Quantity: -75
    });
    expect(pre3132?.Prereq).toMatchObject({
      And: expect.arrayContaining([
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Op: '>=', Level: 4 }
      ])
    });
    expect(standard?.Cost).toBe(270);
    expect(standard?.Experience).toContainEqual({
      Kind: Statistic.Trait,
      Trait: Trait.Reputation,
      Quantity: -50
    });
    expect(standard?.Prereq).not.toMatchObject({
      And: expect.arrayContaining([
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Op: '>=', Level: 4 }
      ])
    });
  });

  it('includes all Clan Apprenticeship caste branches', () => {
    const apprenticeship = service.At(3055, 2)
      .find(background => background.Name === 'Clan Apprenticeship');

    expect(apprenticeship?.Cost).toBe(500);
    expect(apprenticeship?.Prereq).toEqual({ IsClanner: true });
    expect(apprenticeship?.Options?.map(option => option.Name)).toEqual([
      'Laborer Caste',
      'Merchant Caste',
      'Scientist Caste',
      'Technician Caste'
    ]);
    expect(apprenticeship?.Experience).toContainEqual({
      Set: { Options: expect.any(Array) },
      Quantity: 165
    });
    expect(apprenticeship?.Options?.[0].Experience).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Body,
      Quantity: 30
    });
  });

  it('includes Freeborn Sibko branches and follows the four-skill Clan Cavalry field list', () => {
    const freeborn = service.At(3055, 2)
      .find(background => background.Name === 'Freeborn Sibko');
    const cavalry = freeborn?.Options?.find(option => option.Name === 'Cavalry');

    expect(freeborn?.Cost).toBe(950);
    expect(freeborn?.Options?.map(option => option.Name)).toEqual([
      'Aerospace',
      'Cavalry',
      'Elemental',
      'Infantry (Non-Elemental)',
      'MechWarrior'
    ]);
    expect(freeborn?.Experience.filter(experience => 'Kind' in experience && experience.Kind === Statistic.Skill))
      .toHaveLength(9);
    expect(cavalry?.Experience.filter(experience => 'Or' in experience)).toHaveLength(3);
    expect(cavalry?.Experience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.SensorOperations,
      Quantity: 50
    });
    expect(cavalry?.Experience.find(experience => 'Set' in experience)?.Quantity).toBe(276);
  });

  it('adds Trueborn Sibko and unlocks advanced branches in their permitted eras', () => {
    const beforeIntroduction = service.At(2818, 2)
      .find(background => background.Name === 'Trueborn Sibko');
    const beforeAdvancedElemental = service.At(2870, 2)
      .find(background => background.Name === 'Trueborn Sibko');
    const afterAdvancedElemental = service.At(2871, 2)
      .find(background => background.Name === 'Trueborn Sibko');
    const beforeProtoMech = service.At(3059, 2)
      .find(background => background.Name === 'Trueborn Sibko');
    const afterProtoMech = service.At(3060, 2)
      .find(background => background.Name === 'Trueborn Sibko');

    expect(beforeIntroduction).toBeUndefined();
    expect(beforeAdvancedElemental?.Options?.map(option => option.Name)).toEqual([
      'Aerospace',
      'Elemental',
      'MechWarrior'
    ]);
    expect(afterAdvancedElemental?.Options?.map(option => option.Name)).toEqual([
      'Aerospace',
      'Elemental',
      'Elemental (Advanced)',
      'MechWarrior'
    ]);
    expect(afterAdvancedElemental?.Options?.find(option => option.Name === 'Elemental (Advanced)')?.Experience)
      .toContainEqual({
        Kind: Statistic.Trait,
        Trait: Trait.Toughness,
        Quantity: 30
      });
    expect(beforeProtoMech?.Options?.map(option => option.Name)).toEqual([
      'Aerospace',
      'Elemental',
      'Elemental (Advanced)',
      'MechWarrior'
    ]);
    expect(afterProtoMech?.Cost).toBe(1600);
    expect(afterProtoMech?.Options?.map(option => option.Name)).toEqual([
      'Aerospace',
      'Elemental',
      'Elemental (Advanced)',
      'MechWarrior',
      'ProtoMech',
      'ProtoMech (Advanced)'
    ]);
    expect(afterProtoMech?.Options?.find(option => option.Name === 'Aerospace')?.DurationModifier).toBe(2);
    expect(afterProtoMech?.Options?.find(option => option.Name === 'ProtoMech')?.Cost).toBe(1500);
    expect(afterProtoMech?.Options?.find(option => option.Name === 'ProtoMech (Advanced)')?.Cost).toBe(1500);
    expect(afterProtoMech?.Options?.find(option => option.Name === 'Elemental (Advanced)')?.Experience)
      .toContainEqual({
        Kind: Statistic.Trait,
        Trait: Trait.Toughness,
        Quantity: 30
      });
  });
});