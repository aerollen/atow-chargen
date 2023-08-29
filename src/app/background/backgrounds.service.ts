import { Injectable } from '@angular/core';
import { Attribute, Book, EnumMap, Eternal, MedTech, Navigation, Requirment, Skill, Stage, Stat, Statistic, Tracking, Trait } from '../utils/common';
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
    const clanNames: string[] = [];

    // This is a bit of a beast but it builds all the possibilities for the three traits values summed to 5
    const nobilityPrereqs = [...Array(6).keys()]
      .flatMap(title => [...Array(6).keys()]
        .flatMap(wealth => [...Array(6).keys()]
          .map(property => { return { [Trait.Title]: title, [Trait.Wealth]: wealth, [Trait.Property]: property}})))
      .filter(sum => (sum[Trait.Title] + sum[Trait.Wealth] + sum[Trait.Property]) === 5)
      .map<Requirment>(total => { return { And: [
          { Kind: Statistic.Trait, Trait: Trait.Title, Op: '>=', Level: total[Trait.Title] },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Op: '>=', Level: total[Trait.Wealth] },
          { Kind: Statistic.Trait, Trait: Trait.Property, Op: '>=', Level: total[Trait.Property] }          
    ]}});

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
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: att }}),
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
          { Pick: { Count: 4, Options: [
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
      }),


      new Background(2398, {
        Name: 'Nobility',
        Prereq: { And: [
          ...clanNames.map<Requirment>(clan => { return { Not: { Stage: 0, Name: clan }}}),
          { Or: nobilityPrereqs }] },
        Cost: 215,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: -75 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: -75 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: -50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 125 },
          { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -200 },
          { Kind: Statistic.Trait, Trait: Trait.GlassJaw, Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 175 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 150 },
          { Kind: Statistic.Skill, Skill: Skill.Appraisal, Quantity: 5 },
          { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: '*', Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 10 },
          { Pick: { Count: 4, Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ] }, Quantity: 5 }
        ],
        Duration: 10,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 66
        }
      })
    );
    this.Backgrounds[2].push(
      new Background(2398, {
        Name: 'Adolescent Warefare',
        Prereq: { And: [{ Not: { Stage: 1, Name: 'Nobility' } }, { Not: { Stage: 1, Name: 'Trueborn Crèche' } }] },
        Cost: 500,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 40 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 40 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: -30 },
          { Kind: Statistic.Trait, Trait: Trait.CombatSense, Quantity: 80 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 30 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Paranoia', Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -40 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -20 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: -25 },
          { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: -10 },
          { Kind: Statistic.Skill, Skill: Skill.Running, Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 45 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 45 },
          
        ],
        Duration: 6,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 67,
          Notes: [
            'Changed Compulsion trigger from "Paranoid" to "Paranoia"',
            'Changed MedTech skill to have no Subskill to General'
          ]
        }
      })

    )
  }

  public At(when: number, stage: Exclude<Stage, 0>): BackgroundInfo[] {
    return this.Backgrounds[stage].flatMap(aff => aff.At((when - 2398) as Eternal) ?? [])
  }
}
