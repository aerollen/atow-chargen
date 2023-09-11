import { Injectable } from '@angular/core';
import { FieldService } from './field.service';
import { Education, EducationType, EduInfo } from './education';
import { Attribute, Book, EnumMap, Eternal, Skill, Stat, Statistic, Trait } from '../utils/common';
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

    this.Educations.push(
      new Education(2398, { Name: 'Technical College',
        Cost: 600,
        Experience: [
          { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Quantity: 100 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 100 },
          { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 150 },
          { Kind: Statistic.Skill, Skill: Skill.Computers, Quantity: 20 },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*', Quantity: 30 },
          { Set: { Options: [
            ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
            ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
            ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
          ]}, Quantity: 200 }
        ],
        [EducationType.Basic]: { Duration: 1, Options: asOpts([
          'Communications', 'Pilot - Aerospace (Civilian)', 'Pilot - Aircraft (Civilian)', 
          'Pilot - DropShip', 'Pilot - Exoskeleton', 'Technician - Civilian'])},
        [EducationType.Advanced]: { Duration: 2, Options: asOpts([
          'Cartographer', 'Engineer', 'Merchant Marine', 'Pilot - IndustrialMech',
          'Pilot - JumpShip', 'Technician - Aerospace', "Technician - 'Mech", 'Technician - Vehicle'
        ])},
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 72 }
      }), new Education(2398, { Name: 'Trade School',
      Cost: 560,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Quantity: 50 },
        { Or: EnumMap(Attribute).filter(att => att !== Attribute.Intelligence).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: att }}), Quantity: 100 },
        { Kind: Statistic.Trait, Trait: Trait.Connections, Quantity: 50 },
        { Kind: Statistic.Trait, Trait: Trait.Equipped, Quantity: 100 },
        { Pick: { Count: 3, Options: EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})}, Quantity: 20 },
        { Set: { Options: [
          ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
          ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
          ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
        ]}, Quantity: 200 }
      ],
      [EducationType.Basic]: { Duration: 1, Options: asOpts([
        'General Studies', 'Merchant'])},
      [EducationType.Advanced]: { Duration: 2, Options: asOpts([
        'Analysis', 'Anthropologist', 'Archaeologist', 'Cartographer', 'Communications', 
        'HPG Technician', 'Journalist', 'Manager', "Medical Assistant", 'Merchant Marine'
      ])},
      Citation: {
        Book: Book.ATimeOfWar,
        Page: 72 }
    })
    )
  }

  public At(when: number): EducationInfo[] {
    //We want to make sure we use the most current version of the Fields
    const fields = this.fieldService.At(when);
    const edui = this.Educations.flatMap<EduInfo>(edu => edu.At((when - 2398) as Eternal) ?? []);
    return edui.map<EducationInfo>(edu => {
      const names: { [value in EducationType]: string[] }  = {
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
        if(type in edu && edu[type] !== undefined) {
          const temp = edu[type];

          names[type] = (edu[type]?.Options ?? []).flatMap(_edu => _edu.Name);
          if(temp) {
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
