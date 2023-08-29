import { Pipe, PipeTransform } from '@angular/core';
import { Acrobatics, AnimalHandling, Communications, Attribute, Skill, Stat, Statistic, Trait, Driving, Gunnery, MedTech, Navigation, Piloting, Prestidigitation, SecuritySystem, Surgery, Tactics, Technician, ThrownWeapons, Tracking } from './common';

@Pipe({
  name: 'stat'
})
export class StatPipe implements PipeTransform {

  transform(value: Stat | undefined, split?:{
    value: string,
    index: number
  }): string {
    if(!value) return 'undefined';

    if(split) {
      return this.transform(value).split(split.value)[split.index];
    }

    switch(value.Kind) {
      case Statistic.Attribute:
        const atts = Object.values(Attribute);
        return atts[value.Attribute.valueOf()].toString();
      case Statistic.Skill:
        const skill = Object.values(Skill)[value.Skill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim();
        const speciality = value.Speciality
          ? `(${value.Speciality})`
          : '';
        const hasSubskillDefined = 'Subskill' in value;
        switch(value.Skill) {
          case Skill.Acrobatics:
            const acrobatics = hasSubskillDefined ? Object.values(Acrobatics)[(value.Subskill as Acrobatics).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${acrobatics} ${speciality}`.trim();
          case Skill.AnimalHandling:
            const animalHandling = hasSubskillDefined ? Object.values(AnimalHandling)[(value.Subskill as AnimalHandling).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${animalHandling} ${speciality}`.trim();
          case Skill.Communications:
            const communications = hasSubskillDefined ? Object.values(Communications)[(value.Subskill as Communications).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${communications} ${speciality}`.trim();
          case Skill.Driving:
            const driving = hasSubskillDefined ? Object.values(Driving)[(value.Subskill as Driving).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${driving} ${speciality}`.trim();
          case Skill.Gunnery:
            const gunnery = hasSubskillDefined ? Object.values(Gunnery)[(value.Subskill as Gunnery).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${gunnery} ${speciality}`.trim();
          case Skill.MedTech:
            const medTech = hasSubskillDefined ? Object.values(MedTech)[(value.Subskill as MedTech).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${medTech} ${speciality}`.trim();
          case Skill.Navigation:
            const navigation = hasSubskillDefined ? Object.values(Navigation)[(value.Subskill as Navigation).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${navigation} ${speciality}`.trim();
          case Skill.Piloting:
            const piloting = hasSubskillDefined ? Object.values(Piloting)[(value.Subskill as Piloting).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${piloting} ${speciality}`.trim();
          case Skill.Prestidigitation:
            const prestidigitation = hasSubskillDefined ? Object.values(Prestidigitation)[(value.Subskill as Prestidigitation).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${prestidigitation} ${speciality}`.trim();
          case Skill.SecuritySystem:
            const securitySystem = hasSubskillDefined ? Object.values(SecuritySystem)[(value.Subskill as SecuritySystem).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${securitySystem} ${speciality}`.trim();
          case Skill.Surgery:
            const surgery = hasSubskillDefined ? Object.values(Surgery)[(value.Subskill as Surgery).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${surgery} ${speciality}`.trim();
          case Skill.Tactics:
            const tactics = hasSubskillDefined ? Object.values(Tactics)[(value.Subskill as Tactics).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${tactics} ${speciality}`.trim();
          case Skill.Technician:
            const technician = hasSubskillDefined ? Object.values(Technician)[(value.Subskill as Technician).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${technician} ${speciality}`.trim();
          case Skill.ThrownWeapons:
            const thrownWeapons = hasSubskillDefined ? Object.values(ThrownWeapons)[(value.Subskill as ThrownWeapons).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim(): '';
            return `${skill}/${thrownWeapons} ${speciality}`.trim();
          case Skill.Tracking:
            const tracking = hasSubskillDefined ? Object.values(Tracking)[(value.Subskill as Tracking).valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${tracking} ${speciality}`.trim();
          default:
            const subskill = 'Subskill' in value
              ? `/${hasSubskillDefined ? value.Subskill : ''}`
              : '';
            return `${skill}${subskill} ${speciality}`.trim();
        }
      case Statistic.Trait:
        const trait = Object.values(Trait)[value.Trait.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim();
        switch(value.Trait) {
          case Trait.Compulsion:
            const compulstionTrigger = 'Trigger' in value ? value.Trigger : '';
            return `${trait}/${compulstionTrigger}`;
          case Trait.ExceptionalAttribute:
            const exceptionalAttribute = 'Attribute' in value ? Object.values(Attribute)[value.Attribute] : '';
            return `${trait}/${exceptionalAttribute}`;
          case Trait.NaturalAptitude:
            const naturalAptitude = 'Skill' in value ? Object.values(Skill)[value.Skill].toString().replace(/([A-Z]+)/g, ' $1').replace(/([A-Z])([A-Z])/g, '$1-$2').trim() : '';
            return `${trait}/${naturalAptitude}`;
          default: return trait;
        }
      default:
        //Maybe its json for some reason?
        let ret = 'ERROR'
        try {
          const json = JSON.parse(value);
          ret = this.transform(json, split);
        }
        finally {
          return ret;
        }
    }
  }
}
