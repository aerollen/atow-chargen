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
      Kind: Statistic.Skill };

    const FedSunsPrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Language,
      Subskill: 'TODO',
      Kind: Statistic.Skill };
    const FedSunsSecondaryLanguages: (Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string })[] = 
      [].map(lang => { return {
        Skill: Skill.Language,
        Subskill: lang,
        Kind: Statistic.Skill }});
    const FedSunsProtocol:  Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Protocol,
      Subskill: 'FedSuns',
      Kind: Statistic.Skill };

    const DCProtocol:  Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Protocol,
      Subskill: 'Combine',
      Kind: Statistic.Skill };
    const DCPrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Language,
      Subskill: 'Japanese',
      Kind: Statistic.Skill };
    const DCSecondaryLanguages: (Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string })[] = 
      ['English', 'Swedenese', 'Arabic'].map(lang => { return {
        Skill: Skill.Language,
        Subskill: lang,
        Kind: Statistic.Skill }});

    const LyranPrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Language,
      Subskill: 'TODO',
      Kind: Statistic.Skill };
    const LyranSecondaryLanguages: (Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string })[] = 
      [].map(lang => { return {
        Skill: Skill.Language,
        Subskill: lang,
        Kind: Statistic.Skill }});
    const LyranProtocol:  Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Protocol,
      Subskill: 'Lyran',
      Kind: Statistic.Skill };

    const FWLPrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Language,
      Subskill: 'TODO',
      Kind: Statistic.Skill };
    const FWLSecondaryLanguages: (Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string })[] = 
      [].map(lang => { return {
        Skill: Skill.Language,
        Subskill: lang,
        Kind: Statistic.Skill }});
    const FWLProtocol:  Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Protocol,
      Subskill: 'FWL',
      Kind: Statistic.Skill };

    const RotSProtocol:  Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Protocol,
      Subskill: 'Repub. o/t Sphere',
      Kind: Statistic.Skill };

    const CanopianPrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Language,
      Subskill: 'TODO',
      Kind: Statistic.Skill };
    const CanopianSecondaryLanguages: (Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string })[] = 
      [].map(lang => { return {
        Skill: Skill.Language,
        Subskill: lang,
        Kind: Statistic.Skill }});
    const CanopianProtocol:  Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string } = {
      Skill: Skill.Protocol,
      Subskill: 'Canopian',
      Kind: Statistic.Skill }

    const capellan = new Affiliation(2398, { Name: 'Capellan Confideration',
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
        { ...CapellanProtocol, Quantity: 15 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, { Name:'Andurien Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 }, 
        { Kind: Statistic.Trait, Trait: Trait.Patient, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -75 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 25 },
        { ...CapellanProtocol, Quantity: 15 },
        { ...FWLProtocol, Quantity: 15 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, { Name: 'Capella Commonality',
      Experience:  [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 55 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 10 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 10 },
        { Or: ['Russian', 'English'].map<Stat>(lang => { return { Kind:Statistic.Skill, Skill: Skill.Language, Subskill: lang }}), Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 20 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, { Name: 'Chesterson Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 45 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -25 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 15 },
        { Or: [ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages ], Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Chesterton History', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 20 },
        { ...CapellanProtocol, Quantity: 20 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, { Name: 'St. Ives Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 25 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 25 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: '*', Quantity: 10 },
        { Or: EnumMap(Communications).map(skill => { return { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: skill }}), Quantity: 15 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 },
        { Or: [ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages ], Quantity: 25 },
        { ...CapellanProtocol, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Training, Quantity: 25 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, { Name: 'Sarna Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 10 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Capellan History', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 10 },
        { ...CapellanProtocol, Quantity: 5 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, { Name: 'Sian Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 85 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of Non-Capellans', Quantity: -125 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 40 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Capellan History', Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 10 },
        { ...CapellanProtocol, Quantity: 10 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).AddRegion(2398, { Name: 'Tikonov Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 25 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -25 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 50 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Tikonov History', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 20 },
        { ...CapellanProtocol, Quantity: 20 }],
      Citation: {
        Book: Book.EraReport2750,
        Page: 150 }
    }).RemoveRegion(2898, 'Andurien Commonality', {
      Book: Book.BestGuess,
      Page: 0,
      Notes: ['This is a best guess from data I could figure on sarna.net']
    }).RemoveRegion(3028, 'Liao Commonality', {
        Book: Book.EraReport3052,
        Page: 158
    }).UpdateRegion(3028, { Name: 'St. Ives Commonality',
      Cost: 125,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 25 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger:'Paranoia', Quantity: 100 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -100 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 55 },
        { Or: [ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages ], Quantity: 15 },
        { ...CapellanProtocol, Quantity: -15 },
        { ...FedSunsProtocol, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: '*', Quantity: 5 }],
      Citation: {
        Book: Book.EraReport3052,
        Page: 158
      }}, 'St. Ives Compact'
    ).RemoveRegion(3040, 'Chesterson Commonality', {
      Book: Book.BestGuess,
      Page: 0,
      Notes: ['This is a best guess from data I could figure on sarna.net']
    });
    capellan.Update(3052, {
        Cost: 100,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.ExceptionalAttribute, Attribute: Attribute.Edge, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Paranoia', Quantity: -150 },
          { Or: CapellanSecondaryLanguages, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 15 },
          { ...CapellanProtocol, Quantity: 15 }],
        Citation: {
          Book: Book.EraReport3052,
          Page: 158 }
    }).UpdateRegion(3052, { Name: 'Capella Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3052,
        Page: 158 }
    }).UpdateRegion(3052, { Name: 'Sian Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger:'Hatred of Non-Capellans', Quantity: -175 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 30 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill:'Capellan History', Quantity: 30 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 15 },
        { ...CapellanProtocol, Quantity: 15 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3052,
        Page: 158 }
    }).AddRegion(3057, { Name: 'Liao Commonality',
      Cost: 125,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 50 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger:'Paranoia', Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
        { Or: [...new Set([ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, LyranPrimaryLanguage, ...LyranSecondaryLanguages ])], Quantity: 25 },
        { Or: [FedSunsProtocol, LyranProtocol], Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: '*', Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 15 }],
      Citation: {
        Book: Book.EraReport3062,
        Page: 152 }
    });
    capellan.Update(3062, {
      Cost: 125,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
        { Kind: Statistic.Trait, Trait: Trait.ExceptionalAttribute, Attribute: Attribute.Edge, Quantity: 75 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Paranoia', Quantity: -150 },
        { Or: CapellanSecondaryLanguages, Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 15 },
        { ...CapellanProtocol, Quantity: 15 }],
      Citation: {
        Book: Book.EraReport3062,
        Page: 152 }
    }).RemoveRegion(3062, 'St. Ives Compact', {
      Book: Book.EraReport3062,
      Page: 152,
    }).UpdateRegion(3062, { Name: 'Capella Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 55 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 10 },
        { Or: [ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages ], Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 5 }],
      Citation: {
        Book: Book.EraReport3062,
        Page: 152 }
    }).UpdateRegion(3062, { Name: 'Sian Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 85 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger:'Hatred of Non-Capellans', Quantity: -155 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 40 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill:'Capellan History', Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 10 },
        { ...CapellanProtocol, Quantity: 15 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3062,
        Page: 152
      }
    }).AddRegion(3062, { Name: 'Victoria Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 35 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -50 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 15 }],
      Citation: {
        Book: Book.EraReport3062,
        Page: 152 }
    });
    capellan.Update(3076, {
      Cost: 150,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.ExceptionalAttribute, Attribute: Attribute.Edge, Quantity: 100 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Paranoia', Quantity: -100 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 },
        { ...CapellanProtocol, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 5 }],
      Citation: {
        Book: Book.ATimeOfWar,
        Page: 54 }
    }).UpdateRegion(3076, { Name: 'Capella Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 15 },
        { Or: [ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages ], Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 5 }],
      Citation: {
        Book: Book.ATimeOfWar,
        Page: 54 }
    }).UpdateRegion(3076, { Name: 'Liao Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -25 },
        { Or: [...new Set([ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, LyranPrimaryLanguage, ...LyranSecondaryLanguages ])], Quantity: 15 },
        { Or: [FedSunsProtocol, LyranProtocol], Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: '*', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 15 }],
      Citation: {
        Book: Book.ATimeOfWar,
        Page: 54 }
    }).UpdateRegion(3076, { Name: 'Sian Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of FedSuns', Quantity: -135 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill:'Capellan History', Quantity: 10 },
        { ...CapellanProtocol, Quantity:15 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 }],
      Citation: {
        Book: Book.ATimeOfWar,
        Page: 54 }
    }).AddRegion(3076, { Name: 'St. Ives Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -100 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 50 },
        { Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages], Quantity: 15 },
        { ...CapellanProtocol, Quantity: -15 },
        { ...FedSunsProtocol, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: '*', Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 10 }],
      Citation: {
        Book: Book.ATimeOfWar,
        Page: 54 }
    }).UpdateRegion(3076, { Name: 'Victoria Commonality',
    Experience: [
      { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 35 },
      { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
      { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -50 },

      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill:'*', Quantity: 15 },
      { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 },
      { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 15 }],
    Citation: {
      Book: Book.ATimeOfWar,
      Page: 54}
    }).UpdateRegion(3085, { Name: 'Capella Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 }],
      Citation: {
        Book: Book.FieldManual3085,
        Page: 233,
        Notes: ["Book uses name 'Capellan Commonality'"] }
    }).RemoveRegion(3085, 'Sarna Commonality',{
      Book: Book.FieldManual3085,
      Page: 233
    }).UpdateRegion(3085, { Name: 'Liao Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 50 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 25 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 15 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: "Hatred of the Republic of the Sphere", Quantity: -50 },
        { Or: [...new Set([ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, 
                            LyranPrimaryLanguage, ...LyranSecondaryLanguages,
                            FWLPrimaryLanguage, ...FWLSecondaryLanguages  ])], Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 20 }],
      Citation: {
        Book: Book.FieldManual3085,
        Page: 233 }
    }, 'Sarna Commonality'
    ).UpdateRegion(3085, { Name: 'Sian Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of FedSuns', Quantity: -75 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of Republic of the Sphere', Quantity: -60 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill:'Capellan History', Quantity: 10 },
        { ...CapellanProtocol, Quantity:15 },
        { Or: CapellanSecondaryLanguages, Quantity: 10 }],
      Citation: {
        Book: Book.FieldManual3085,
        Page: 233 }
    }).UpdateRegion(3085, { Name: 'St. Ives Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 25 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of FedSuns', Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -10 },
        { Or: [ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages ], Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill:'*', Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 }],
      Citation: {
        Book: Book.FieldManual3085,
        Page: 233 }
    }).AddRegion(3135, { Name: 'Chesterton Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 15 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 15 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 15 },
        { Or: FedSunsSecondaryLanguages, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 },
        { Or: [CapellanProtocol, RotSProtocol], Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3145,
        Page: 184,
        Notes: ["also see pg. 185"] }
    }).AddRegion(3135, { Name: 'Tikonov Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 10 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 20 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 20 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 15 },
        { Or: [CapellanProtocol, RotSProtocol], Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3145,
        Page: 184,
        Notes: ["also see pg. 185"] }
    }).UpdateRegion(3145, { Name: 'Capella Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 20 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 10 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 20 },
        { Or: ['Russian', 'English'].map<Stat>(lang => { return { Kind:Statistic.Skill, Skill: Skill.Language, Subskill: lang }}), Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 },
        { Or: [CapellanProtocol, RotSProtocol], Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3145,
        Page: 184,
        Notes: ["Book uses name 'Capellan Commonality'"] }
    }).UpdateRegion(3145, { Name: 'Sarna Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 50 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 25 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 20 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of Republic of the Sphere', Quantity: -50 },
        { Or: [...new Set([ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, 
                            FWLPrimaryLanguage, ...FWLSecondaryLanguages  ])], Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 20 }],
      Citation: {
        Book: Book.EraReport3145,
        Page: 184 }
    }).UpdateRegion(3145, { Name: 'Sian Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of FedSuns', Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of Republic of the Sphere', Quantity: -100 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 60 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 35 },
        { Or: [...new Set([ ...CapellanSecondaryLanguages, ...CanopianSecondaryLanguages ])], Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill:'Canopian History', Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill:'Capellan History', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 10 },
        { ...CanopianProtocol, Quantity: 5 },
        { ...CapellanProtocol, Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3145,
        Page: 184 }
    }).UpdateRegion(3145, { Name: 'St. Ives Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 30 },
        { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred of Republic of the Sphere', Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 10 },
        { Or: [ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages ], Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Art, Subskill:'*', Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3145,
        Page: 184 }
    }).UpdateRegion(3145, { Name: 'Victoria Commonality',
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 25 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 40 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -50 },
        { Or: [ CanopianPrimaryLanguage, ...CanopianSecondaryLanguages ], Quantity: 15 },
        { Or: [...new Set([ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, 
                            FWLPrimaryLanguage, ...FWLSecondaryLanguages,
                            CapellanPrimaryLanguage, ...CapellanSecondaryLanguages])], Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 10 },
        { ...CanopianProtocol, Quantity: 10 },
        { ...CapellanProtocol, Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 10 }],
      Citation: {
        Book: Book.EraReport3145,
        Page: 184 }
    });
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
        { Or: [ FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages ], Quantity: 10 },
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
