import { Injectable } from '@angular/core';
import { FieldService } from './field.service';
import { Education, EducationType, EduInfo } from './education';
import { Attribute, Book, EnumMap, Eternal, Requirement, Skill, Stat, Statistic, Trait } from '../utils/common';
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

    const uniExtraReq: Requirement = { Or: [
      { Stage: 2, Name: 'Preparatory School' },
      { Stage: 1, Name: 'Nobility' },
      { Stage: 1, Name: 'White Collar' }
    ]}

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
