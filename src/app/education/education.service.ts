import { Injectable } from '@angular/core';
import { FieldService } from './field.service';
import { Education, EducationType, EduInfo } from './education';
import { Attribute, Book, Driving, EnumMap, Eternal, Requirement, Skill, Stat, Statistic, Trait } from '../utils/common';
import { SkillField } from './field';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  Educations: Education[] = [];

  constructor(public fieldService: FieldService) {
    const asOpts = (names: string[]): (Pick<SkillField, 'Name'> & Partial<SkillField>)[] => {
      return names.map(name => { return { Name: name } });
    }

    const uniExtraReq: Requirement = { Not: { Or: [
      { Stage: 2, Name: 'Preparatory School' },
      { Stage: 1, Name: 'Nobility' },
      { Stage: 1, Name: 'White Collar' }
    ]}};

    const milAcadReq: Requirement = { Not: { Or: [
      { Stage: 2, Name: 'Preparatory School' },
      { Stage: 2, Name: 'Military School' },
    ]}};

    this.Educations.push(
      new Education(2398, { Name: 'Technical College',
        Cost: 600,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 150 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 30 },
          {
            Set: {
              Options: [
                ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att } }),
                ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait } }),
                ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill } })
              ]
            }, Quantity: 200
          }
        ],
        [EducationType.Basic]: {
          Duration: 1, Options: asOpts([
            'Communications', 'Pilot - Aerospace (Civilian)', 'Pilot - Aircraft (Civilian)',
            'Pilot - DropShip', 'Pilot - Exoskeleton', 'Technician - Civilian'])
        },
        [EducationType.Advanced]: {
          Duration: 2, Options: asOpts([
            'Cartographer', 'Engineer', 'Merchant Marine', 'Pilot - IndustrialMech',
            'Pilot - JumpShip', 'Technician - Aerospace', "Technician - 'Mech", 'Technician - Vehicle'
          ])
        },
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 72
        }
      }), new Education(2398, { Name: 'Trade School',
        Cost: 560,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 50 },
          { Or: EnumMap(Attribute).filter(att => att !== Attribute.Intelligence).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: att } }), Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 100 },
          { Pick: { Count: 3, Options: EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill } }) }, Quantity: 20 },
          {
            Set: {
              Options: [
                ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att } }),
                ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait } }),
                ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill } })
              ]
            }, Quantity: 200
          }
        ],
        [EducationType.Basic]: {
          Duration: 1, Options: asOpts([
            'General Studies', 'Merchant'])
        },
        [EducationType.Advanced]: {
          Duration: 2, Options: asOpts([
            'Analysis', 'Anthropologist', 'Archaeologist', 'Cartographer', 'Communications',
            'HPG Technician', 'Journalist', 'Manager', "Medical Assistant", 'Merchant Marine'
          ])
        },
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 72
        }
      }), new Education(2398, { Name: 'University',
        Cost: 710,
        Prereq: { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 },
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 150 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 75, If: uniExtraReq },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 25 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 25 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: -100, If: uniExtraReq },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 200 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 200, If: uniExtraReq },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 75 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -100, If: uniExtraReq },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -200 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -200, If: uniExtraReq },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 20 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 220 }
        ],
        [EducationType.Basic]: { Duration: 1, Options: asOpts([
          'Cartographer', 'Communications', 'General Studies', 'Manager', 'Scientist', 'Technician - Civilian'])},
        [EducationType.Advanced]: { Duration: 2, Options: asOpts([
          'Analysis', 'Anthropologist', 'Archaeologist', 'Detective', 'Engineer', 'HPG Technician', 
          'Planetary Surveyor', "Medical Assistant", 'Politician', 'Technician - Aerospace', 'Technician - Vehicle'])},
        [EducationType.Special]: { Duration: 2, Options: asOpts([
          'Doctor', 'Lawyer', 'Military Scientist', "Technician - 'Mech", "Technician - Military"])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 72,
          Notes: ['Additional exp found in Prereq section is not currently applied.'] } //TODO fix this
      }), new Education(2695, { Name: 'Solaris Internship',
        Cost: 700,
        Prereq: { Kind: Statistic.Trait, Trait: Trait.Connections, Op:'>=', Level: 2 },
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 150 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: 50 },
          { Or: EnumMap(Attribute).filter(att => ![Attribute.Charisma, Attribute.Edge].includes(att)).map(att => { return { Kind: Statistic.Attribute, Attribute: att }}), Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Enemy, Quantity: -50 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 100 },
          { Or: [{ Kind: Statistic.Trait, Trait: Trait.Equipped }, { Kind: Statistic.Trait, Trait: Trait.VehicleLevel }], Quantity: 100 },
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Solaris Games', Quantity: 30 },
          { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: 'Solaris', Quantity: 25 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 100 }
        ],
        [EducationType.Basic]: { Duration: 2, Options: asOpts([
          'Communications', 'Manager', 'Technician - Military'])},
        [EducationType.Advanced]: { Duration: 2, Options: asOpts([
          'Cavalry', 'Journalist', 'MechWarrior', 'Pilot - Battle Armor', 'Politician', "Technician - 'Mech"])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 72,
          Notes: ['Changed Streetwise skill to have Subskill of Solaris from any.', 'Changes introduction date based on data from sarna.net.'] } //TODO fix this
      }), new Education(2398, { Name: 'Police Academy',
        Cost: 680,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 100 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: Driving.Ground, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 25 },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 30 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 140 }
        ],
        [EducationType.Basic]: { Duration: 0.5, Options: asOpts([
          'Police Officer'])},
        [EducationType.Advanced]: { Duration: 1, Options: asOpts([
          'Analysis', 'Communications', 'Detective', 'Intelligence', "Technician - Military"])},
        [EducationType.Special]: { Duration: 2, Options: asOpts(['Covert Operations', 'Police Tactical Officer', 'Special Forces', 'Technician - Aerospace', 'Technician - Vehicle'])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 72,
          Notes: ['Changed Driving skill to have Subskill of Ground from none given.'] }
      }), new Education(2398, { Name: 'Intelligence Operative Training',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Op:'>=', Level: 5 },
                        { Kind: Statistic.Trait, Trait: Trait.Connections, Op:'>=', Level: 2 }]},
        Cost: 760,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 150 },
          { Or: EnumMap(Attribute).filter(att => ![Attribute.Intelligence, Attribute.Willpower].includes(att)).map(att => { return { Kind: Statistic.Attribute, Attribute: att }}), Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.AlternativeID, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 200 },
          { Kind: Statistic.Trait, Trait: Trait.InForLife, Quantity: -300 },
          { Kind: Statistic.Trait, Trait: Trait.Rank, Quantity: 250 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 50 },
          { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 20 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 150 }
        ],
        [EducationType.Basic]: { Duration: 1, Options: asOpts(['Basic Training'])},
        [EducationType.Advanced]: { Duration: 1, Options: asOpts([
          'Analysis', 'Covert Operations', 'Detective', 'Intelligence', "Police Officer", 'Scout'])},
        [EducationType.Special]: { Duration: 2, Options: asOpts(['Police Tactical Officer', 'Special Forces'])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 72,
          Notes: ['Continued on page 73.'] }
      }), new Education(2398, { Name: 'Military Academy',
        Cost: 830,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100, If: milAcadReq},
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: -100, If: milAcadReq},
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 200, If: milAcadReq },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: -100, If: milAcadReq },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: -100, If: milAcadReq },
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 125 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Rank, Quantity: 200 },
          { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Swimming, Quantity: 10 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 100 }
        ],
        [EducationType.Basic]: { Duration: 1, Options: asOpts(['Basic Training', 'Basic Training - Naval'])},
        [EducationType.Advanced]: { Duration: 1, Options: asOpts([
          'Analysis', 'Cavalry', 'Infantry', 'Marine', "MechWarrior", 'Pilot - Aerospace (Combat)', 'Pilot - Aircraft (Combat)', 'Pilot - Dropship', 'Scientist', 'Scout', "Ship's Crew"])},
        [EducationType.Special]: { Duration: 2, Options: asOpts(['Doctor', "Infantry - Anti 'Mech", 'Military Scientist', 'Pilot - Battle Armor', 'Pilot - Jumpship', 'Special Forces'])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 73 }
      }), new Education(2398, { Name: 'Military Enlistment',
        Cost: 720,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 125 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 125 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: -100 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Rank, Quantity: 100 },
          { Kind: Statistic.Skill, Skill: Skill.Swimming, Quantity: 10 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 200 }
        ],
        [EducationType.Basic]: { Duration: 0.5, Options: asOpts(['Basic Training', 'Basic Training - Naval'])},
        [EducationType.Advanced]: { Duration: 1, Options: asOpts([
          'Cavalry', 'Infantry', 'Marine', 'Medical Assistant', 'Police Officer', 'Scout', "Ship's Crew", 'Technician - Military'])},
        [EducationType.Special]: { Duration: 2, Options: asOpts(['Police Tactical Officer', "Infantry - Anti 'Mech", 'Special Forces',
          'Technician - Aerospace', "Technican - 'Mech", 'Technician - Vehicle'])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 73 }
      }), new Education(2398, { Name: 'Family Training',
        Prereq: { Or: [{ Stage: 2, Name:'Preparatory School'}, { Stage: 2, Name:'Military School'}, 
          { Kind: Statistic.Trait, Trait: Trait.Connections, Op: '>=', Level: 1 }]},
        Cost: 570,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 75 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 75 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Quantity: 50 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Rank, Quantity: 100 },
          { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: Driving.Ground, Quantity: 15 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Homeworld History', Quantity: 20 }, //Should this be a special input like how * and ! are?
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 15 }, 
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*', Quantity: 20 }, //Should this be a special input like how * and ! are?
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 100 }
        ],
        [EducationType.Basic]: { Duration: 0.5, Options: asOpts(['Basic Training', 'Basic Training - Naval'])},
        [EducationType.Advanced]: { Duration: 1, Options: asOpts(['Cavalry', 'Infantry', 'Marine', 'MechWarrior', 
          'Pilot - Aerospace (Combat)', 'Pilot - Aircraft (Combat)', 'Pilot - Dropship', 'Scout', "Ship's Crew"])},
        [EducationType.Special]: { Duration: 2, Options: asOpts(["Infantry - Anti 'Mech", 'Special Forces', 'Pilot - Jumpship'])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 73,
          Notes: ['Changed Driving skill to have Subskill of Ground from none given.', 'Changed Survival skill to have Subskill of any from none given.'] }
      }), new Education(2398, { Name: 'Officer Candidate School',
        Prereq: { And: [{ Or: ['Police Academy', 'Intelligence Operative Training', 'Military Academy', 'Military Enlistment', 'Family Training'].map(edu => { return { Stage: 3, Name: edu}})},
          { Field: { Level: EducationType.Basic }}, { Field: { Level: EducationType.Advanced }}] },
        Cost: 550,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: -200 },
          { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Rank, Quantity: 250 },
          { Kind: Statistic.Trait, Trait: Trait.Reputation, Quantity: 50 },
          { Kind: Statistic.Trait, Trait: Trait.Wealth, Quantity: 100 },
          { Kind: Statistic.Skill, Skill: Skill.Leadership, Quantity: 10 },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 25 }, 
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 115 }
        ],
        [EducationType.Basic]: { Duration: 0.5, Options: asOpts(['Officer Training'])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 73,
          Notes: ['Changed Driving skill to have Subskill of Ground from none given.', 'Changed Survival skill to have Subskill of any from none given.'] }
      })
    )
  }

  public At(when: number): EducationInfo[] {
    //We want to make sure we use the most current version of the Fields
    const fields = this.fieldService.At(when);
    const edui = this.Educations.flatMap<EduInfo>(edu => edu.At((when - 2398) as Eternal) ?? []);
    return edui.map<EducationInfo>(edu => {
      const names: { [value in EducationType]: string[] } = {
        [EducationType.Basic]: [],
        [EducationType.Advanced]: [],
        [EducationType.Special]: []
      }
      const partial: Omit<EduInfo, EducationType> = { ...edu };
      const types: Partial<Record<EducationType, {
        Duration: number,
        Options: SkillField[]
      }>> = {};
      EnumMap(EducationType).forEach((type: EducationType) => {
        if (type in edu && edu[type] !== undefined) {
          const temp = edu[type];

          names[type] = (edu[type]?.Options ?? []).flatMap(_edu => _edu.Name);
          if (temp) {
            types[type] = { Duration: temp.Duration, Options: fields.filter(field => names[type].includes(field.Name)) }
          }
        };
      });
      return {
        ...partial,
        ...types
      }
    });
  }
}

export type EducationInfo = Omit<EduInfo, EducationType> & Partial<Record<EducationType, {
  Duration: number,
  Options: SkillField[]
}>>
