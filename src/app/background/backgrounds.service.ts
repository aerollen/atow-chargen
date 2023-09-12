import { Injectable } from '@angular/core';
import { Attribute, Book, Driving, EnumMap, Eternal, MedTech, Navigation, Prestidigitation, Requirement, Skill, Stage, Stat, Statistic, Tactics, Tracking, Trait } from '../utils/common';
import { Background, BackgroundInfo } from './background';

@Injectable({
  providedIn: 'root'
})
export class BackgroundsService {
  Backgrounds: { [value in Exclude<Stage, 0 | 3>]: Background[] } = {
    1: [],
    2: [],
    4: []
  }

  constructor() { 
    // This is a bit of a beast but it builds all the possibilities for the three traits values summed to 5
    const nobilityPrereqs = [...Array(6).keys()]
      .flatMap(title => [...Array(6).keys()]
        .flatMap(wealth => [...Array(6).keys()]
          .map(property => { return { [Trait.Title]: title, [Trait.Wealth]: wealth, [Trait.Property]: property}})))
      .filter(sum => (sum[Trait.Title] + sum[Trait.Wealth] + sum[Trait.Property]) === 5)
      .map<Requirement>(total => { return { And: [
          { Kind: Statistic.Trait, Trait: Trait.Title, Op: '>=', Level: total[Trait.Title] },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Op: '>=', Level: total[Trait.Wealth] },
          { Kind: Statistic.Trait, Trait: Trait.Property, Op: '>=', Level: total[Trait.Property] }          
    ]}});

    const flexiXPStage2 = (quantity: number) => {
      return { Set: { Options: [
        ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att, Limit: 200 }}),
        ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait, Limit: 200 }}),
        ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill, Limit: 35 }})
      ]}, Quantity: quantity }
    }

    this.Backgrounds[1].push(
      new Background(2398, { Name: "Back Woods",
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
          Page: 65 }
      }), new Background(2398, { Name: 'Blue Collar',
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
          Page: 65 }
      }), new Background(2398, { Name: 'Nobility',
        Prereq: { And: [
          { IsClanner: false },
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
      new Background(2398, { Name: 'Adolescent Warefare',
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
          flexiXPStage2(130)],
        Duration: 6,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 67,
          Notes: [
            'Changed Compulsion trigger from "Paranoid" to "Paranoia"',
            'Changed MedTech skill to have no Subskill to General'
          ]
        }
      }), new Background(2398, { Name: 'Back Woods',
        Cost: 500,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 60 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 70 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.AnimalEmpathy, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.GoodHearing, Quantity: 40 },
          { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -20 },
          { Kind: Statistic.Skill, Skill: Skill.Climbing, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 45 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: -15 },
          { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Tracking, Subskill: Tracking.Wilds, Quantity: 30 },
          flexiXPStage2(125)
        ],
        Duration: 6, 
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 67,
          Notes: [
            'Changed MedTech skill to have no Subskill to General',
            'Changes Survival subskill from Forest to any'
          ]
        }
      })
    );

    this.Backgrounds[4].push(
      new Background(2398, { Name: "Agitator",
        Cost: 900,
        Duration: 4,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.Bloodmark, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Gregarious, Quantity: 80 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -150 },
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Disguise, Quantity: 75 },
          { Or: EnumMap(Driving).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: sub }}), Quantity: 65 },
          { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 60 },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 80 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 70 },
          { Or: EnumMap(Prestidigitation).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Prestidigitation, Subskill: sub }}), Quantity: 100 },
          { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 75 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 75 },
          { Kind: Statistic.Skill, Skill: Skill.Tactics, Subskill: Tactics.Infantry, Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.Training, Quantity: 50 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att, Limit: 50 }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 125 }
        ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 74,
          Notes: ['Added subskill option for Prestidigitation because none was listed.'] }
      }), new Background(2398, { Name: "Civilian Job",
      Cost: 600,
      Duration: 6,
      Experience: [
        { Kind: Statistic.Skill, Skill: Skill.Administration, Quantity: 75 },
        { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: '*', Quantity: 40 },
        { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 40 },
        { Or: EnumMap(Driving).map(sub => { return { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: sub }}), Quantity: 60 },
        { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 50 },
        { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 40 },
        { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 30 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 50 },
        { Pick: { Count: 4, Options: EnumMap(Skill).map(skill => { return { Kind: Statistic.Skill, Skill: skill }})}, Quantity: 20 },
        { Set: { Options: [
          ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
          ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
          ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
        ]}, Quantity: 85 }
      ],
      Citation: {
        Book: Book.ATimeOfWar,
        Page: 74,
        Notes: ['Career subskill is originally restricted to Non-Military.', 'Changed four skills from choosen field to any four skills.'] }
    })
    );
  }

  public At(when: number, stage: Exclude<Stage, 0 | 3>): BackgroundInfo[] {
    return this.Backgrounds[stage].flatMap(aff => aff.At((when - 2398) as Eternal) ?? [])
  }
}
