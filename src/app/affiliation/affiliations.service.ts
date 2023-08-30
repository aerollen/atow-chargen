import { Affiliation, AffiliationInfo, Subaffiliation } from './affiliation';
import { Statistic, Trait, Skill, Attribute, Stat, Eternal, Book, EnumMap, Communications, AnimalHandling } from '../utils/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AffiliationsService {
  Affiliations: Affiliation[] = []
  constructor() { 
    const CapellanPrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Language,
      Subskill: 'Mandarin Chinese',
      Kind: Statistic.Skill };
    const CapellanSecondaryLanguages: (Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string })[] = 
      ['Russian', 'Cantonese', 'Vietnamese', 'English'].map(lang => { return {
        Skill: Skill.Language,
        Subskill: lang,
        Kind: Statistic.Skill }});
    const CapellanProtocol:  Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Protocol,
      Subskill: 'Capellan',
      Kind: Statistic.Skill }

    const FedSunPrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Language,
      Subskill: 'TODO',
      Kind: Statistic.Skill }
    const FedSunSecondaryLanguages: (Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string })[] = 
      [].map(lang => { return {
        Skill: Skill.Language,
        Subskill: lang,
        Kind: Statistic.Skill }});

    const DCProtocol:  Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Protocol,
      Subskill: 'Combine',
      Kind: Statistic.Skill }
    const DCPrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Language,
      Subskill: 'Japanese',
      Kind: Statistic.Skill }
    const DCSecondaryLanguages: (Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string })[] = 
      ['English', 'Swedenese', 'Arabic'].map(lang => { return {
        Skill: Skill.Language,
        Subskill: lang,
        Kind: Statistic.Skill }});

    const capellan = new Affiliation(2398, {
      Name: 'Capellan Confideration',
      Cost: 150,
      PrimaryLanguage: CapellanPrimaryLanguage,
      SecondaryLanguages: CapellanSecondaryLanguages,
      Protocol: CapellanProtocol,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -100 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.ExceptionalAttribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Quantity: 15 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name:'Andurien Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 }, 
        { Kind: Statistic.Trait, Trait: Trait.Patient, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -75 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 25 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Free Worlds', Quantity: 15 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name: 'Capella Commonality',
      Experience:  [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 55 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 10 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 10 },
        { Or: ['Russian', 'English'].map<Stat>(lang => { return { Kind:Statistic.Skill, Skill: Skill.Language, Subskill: lang }}), Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 20 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name: 'Chesterson Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 45 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -25 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 15 },
        { Or: [ FedSunPrimaryLanguage, ...FedSunSecondaryLanguages ], Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Chesterton History', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Quantity: 20 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name: 'St. Ives Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 25 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 25 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: '*', Quantity: 10 },
        { Or: EnumMap(Communications).map(skill => { return { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: skill }}), Quantity: 15 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 },
        { Or: [ FedSunPrimaryLanguage, ...FedSunSecondaryLanguages ], Quantity: 25 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Training, Quantity: 25 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name: 'Sarna Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 10 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Capellan History', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Quantity: 5 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name: 'Sian Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 85 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of Non-Capellans', Quantity: -125 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 40 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Capellan History', Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Quantity: 10 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name: 'Tikonov Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 25 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -25 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 50 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Tikonov History', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Quantity: 20 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).RemoveRegion(2898, 'Andurien Commonality')
      .RemoveRegion(3028, 'Liao Commonality')
      .Update(3052, {
        Cost: 100,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.ExceptionalAttribute, Attribute: Attribute.Edge, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Paranoia', Quantity: -150 },
          { Or: CapellanSecondaryLanguages, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Quantity: 15 }]
      })
    this.Affiliations.push(capellan);

    const draconis = new Affiliation(2398, {
      Name: 'Draconis Combine',
      Cost: 150,
      PrimaryLanguage: DCPrimaryLanguage,
      SecondaryLanguages: DCSecondaryLanguages,
      Protocol: DCProtocol,
      Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of House Davion', Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Xenophobia', Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -25 },
          { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: 'Oral Tradition', Quantity: 25},
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Combine', Quantity: 25 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name: 'Azami',
      Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Xenophobia', Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.ThickSkinned, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -100 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Arabic', Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Japanese', Quantity: -10 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.AnimalHandling, Subskill: AnimalHandling.Riding, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 50 }
      ],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, {
      Name: 'Benjamin District',
      Experience: [
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of house Davion', Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Xenophobia', Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Patient, Quantity: 15 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: 'Oral Tradition', Quantity: 15 },
        { Or: [ FedSunPrimaryLanguage, ...FedSunSecondaryLanguages ], Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Combine', Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 10 }
      ],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    })
    this.Affiliations.push(draconis);
  }

  public At(when: number): (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)[] {
    return this.Affiliations.flatMap(aff => aff.At((when - 2398) as Eternal) ?? [])
  }
}
