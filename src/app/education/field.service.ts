import { Injectable } from '@angular/core';
import { Field, SkillField } from './field';
import { Attribute, Book, Communications, Driving, EnumMap, Eternal, MedTech, Navigation, Piloting, Skill, Statistic, Surgery, Technician, Tracking, Trait } from '../utils/common';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  Fields: Field[] = [];
  constructor() { 
    this.Fields.push(
      new Field(2398, { Name: 'Anthropology',
        Prereq: { And: [{ Field: 'General Studies' }, 
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Anthropologist' },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: /History of $1/ },
          { Kind: Statistic.Skill, Skill: Skill.Investigation },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*' },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*' },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '*' } ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82 }
      }), new Field(2398, { Name: 'Archaeologist',
        Prereq: { And: [{ Field: 'General Studies' }, 
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Archaeologist' },
          { Kind: Statistic.Skill, Skill: Skill.Appraisal },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Geology' },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: /History of $1/ },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Ground },
          { Kind: Statistic.Skill, Skill: Skill.Perception } ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82 }
      }), new Field(2398, { Name: 'Cartographer',
        Prereq: { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 },
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Cartographer' },
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Air },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Ground },
          { Kind: Statistic.Skill, Skill: Skill.Perception },
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations } ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82 }
      }), new Field(2398, { Name: 'Communications',
        Prereq: { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 },
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Acting },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Communications' },
          { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.Conventional },
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '*' },
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations } ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82 }
      }), new Field(2398, { Name: 'Doctor',
        Prereq: { And: [{ Or: ['Medical Assistant', 'Scientist'].map(req => { return { Field: req }})},
          { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Op:'>=', Level: 4 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 5 },
          { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Op:'>=', Level: 3 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Administration },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Doctor' },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!' },
          { Kind: Statistic.Skill, Skill: Skill.Surgery, Subskill: Surgery.General } ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82,
          Notes: ['Added subskill General for MedTech as none was provided.', 
                  'Added subskill General for Surgery as none was provided.']}
      }), new Field(2398, { Name: 'Engineer',
        Prereq: { And: [
          { Or: ['Civilian', 'Military'].map(req => { return { Field: `Technician - ${req}` }})},
          { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Appraisal },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Engineer' },
          { Kind: Statistic.Skill, Skill: Skill.Perception },
          { Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: Technician.Nuclear },
          ...EnumMap(Technician).filter(sub => sub !== Technician.Nuclear).map<SkillType>(sub => { return {
            Kind:Statistic.Skill, Skill: Technician, Subskill: sub }}) ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82,
          Notes: ['Removed subskill Nuclear for Technician so it is not duplicated.']}
      }), new Field(2398, { Name: 'General Studies',
        Prereq: { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 3 },
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: '*' },
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: '*' },
          { Kind: Statistic.Skill, Skill: Skill.Perception },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!' } ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82,
          Notes: ['Ignored part that reads "at least one other Skill related to those shown below" because is was unclear.']}
      }), new Field(2398, { Name: 'HPG Technician',
        Prereq: { And:[
          { Or: [
              ...['ComStar', 'Word of Blake'].map(aff => { return { Affiliation: aff}}), 
                                                                  { IsClanner: true }]},
          { Field: 'Communications' }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Administration },
          { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.Conventional },
          { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.BlackBox },
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          { Kind: Statistic.Skill, Skill: Skill.Cryptography } ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82 }
      }), new Field(2398, { Name: 'Journalist',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Op:'>=', Level: 4 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Acting },
          { Kind: Statistic.Skill, Skill: Skill.Art, Subskill: 'Writing' },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Journalist' },
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          { Kind: Statistic.Skill, Skill: Skill.Investigation },
          { Kind: Statistic.Skill, Skill: Skill.Perception } ],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82 }
      }), new Field(2398, { Name: 'Lawyer',
        Prereq: { And: [{ Field: 'General Studies'},
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Op:'>=', Level: 4 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Op:'>=', Level: 5 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Acting },
          { Kind: Statistic.Skill, Skill: Skill.Administration },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Lawyer' },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Law' },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '*' }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82 }
      }), new Field(2398, { Name: 'Manager',
        Prereq: { And: [{ Field: 'General Studies'},
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Op:'>=', Level: 3 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Administration },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Management' },
          { Kind: Statistic.Skill, Skill: Skill.Leadership },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!' },
          { Kind: Statistic.Skill, Skill: Skill.Training }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82,
          Notes: ['Reduced Intelligence requirment to 3 from 5.', 'Reduced Charisma requirment to 3 from 5.']}
      }), new Field(2398, { Name: 'Medical Assistant',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'MedTech' },
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          { Kind: Statistic.Skill, Skill: Skill.Interest, Subskill: 'Pharmacology' },
          { Kind: Statistic.Skill, Skill: Skill.MedTech, Subskill: MedTech.General },
          { Kind: Statistic.Skill, Skill: Skill.Perception }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82,
          Notes: ['Added subskill General for MedTech as none was provided.']}
      }), new Field(2398, { Name: 'Merchant',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Op:'>=', Level: 3 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Administration },
          { Kind: Statistic.Skill, Skill: Skill.Appraisal },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Merchant' },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '*' },
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '*' }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82,
          Notes: ['Added subskill General for MedTech as none was provided.']}
      }), new Field(2398, { Name: 'Merchant Marine',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Op:'>=', Level: 3 },
                        { Kind: Statistic.Trait, Trait: Trait.TDS, Op: '=', Level: 0 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Merchant Marine' },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '*' },
          { Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: Technician.Aeronautics },
          ...EnumMap(Technician).filter(sub => sub !== Technician.Aeronautics).map<SkillType>(sub => { return {
            Kind:Statistic.Skill, Skill: Technician, Subskill: sub }}),
          { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82,
          Notes: ['Removed subskill Aeronautics for Technician so it is not duplicated.']}
      }), new Field(2398, { Name: 'Pilot - Aerospace (Civilian)',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Op:'>=', Level: 4 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 3 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Aerospace Pilot' },
          { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.Conventional },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Air },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Space },
          { Kind: Statistic.Skill, Skill: Skill.Piloting, Subskill: Piloting.Aerospace },
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 82,
          Notes: ['Removed subskill Aeronautics for Technician so it is not duplicated.']}
      }), new Field(2398, { Name: 'Pilot - Aircraft (Civilian)',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Op:'>=', Level: 4 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Aircraft Pilot' },
          { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.Conventional },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Air },
          { Or: [Piloting.Aircraft, Piloting.VTOL].map<SkillType>(sub => { return { 
            Kind: Statistic.Skill, Skill: Skill.Piloting, Subskill: sub }})},
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: 'Pilot - DropShip',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Op:'>=', Level: 4 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Willpower, Op:'>=', Level: 3 },
                        { Kind: Statistic.Trait, Trait: Trait.TDS, Op: '=', Level: 0 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'DropShip Pilot' },
          { Kind: Statistic.Skill, Skill: Skill.Communications, Subskill: Communications.Conventional },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Space },
          { Kind: Statistic.Skill, Skill: Skill.Piloting, Subskill: Piloting.Spacecraft },
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations },
          { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: 'Pilot - Exoskeleton',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op:'>=', Level: 5 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Body, Op:'>=', Level: 5 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Piloting, Subskill: Piloting.Battlesuit },
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations },
          ...[Technician.Electronics, Technician.Mechanical, Technician.Myomer].map<SkillType>(sub => { return {
            Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: sub }})],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: 'Pilot - IndustrialMech',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Op:'>=', Level: 3 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Piloting, Subskill: Piloting.Mech },
          { Kind: Statistic.Skill, Skill: Skill.SensorOperations },
          ...[Technician.Electronics, Technician.Mechanical, Technician.Myomer].map<SkillType>(sub => { return {
            Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: sub
          }})],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: 'Pilot - JumpShip',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 5 },
                        { Field: 'Pilot - DropShip' },
                        { Kind: Statistic.Trait, Trait: Trait.TDS, Op: '=', Level: 0 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Administration },
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.KFJump },
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Space }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: 'Planetary Surveyor',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 6 },
                        { Field: 'Scientist' }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Appraisal },
          { Or: [{ Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: Driving.Ground },
                 { Kind: Statistic.Skill, Skill: Skill.Driving, Subskill: Driving.Sea }]},
          { Kind: Statistic.Skill, Skill: Skill.Navigation, Subskill: Navigation.Ground },
          { Kind: Statistic.Skill, Skill: Skill.Survival, Subskill: '*' },
          { Kind: Statistic.Skill, Skill: Skill.Tracking, Subskill: Tracking.Wilds }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83,
          Notes: ['Excluded subskill Rail for Driving skill choice.']}
      }), new Field(2398, { Name: 'Politician',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Op:'>=', Level: 4 },
                        { Field: 'Manager' }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Acting },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Politician' },
          { Kind: Statistic.Skill, Skill: Skill.Leadership },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!' }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: 'Scientist',
        Prereq: { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 },
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Acting },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Politician' },
          { Kind: Statistic.Skill, Skill: Skill.Leadership },
          { Kind: Statistic.Skill, Skill: Skill.Negotiation },
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!' }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: 'Technician - Aerospace',
        Prereq: { And: [{ Or: ['Civilian', 'Military'].map(req => { return { Field: `Technician - ${req}` }})},
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          ...[Technician.Aeronautics, Technician.Nuclear, Technician.Jets].map<SkillType>(sub => { return {
            Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: sub }}),
            { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: 'Technician - Civilian',
        Prereq: { And: [{ Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 3 },
                        { Kind: Statistic.Attribute, Attribute: Attribute.Dexterity, Op:'>=', Level: 3 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Appraisal },
          { Kind: Statistic.Skill, Skill: Skill.Career, Subskill: 'Technician' },
          ...[Technician.Electronics, Technician.Mechanical, Technician.Nuclear].map<SkillType>(sub => { return {
            Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: sub }}),
            { Kind: Statistic.Skill, Skill: Skill.ZeroGOperations }],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: "Technician - 'Mech",
        Prereq: { And: [{ Or: ['Civilian', 'Military'].map(req => { return { Field: `Technician - ${req}` }})},
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 }]},
        Skills: [Technician.Electronics, Technician.Jets, Technician.Mechanical, Technician.Myomer, Technician.Nuclear].map<SkillType>(sub => { return {
          Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: sub }}),
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      }), new Field(2398, { Name: "Technician - 'Vehicle",
        Prereq: { And: [{ Or: ['Civilian', 'Military'].map(req => { return { Field: `Technician - ${req}` }})},
                        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op:'>=', Level: 4 }]},
        Skills: [
          { Kind: Statistic.Skill, Skill: Skill.Computers },
          ...[Technician.Electronics, Technician.Mechanical, Technician.Nuclear].map<SkillType>(sub => { return {
            Kind: Statistic.Skill, Skill: Skill.Technician, Subskill: sub }})],
        Citation: {
          Book: Book.ATimeOfWar,
          Page: 83 }
      })
    )
  }

  public At(when: number): SkillField[] {
    return this.Fields.flatMap<SkillField>(field => field.At((when - 2398) as Eternal) ?? []);
  }
}

type SkillType = SkillField["Skills"][keyof SkillField["Skills"]];