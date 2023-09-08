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
        if(type in edu) {
          names[type] = (edu[type]?.Options ?? []).flatMap(_edu => _edu.Name)
          types[type] = { Duration: edu[type]!.Duration, Options: fields.filter(field => names[type].includes(field.Name)) }
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
