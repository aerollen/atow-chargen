import { Injectable } from '@angular/core';
import { Acrobatics, AnimalHandling, Attribute, Book, Communications, Driving, EnumMap, Eternal, Experience, Gunnery, MedTech, Navigation, Piloting, Prestidigitation, Requirement, SecuritySystem, Skill, Stage, Stat, Statistic, Tactics, Technician, Tracking, Trait } from '../utils/common';
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
    const whiteCollarPrereqs = [...Array(4).keys()]
      .flatMap(wealth => [...Array(4).keys()]
        .map(property => { return { [Trait.Wealth]: wealth, [Trait.Property]: property}}))
      .filter(sum => (sum[Trait.Wealth] + sum[Trait.Property]) === 3)
      .map<Requirement>(total => { return { And: [
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
      }), new Background(2398, { Name: 'Farm',
      Cost: 275,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 100 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 100 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Quantity: 25 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -50 },
        { Kind: Statistic.Trait, Trait: Trait.AnimalEmpathy, Quantity: 25 },
        { Kind: Statistic.Trait, Trait: Trait.Illiterate, Quantity: -25 },
        { Kind: Statistic.Trait, Trait: Trait.Toughness, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -25 },
        { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Agriculture', Quantity: 10 },
        { Or: EnumMap(AnimalHandling).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.AnimalHandling, Subskill: sub }}), Quantity: 15 },
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
        Page: 65,
        Notes: ['Added subskill to AnimalHandling skill.'] }
      }), new Background(2398, { Name: 'Fugitives',
        Cost: 225,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 25 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.DarkSecret, Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.Illiterate, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -100 },
          { Or: EnumMap(Tactics).filter(trait => [Trait.CombatSense, Trait.GoodHearing, Trait.GoodVision, 
                Trait.Patient, Trait.ThickSkinned, Trait.Toughness].includes(trait))
                .map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}), Quantity: 100 },
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 5 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 5 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Running, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '*', Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations, Quantity: 5 },
          { Pick: { Count: 4, Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ] }, Quantity: 5 }
        ],
        Duration: 10,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 65,
          Notes: ['Continued on page 66.'] }
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
      }), new Background(2398, { Name: 'Slave',
        Prereq: { And: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op:'>=', Level: 4 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Op:'>=', Level: 4 }] },
        Cost: 45,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 75 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: -50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -200 },
          { Pick: { Count: 1, Options: EnumMap(Trait)
            .filter(trait => [Trait.ExceptionalAttribute, Trait.NaturalAptitude].includes(trait))
            .map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
          }, Quantity: 90 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: -5 },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: '*', Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 15 },
          { Or: EnumMap(Technician).map<Stat>(tech => { return { Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: tech }}), Quantity: 5 },
          { Pick: { Count: 4, Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
          ] }, Quantity: 25 }
        ],
        Duration: 10,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 66
        }
      }), new Background(2398, { Name: 'Street',
        Cost: 250,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 25 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: -20 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -25 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Paranoia', Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.Illiterate, Quantity: -75 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.Toughness, Quantity: 200 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -75 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: -5 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 5 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 10 },
          { Pick: { Count: 4, Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})] }, Quantity: 10 }],
        Duration: 10,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 66,
          Notes: ['Changed Compulsion trigger from "Paranoid" to "Paranoia"',]
        }
      }), new Background(2398, { Name: 'War Orphan',
        Cost: 170,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Traumatic Memories', Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Illiterate, Quantity: -25 },
          { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.SixthSense, Quantity: 150 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -100 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: -5 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 5 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 10 },
          { Pick: { Count: 3, Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
          ] }, Quantity: 25 }
        ],
        Duration: 10,
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 66
        }
      }), new Background(2398, { Name: 'White Collar',
        Cost: 170,
        Prereq: { Or: whiteCollarPrereqs },
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: -50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: -50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 75 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: -50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.ExtraIncome, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.GlassJaw, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: '*', Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 5 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 10 },
          { Or: EnumMap(Technician).map<Stat>(tech => { return { Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: tech }}), Quantity: 5 },
          { Pick: { Count: 3, Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ] }, Quantity: 5 }],
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
      }), new Background(2398, { Name: 'Farm',
        Cost: 400,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 40 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.AnimalEmpathy, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Administration, Quantity: 35 },
          { Or: EnumMap(AnimalHandling).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.AnimalHandling, Subskill: sub }}), Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Agriculture', Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: Driving.Ground, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 30 },
          flexiXPStage2(115)
        ],
        Duration: 6, 
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 67,
          Notes: [
            'Added subtype to AnimalHandling skill.'
          ]
        }
      }), new Background(2398, { Name: 'High School',
        Cost: 400,
        Prereq: { And: [{ IsClanner: false }, { Kind: Statistic.Trait, Trait: Trait.Illiterate, Op: '<=', Level: 0 }]},
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 25 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 25 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Swimming, Quantity: 20 },
          flexiXPStage2(185)
        ],
        Duration: 6, 
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 68,
        }
      }), new Background(2398, { Name: 'Mercenary Brat',
        Cost: 600,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 35 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: -20 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 40 },
          { Kind: Statistic.Trait, Trait: Trait.TechEmpathy, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Soldier', Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: Driving.Ground, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '*', Quantity: 20 },
          { Or: EnumMap(Tactics).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Tactics, Subskill: sub }}), Quantity: 10 },
          { Or: EnumMap(Technician).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: sub }}), Quantity: 30 },
          flexiXPStage2(150)
        ],
        Duration: 6, 
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 68,
          Notes: ['Changed MedTech skill to have no Subskill to General']
        }
      }), new Background(2398, { Name: 'Military School',
        Cost: 500,
        Prereq: { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Op: '>=', Level: 3 },
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 15 },
          { Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: 15 },
          { Kind: Statistic.Trait, Trait: Trait.Rank, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Soldier', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Military History', Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Running, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Strategy, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Swimming, Quantity: 30 },
          { Set: { Options: [
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill, Limit: 35 }})
          ]}, Quantity: 40 }
        ],
        Duration: 6, 
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 68,
          Notes: ['Changed MedTech skill to have no Subskill to General']
        }
      }), new Background(2398, { Name: 'Preparatory School',
        Cost: 500,
        Prereq: { And: [
          { Not: { Stage: 1, Name: 'Back Woods' }},
          { Not: { Stage: 1, Name: 'Fugitive' }},
          { Kind: Statistic.Trait, Trait: Trait.Illiterate, Op: '<=', Level: 0 }
        ] },
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 60 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 40 },
          { Kind: Statistic.Trait, Trait: Trait.ExtraIncome, Quantity: 20 },
          { Kind: Statistic.Trait, Trait: Trait.Gregarious, Quantity: 20 },

          { Kind: Statistic.Skill, Skill: Skill.Archery, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 40 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att, Limit: 200 }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait, Limit: 80 }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill, Limit: 35 }})
          ]}, Quantity: 160 }
        ],
        Duration: 6, 
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 68,
          Notes: ['Continued on page 69', 'Changed MedTech skill to have no Subskill to General']
        }
      }), new Background(2398, { Name: 'Spacer Family',
        Cost: 490,
        Prereq: { And: [
          { Kind: Statistic.Trait, Trait: Trait.TDS, Op: '<=', Level: 0 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Op: '>=', Level: 4 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Op: '>=', Level: 4 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op: '>=', Level: 4 },
          { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations, Op: '>=', Level: 2 }
        ] },
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 40 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Quantity: 30 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: -20 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 20 },
          { Kind: Statistic.Trait, Trait: Trait.GTolerance, Quantity: 40 },
          { Kind: Statistic.Trait, Trait: Trait.NaturalAptitude, Skill: Skill.ZeroGOperations, Quantity: 20 },
          { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -25 },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: "Ship's Crew", Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.Conventional, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Gunnery, Subskill: Gunnery.Spacecraft, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Space, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Piloting, Subskill: Piloting.Spacecraft, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: Technician.Aeronautics, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: Technician.Electronics, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations, Quantity: 15 },
          { Set: { Options: [
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill, Limit: 35 }})
          ]}, Quantity: 100 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att, Limit: 200 }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait, Limit: 200 }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill, Limit: 35 }})
          ]}, Quantity: 75 }
        ],
        Duration: 6, 
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 69 }
      }), new Background(2398, { Name: 'Street',
        Cost: 400,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 20 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 40 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.CombatSense, Quantity: 15 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 20 },
          { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.Illiterate, Quantity: -20 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -20 },
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Climbing, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Disguise, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.EscapeArtist, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Interrogation, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Running, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Scrounge, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 40 },
          flexiXPStage2(60)
        ],
        Duration: 6, 
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 69, 
          Notes: ['Changed MedTech skill to have no Subskill to General']
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
      }), new Background(2398, { Name: "Combat Correspondent",
        Cost: 700,
        Prereq: { And: [{ IsClanner: false }, { Field: 'Journalist' }, { Kind: Statistic.Trait, Trait: Trait.CombatParalysis, Op: '<=', Level: 0 }]},
        Duration: 4,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.ExtraIncome, Quantity: 40 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: 'Writing', Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Journalist', Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.Conventional, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Investigation, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 30 },
          { Or: EnumMap(Navigation).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: sub }}), Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: Technician.Electronics, Quantity: 35 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 90 }
        ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 75,
          Notes: ['Continued on page 76.','Renamed Technician subskill from Electrical to Electronics.'] }
      }), new Background(2788, { Name: "Covert Operations", //INCOMPLETE
        Cost: 1000,
        Prereq: { And: [{ IsClanner: false }, 
          { Or: [...['Police Academy', 'Intelligence Operative Training', 'Military Academy', 'Military Enlistment', 'Family Training'].map<Requirement>(edu => { return { Stage: 3, Name: edu}}), { And: [
            { Stage: 4, Name: 'Tour of Duty'}, { Or: [{ Kind: Statistic.Trait, Trait: Trait.Connections, Op: '>=', Exp: 150 }, { Kind: Statistic.Skill, Skill: Skill.Leadership, Op: '>=', Exp: 150 }]}
          ]}] }, { Not: { Kind: Statistic.Trait, Trait: Trait.CombatParalysis, Op: '<=', Level: 0 }}]},
        Duration: 6,
        Experience: [
          { Pick: { Count: 2, Options: 
            EnumMap(Attribute).filter(att => [Attribute.Body, Attribute.Reflexes, Attribute.Willpower, Attribute.Edge].includes(att))
            .map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: att }}) }, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.AlternativeID, Quantity: 85 },
          { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -25 },
          { Kind: Statistic.Trait, Trait: Trait.InForLife, Quantity: -110 },
          { Kind: Statistic.Trait, Trait: Trait.SixthSense, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 50 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 150 },
          ...[
            { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Quantity: 25 },
            { Kind: Statistic.Trait, Trait: Trait.Citizenship, Quantity: 75 },
            { Kind: Statistic.Trait, Trait: Trait.DarkSecret, Quantity: -50 },
            { Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: 25 },
            { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -50 },
            { Kind: Statistic.Skill, Skill: Skill.Climbing, Quantity: 50 },
            { Kind: Statistic.Skill, Skill: Skill.Demolitions, Quantity: 60 },
            { Kind: Statistic.Skill, Skill: Skill.EscapeArtist, Quantity: 35 },
            { Kind: Statistic.Skill, Skill: Skill.Interrogation, Quantity: 60 },
            { Kind: Statistic.Skill, Skill: Skill.Investigation, Quantity: 15 },
            { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 75 },
            { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 25 },
            { Kind: Statistic.Skill, Skill: Skill.Science, Subskill: 'Chemistry', Quantity: 40 },
            { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 50 },
            { Or: EnumMap(Tactics).map<Stat>(tech => { return { Kind: Statistic.Skill, Skill: Skill.Tactics, Subskill: tech }}), Quantity: 30 },
            { Kind: Statistic.Skill, Skill: Skill.ThrownWeapons, Quantity: 45 },
          ].map<Experience>(exp => { return <Experience>{ ...exp, If: { Affiliation: 'Capellan Confideration'}}}),
          ...[
            { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 50 },
            { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
            { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -50 },
            { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: -50 },
            { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 75 },
            { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -25 },
            { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 50 },
            { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -75 },
            { Or: ['House Kurita', 'Draconis Combine'].map<Stat>(whom => { return { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: `Loyalty to ${whom}` }}), Quantity: -50 },
            { Kind: Statistic.Skill, Skill: Skill.Acrobatics, Subskill: Acrobatics.Gymnastics, Quantity: 35 },
            { Kind: Statistic.Skill, Skill: Skill.Climbing, Quantity: 50 },
            { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 25 },
            { Kind: Statistic.Skill, Skill: Skill.Cryptography, Quantity: 40 },
            { Kind: Statistic.Skill, Skill: Skill.Interrogation, Quantity: 60 },
            { Kind: Statistic.Skill, Skill: Skill.Investigation, Quantity: 25 },
            { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 40 },
            { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 55 },
            { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 30 },
            { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 40 },
            { Kind: Statistic.Skill, Skill: Skill.Stealth, Quantity: 30 },
            { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 35 },
            { Or: EnumMap(Tactics).map<Stat>(tech => { return { Kind: Statistic.Skill, Skill: Skill.Tactics, Subskill: tech }}), Quantity: 35 },
            { Kind: Statistic.Skill, Skill: Skill.Training, Quantity: 30 }
          ].map<Experience>(exp => { return <Experience>{ ...exp, If: { Affiliation: 'Draconis Combine'}}}),
        ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 76 }
      }), new Background(2398, { Name: "Explorer", //INCOMPLETE
        Prereq: { And: [{ Kind: Statistic.Trait, Trait: Trait.TDS, Op: '<=', Level: 0 },
          { Or: [{ And: [{ IsInner: true}, { Kind: Statistic.Trait, Trait: Trait.Connections, Op: '>=', Exp: 150 }]}]},
                 { IsPerifphery: true }]}, //Incomplete
        Cost: 900,
        Duration: 6,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 20 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 30 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 30 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 30 },
          { Kind: Statistic.Trait, Trait: Trait.GTolerance, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.GoodHearing, Quantity: 35 },
          { Kind: Statistic.Trait, Trait: Trait.VehicleLevel, Quantity: 35 },
          { Kind: Statistic.Trait, Trait: Trait.Introvert, Quantity: -40 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -50 },
          { Kind: Statistic.Skill, Skill: Skill.Appraisal, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Climbing, Quantity: 25 },
          { Or: EnumMap(Communications).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: sub }}), Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Investigation, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General, Quantity: 15 },
          { Or: EnumMap(Navigation).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: sub }}), Quantity: 50 },
          { Or: EnumMap(Piloting).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Piloting, Subskill: sub }}), Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations, Quantity: 55 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 75 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '*', Quantity: 35 },
          { Or: EnumMap(Tracking).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Tracking, Subskill: sub }}), Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations, Quantity: 15 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 170 }
        ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 77,
          Notes: ['Changed MedTech skill to have no Subskill to General', 'Changed Zero-G Training skill to Zero-G Operations'] }
      }), new Background(2398, { Name: "Gurilla Insurgent", //INCOMPLETE
        Prereq: { IsClanner: false }, 
        Cost: 900,
        Duration: 6,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Bloodmark, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.CombatSense, Quantity: 30 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 30 },
          { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Hatred for Authority', Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.Dependent, Quantity: -25 },
          { Kind: Statistic.Trait, Trait: Trait.Unlucky, Quantity: -35 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 45 },
          { Kind: Statistic.Skill, Skill: Skill.Demolitions, Quantity: 65 },
          { Kind: Statistic.Skill, Skill: Skill.Disguise, Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.EscapeArtist, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 25 },
          { Or: EnumMap(Prestidigitation).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Prestidigitation, Subskill: sub }}), Quantity: 50 },
          { Or: EnumMap(SecuritySystem).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.SecuritySystem, Subskill: sub }}), Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.SupportWeapons, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 35 },
          ...[
            { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: -25 },
            { Kind: Statistic.Trait, Trait: Trait.DarkSecret, Quantity: -50 },
            { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -50 },
            { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 25 },
            { Kind: Statistic.Trait, Trait: Trait.Toughness, Quantity: 25 },
            { Kind: Statistic.Skill, Skill: Skill.Climbing, Quantity: 40 },
            { Or: EnumMap(Driving).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: sub }}), Quantity: 50 },
            { Kind: Statistic.Skill, Skill: Skill.Interrogation, Quantity: 50 },
            { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 35 },
            { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 25 },
            { Kind: Statistic.Skill, Skill: Skill.Swimming, Quantity: 45 },
            { Kind: Statistic.Skill, Skill: Skill.Tactics, Subskill: Tactics.Infantry, Quantity: 50 },
          ].map<Experience>(exp => { return <Experience>{ ...exp, If: { Not: { Affiliation: 'Free Rasalhague' }}}}),
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 180 },
        ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 77,
          Notes: ['Continued on page 78.','Added subskill option for Prestidigitation because none was listed.', 'Added subskill option for Security Systems because none was listed.'] }
      }) ,new Background(2398, { Name: "Merchant",
        Prereq: { Or: [{ Field: 'Merchant' }, { And: [{ Kind: Statistic.Skill, Skill: Skill.Negotiation, Op: '>=', Exp: 50 }, { Kind: Statistic.Skill, Skill: Skill.Administration, Op: '>=', Exp: 50 }]}]},
        Cost: 900,
        Duration: 4,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -75 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Appraisal, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '*', Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '*', Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations, Quantity: 10 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 200 },
        ],
        Options: [
          { 
            Name: 'Free Trader',
            Experience: [
              { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
              { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
              { Kind: Statistic.Trait, Trait: Trait.ExtraIncome, Quantity: 50 },
              { Kind: Statistic.Trait, Trait: Trait.Gregarious, Quantity: 25 },
              { Kind: Statistic.Skill, Skill: Skill.Administration, Quantity: 25 },
              { Kind: Statistic.Skill, Skill: Skill.Appraisal, Quantity: 15 },
              { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 15 },
              { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 15 },
              { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 15 },
              { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 20 },
              { Pick: { Count: 5, Options: [
                ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
              ]}, Quantity: 20 }
            ],
            Citation: {
              Book: Book.ATimeOfWar,
              Page: 78,
              Notes: ['Due to system limitations the five skills are just any skill for now.'] }
          },
          { 
            Name: 'Merchant Master',
            Experience: [
              { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
              { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -125 },
              { Kind: Statistic.Trait, Trait: Trait.ExtraIncome, Quantity: 75 },
              { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 75 },
              { Kind: Statistic.Skill, Skill: Skill.Administration, Quantity: 15 },
              { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Merchant', Quantity: 20 },
              { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.Conventional, Quantity: 10 },
              { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Antiques', Quantity: 10 },
              { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 25 },
              { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 25 },
              { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 15 },
              { Pick: { Count: 6, Options: [
                ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
              ]}, Quantity: 35 }
            ],
            Citation: {
              Book: Book.ATimeOfWar,
              Page: 78,
              Notes: ['Due to system limitations the six skills are just any skill for now.'] }
          },
          { 
            Name: 'Deep Periphery Trader',
            Experience: [
              { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: -50 },
              { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
              { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 20 },
              { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -100 },
              { Kind: Statistic.Trait, Trait: Trait.ExceptionalAttribute, Attribute: Attribute.Edge, Quantity: 75 },
              { Kind: Statistic.Trait, Trait: Trait.GTolerance, Quantity: 75 },
              { Kind: Statistic.Skill, Skill: Skill.Administration, Quantity: 20 },
              { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 25 },
              { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 20 },
              { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 25 },
              { Kind: Statistic.Skill, Skill: Skill.MeleeWeapons, Quantity: 30 },
              { Kind: Statistic.Skill, Skill: Skill.SmallArms, Quantity: 25 },
              { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations, Quantity: 15 },
              { Pick: { Count: 5, Options: [
                ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
              ]}, Quantity: 25 }
            ],
            Citation: {
              Book: Book.ATimeOfWar,
              Page: 78,
              Notes: ['Due to system limitations the six skills are just any skill for now.'] }
          }
        ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 78 }
      }), new Background(2398, { Name: "Ne'er-Do-Well",
        Prereq: { IsClanner: false }, 
        Cost: 700,
        Duration: 4,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 75 },
          { Pick: { Count: 1, Options: 
            EnumMap(Attribute).filter(att => ![Attribute.Edge].includes(att))
            .map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: att }}) }, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.ExtraIncome, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -25 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -50 },
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Appraisal, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: 'Cooking', Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Disguise, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.EscapeArtist, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 35 },
          { Or: EnumMap(Prestidigitation).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Prestidigitation, Subskill: sub }}), Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Running, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Swimming, Quantity: 10 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 145, If: { Not: { Stage: 4, Name: "Ne'er-Do-Well"} } },
        ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 78,
          Notes: ['Added subskill option for Prestidigitation because none was listed.'] }
      }), /*new Background(2398, { Name: "Organized Crime",
        Cost: 1000,
        Duration: 5,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 85, If: { IsClanner: false } },
          { Kind: Statistic.Trait, Trait: Trait.AlternativeID, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.InForLife, Quantity: -150 },
          { Or: [{ Kind: Statistic.Trait, Trait: Trait.DarkSecret}, { Kind: Statistic.Trait, Trait: Trait.Compulsion, Trigger: 'Loyalty to Crime Boss'}], Quantity: -85},
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 60 },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill:'Criminal', Quantity: 100 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Demolitions, Quantity: 50 },
          { Or: EnumMap(Driving).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: sub }}), Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.EscapeArtist, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Forgery, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Sport', Quantity: 55 },
          { Kind: Statistic.Skill, Skill: Skill.Interrogation, Quantity: 85 },


          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 40 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.MartialArts, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation, Quantity: 35 },
          { Or: EnumMap(Prestidigitation).map<Stat>(sub => { return { Kind: Statistic.Skill, Skill: Skill.Prestidigitation, Subskill: sub }}), Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Running, Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 35 },
          { Kind: Statistic.Skill, Skill: Skill.Swimming, Quantity: 10 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 145, If: { Not: { Stage: 4, Name: "Ne'er-Do-Well"} } },
        ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 78,
          Notes: ['Added subskill option for Prestidigitation because none was listed.'] }
      })*/
    );
  }

  public At(when: number, stage: Exclude<Stage, 0 | 3>): BackgroundInfo[] {
    return this.Backgrounds[stage].flatMap(aff => aff.At((when - 2398) as Eternal) ?? [])
  }
}
