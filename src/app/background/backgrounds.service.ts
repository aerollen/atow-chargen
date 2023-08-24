import { Injectable } from '@angular/core';
import { Attribute, Book, EnumMap, Eternal, Navigation, Skill, Stage, Stat, Statistic, Tracking, Trait } from '../utils/common';
import { Background, BackgroundInfo } from './background';

@Injectable({
  providedIn: 'root'
})
export class BackgroundsService {
  Backgrounds: { [value in Exclude<Stage, 0>]: Background[] } = {
    1: [],
    2: [],
    3: [],
    4: []
  }

  constructor() { 
    this.Backgrounds[1].push(
      new Background(2398, {
        Name: "Back Woods",
        Prereq: { And: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op:'>=', Level: 4 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Op:'>=', Level: 5 }] },
        Cost: 290,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 75 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: -25 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Illiterate, Quantity: -75 },
          { Kind: Statistic.Trait, Trait: Trait.Toughness, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -75 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: -5 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Ground, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 5 },
          { Kind: Statistic.Skill, Skill: Skill.Running, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Tracking, Subskill: Tracking.Wilds, Quantity: 10 },
          { Pick: { Count: 2, Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }})
          ] }, Quantity: 25 }
        ],
        Duration: 10,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 65
        }
      }),
      new Background(2398, {
        Name: 'Blue Collar',
        Cost: 210,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 45 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Quantity: 50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 25 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: -10 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -10 },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: '*', Quantity: 10 },
          { Pick: { Count: 2, Options: [
            { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*' },
            { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*' }
          ] }, Quantity: 5 },
          { Pick: { Count: 2, Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ] }, Quantity: 10 }
        ],
        Duration: 10,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 65
        }
      })
    )
  }

  public At(when: number, stage: Exclude<Stage, 0>): BackgroundInfo[] {
    return this.Backgrounds[stage].flatMap(aff => aff.At((when - 2398) as Eternal) ?? [])
  }
}
