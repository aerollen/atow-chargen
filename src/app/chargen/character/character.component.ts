import { Component, ViewChild, ElementRef, ChangeDetectorRef, Input, EventEmitter, Output, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Acrobatics, AnimalHandling, Archtype, Attribute, Communications, Driving, EnumMap, Experience, Gunnery, MedTech, Navigation, OneOrBoth, Piloting, Prestidigitation, Requirment, SecuritySystem, Skill, Stage, Statistic, Surgery, Tactics, Technician, ThrownWeapons, Tracking, Trait } from "src/app/utils/common";
import { Character } from "../../character/character"
import { Subject, Subscription } from "rxjs";
import { Stage0Component } from "../stages/stage0/stage0.component";
import { Stage1Component } from "../stages/stage1/stage1.component";
import { VitalsComponent } from "./vitals/vitals.component";
import { Stage2Component } from "../stages/stage2/stage2.component";

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input({ required: true }) character!: Character;
  @Output() characterChanged = new EventEmitter<Character>();
  @Output() archtypeChanged = new EventEmitter<Archtype>();

  @ViewChild('stageZero') stageZero!: Stage0Component;
  @ViewChild('stageOne') stageOne!: Stage1Component;
  @ViewChild('stageTwo') stageTwo!: Stage2Component;

  @ViewChild('itemizedExp') itemizedExp!: ElementRef<HTMLInputElement>;
  @ViewChild('vitals') vitals!: VitalsComponent;

  get progress(): { [value in Stage]: boolean } {
    return {
      0: this.stageZero?.isComplete ?? false,
      1: this.stageOne?.isComplete ?? false,
      2: this.stageTwo?.isComplete ?? false,
      3: false,
      4: false
    }
  }

  get isComplete(): boolean {
    return Object.values(this.progress).reduce((a, b) => a && b, true);
  }

  private subscriptions: Subscription[] = [];
  constructor(private ref: ChangeDetectorRef) {

  }

  get TotalExp(): number {
    const ret = [...this.Experience].reduce((a, b) => a + b.Quantity, 0);
    return ret;
  }

  //This is a bit of a monster, maybe it needs to be refactored
  get Experience(): Experience[] {
    // Maybe take another look at this and see if leveraging the Extract utility type would make sense here instead of doing everything by hand.
    const OrExperience: Array<Experience> = [];
    const PickExperience: Array<Experience> = [];
    const SetExperience: Array<Experience> = [];
    const AttributeExperience: {
      [Value in Attribute]: number
    } = {
      [Attribute.Strength]: 0,
      [Attribute.Body]: 0,
      [Attribute.Dexterity]: 0,
      [Attribute.Reflexes]: 0,
      [Attribute.Intelligence]: 0,
      [Attribute.Willpower]: 0,
      [Attribute.Charisma]: 0,
      [Attribute.Edge]: 0
    };
    const SkillExperience: {
      [S in Skill]: 
        ( S extends Skill.Acrobatics ? { [Subskill in Acrobatics]: { Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.AnimalHandling ? { [Subskill in AnimalHandling]: { Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Communications ? { [Subskill in Communications]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Driving ? { [Subskill in Driving]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Gunnery ? { [Subskill in Gunnery]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.MedTech ? { [Subskill in MedTech]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Navigation ? { [Subskill in Navigation]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Piloting ? { [Subskill in Piloting]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Prestidigitation ? { [Subskill in Prestidigitation]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.SecuritySystem ? { [Subskill in SecuritySystem]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Surgery ? { [Subskill in Surgery]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Tactics ? { [Subskill in Tactics]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Technician ? { [Subskill in Technician]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.ThrownWeapons ? { [Subskill in ThrownWeapons]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends Skill.Tracking ? { [Subskill in Tracking]:{ Quantity: number, Speciality?: Record<'Speciality', number>[]}}
        : S extends (Skill.Language | Skill.Career | Skill.Protocol | Skill.Streetwise | Skill.Survival | Skill.Art | Skill.Interest) ? {
          [Subskill: string]: { Quantity: number, Speciality?: Record<'Speciality', number>[]}
        }
        :  { Quantity: number, Speciality?: Record<'Speciality', string>[]})
    } = {
      [Skill.Acrobatics]: {
        [Acrobatics.FreeFall]: { Quantity: 0 },
        [Acrobatics.Gymnastics]: { Quantity: 0 }},
      [Skill.Acting]: { Quantity: 0 },
      [Skill.Administration]: { Quantity: 0 },
      [Skill.AnimalHandling]: {
        [AnimalHandling.Herding]: { Quantity: 0 },
        [AnimalHandling.Riding]: { Quantity: 0 },
        [AnimalHandling.Training]: { Quantity: 0 }},
      [Skill.Appraisal]: { Quantity: 0 },
      [Skill.Archery]: { Quantity: 0 },
      [Skill.Art]: {},
      [Skill.Artillery]: { Quantity: 0 },
      [Skill.Career]: {},
      [Skill.Climbing]: { Quantity: 0 },
      [Skill.Communications]: {
        [Communications.BlackBox]: { Quantity: 0 },
        [Communications.Conventional]: { Quantity: 0 },
        [Communications.HyperpuseGenerator]: { Quantity: 0 }},
      [Skill.Computers]: { Quantity: 0 },
      [Skill.Cryptography]: { Quantity: 0 },
      [Skill.Demolitions]: { Quantity: 0 },
      [Skill.Disguise]: { Quantity: 0 },
      [Skill.Driving]: { 
        [Driving.Ground]: { Quantity: 0 },
        [Driving.Rail]: { Quantity: 0 },
        [Driving.Sea]: { Quantity: 0 }},
      [Skill.EscapeArtist]: { Quantity: 0 },
      [Skill.Forgery]: { Quantity: 0 },
      [Skill.Gunnery]: {
        [Gunnery.Aerospace]: { Quantity: 0 },
        [Gunnery.Air]: { Quantity: 0 },
        [Gunnery.Battlesuit]: { Quantity: 0 },
        [Gunnery.Ground]: { Quantity: 0 },
        [Gunnery.Mech]: { Quantity: 0 },
        [Gunnery.ProtoMech]: { Quantity: 0 },
        [Gunnery.Sea]: { Quantity: 0 },
        [Gunnery.Spacecraft]: { Quantity: 0 },
        [Gunnery.Turret]: { Quantity: 0 }},
      [Skill.Interest]: { },
      [Skill.Interrogation]: { Quantity: 0 },
      [Skill.Investigation]: { Quantity: 0 },
      [Skill.Language]: {},
      [Skill.Leadership]: { Quantity: 0 },
      [Skill.MartialArts]:{ Quantity: 0 },
      [Skill.MedTech]: {
        [MedTech.General]: { Quantity: 0 },
        [MedTech.Veterinary]: { Quantity: 0 }},
      [Skill.MeleeWeapons]:{ Quantity: 0 },
      [Skill.Navigation]: {
        [Navigation.Air]: { Quantity: 0 },
        [Navigation.Ground]: { Quantity: 0 },
        [Navigation.KFJump]: { Quantity: 0 },
        [Navigation.Sea]: { Quantity: 0 },
        [Navigation.Space]: { Quantity: 0 }},
      [Skill.Negotiation]: { Quantity: 0 },
      [Skill.Perception]: { Quantity: 0 },
      [Skill.Piloting]: {
        [Piloting.Aerospace]: { Quantity: 0 },
        [Piloting.Aircraft]: { Quantity: 0 },
        [Piloting.Battlesuit]: { Quantity: 0 },
        [Piloting.Ground]: { Quantity: 0 },
        [Piloting.Mech]: { Quantity: 0 },
        [Piloting.ProtoMech]: { Quantity: 0 },
        [Piloting.Railcraft]: { Quantity: 0 },
        [Piloting.Seacraft]: { Quantity: 0 },
        [Piloting.Spacecraft]: { Quantity: 0 }},
      [Skill.Prestidigitation]: {
        [Prestidigitation.PickPocket]: { Quantity: 0 },
        [Prestidigitation.Quickdraw]: { Quantity: 0 },
        [Prestidigitation.SleightOfHand]: { Quantity: 0 }},
      [Skill.Protocol]: {},
      [Skill.Running]: { Quantity: 0 },
      [Skill.Science]: { Quantity: 0 },
      [Skill.SecuritySystem]: {
        [SecuritySystem.Electrical]: { Quantity: 0 },
        [SecuritySystem.Mechanical]: { Quantity: 0 }},
      [Skill.SensorOperations]: { Quantity: 0 },
      [Skill.SmallArms]: { Quantity: 0 },
      [Skill.Stealth]: { Quantity: 0 },
      [Skill.Streetwise]: {},
      [Skill.SupportWeapons]: { Quantity: 0 },
      [Skill.Surgery]: {
        [Surgery.General]: { Quantity: 0 },
        [Surgery.Veterinary]: { Quantity: 0 }},
      [Skill.Survival]: {},
      [Skill.Swimming]: { Quantity: 0 },
      [Skill.Tactics]: {
        [Tactics.Air]: { Quantity: 0 },
        [Tactics.Infantry]: { Quantity: 0 },
        [Tactics.Land]: { Quantity: 0 },
        [Tactics.Sea]: { Quantity: 0 },
        [Tactics.Space]: { Quantity: 0 }},
      [Skill.Technician]: {
        [Technician.Aeronautics]: { Quantity: 0 },
        [Technician.Cybernetics]: { Quantity: 0 },
        [Technician.Electronics]: { Quantity: 0 },
        [Technician.Jets]: { Quantity: 0 },
        [Technician.Mechanical]: { Quantity: 0 },
        [Technician.Myomer]: { Quantity: 0 },
        [Technician.Nuclear]: { Quantity: 0 },
        [Technician.Weapons]: { Quantity: 0 }},
      [Skill.ThrownWeapons]: {
        [ThrownWeapons.Blades]: { Quantity: 0 },
        [ThrownWeapons.Blunt]: { Quantity: 0 },
        [ThrownWeapons.Spear]: { Quantity: 0 }},
        [Skill.Tracking]: {
          [Tracking.Urban]: { Quantity: 0 },
          [Tracking.Wilds]: { Quantity: 0 }},
      [Skill.Training]: { Quantity: 0 },
      [Skill.ZeroGOperations]: { Quantity: 0 },
    };
    const TraitExperience: {
      [T in Trait]:
        ( T extends Trait.Compulsion ? { [Trigger: string]: number } 
        : T extends Trait.ExceptionalAttribute ? { [Value in Attribute]: number }
        : T extends Trait.NaturalAptitude ? { [Value in Skill]: number }
        : number)
    } = {
      [Trait.AlternativeID]: 0,
      [Trait.Ambidextrous]: 0,
      [Trait.AnimalEmpathy]: 0,
      [Trait.Attractive]: 0,
      [Trait.Citizenship]: 0,
      [Trait.Trueborn]: 0,
      [Trait.CombatSense]: 0,
      [Trait.Connections]: 0,
      [Trait.ExceptionalAttribute]: {
        [Attribute.Strength]: 0,
        [Attribute.Body]: 0,
        [Attribute.Dexterity]: 0,
        [Attribute.Reflexes]: 0,
        [Attribute.Intelligence]: 0,
        [Attribute.Willpower]: 0,
        [Attribute.Charisma]: 0,
        [Attribute.Edge]: 0
      },
      [Trait.FastLearner]: 0,
      [Trait.Fit]: 0,
      [Trait.GTolerance]: 0,
      [Trait.GoodHearing]: 0,
      [Trait.GoodVision]: 0,
      [Trait.Gregariousm]: 0,
      [Trait.Implant]: 0,
      [Trait.Prosthetic]: 0,
      [Trait.NaturalAptitude]: {
        [Skill.Acrobatics]: 0,
        [Skill.Acting]: 0,
        [Skill.Administration]: 0,
        [Skill.AnimalHandling]: 0,
        [Skill.Appraisal]: 0,
        [Skill.Archery]: 0,
        [Skill.Art]: 0,
        [Skill.Artillery]: 0,
        [Skill.Career]: 0,
        [Skill.Climbing]: 0,
        [Skill.Communications]: 0,
        [Skill.Computers]: 0,
        [Skill.Cryptography]: 0,
        [Skill.Demolitions]: 0,
        [Skill.Disguise]: 0,
        [Skill.Driving]: 0,
        [Skill.EscapeArtist]: 0,
        [Skill.Forgery]: 0,
        [Skill.Gunnery]: 0,
        [Skill.Interest]: 0,
        [Skill.Interrogation]: 0,
        [Skill.Investigation]: 0,
        [Skill.Language]: 0,
        [Skill.Leadership]: 0,
        [Skill.MartialArts]: 0,
        [Skill.MedTech]: 0,
        [Skill.MeleeWeapons]: 0,
        [Skill.Navigation]: 0,
        [Skill.Negotiation]: 0,
        [Skill.Perception]: 0,
        [Skill.Piloting]: 0,
        [Skill.Prestidigitation]: 0,
        [Skill.Protocol]: 0,
        [Skill.Running]: 0,
        [Skill.Science]: 0,
        [Skill.SecuritySystem]: 0,
        [Skill.SensorOperations]: 0,
        [Skill.SmallArms]: 0,
        [Skill.Stealth]: 0,
        [Skill.Streetwise]: 0,
        [Skill.SupportWeapons]: 0,
        [Skill.Surgery]: 0,
        [Skill.Survival]: 0,
        [Skill.Swimming]: 0,
        [Skill.Tactics]: 0,
        [Skill.Technician]: 0,
        [Skill.ThrownWeapons]: 0,
        [Skill.Tracking]: 0,
        [Skill.Training]: 0,
        [Skill.ZeroGOperations]:  0
      },
      [Trait.PainResistance]: 0,
      [Trait.Patient]: 0,
      [Trait.Phenotype]: 0,
      [Trait.PoisonResistance]: 0,
      [Trait.Property]: 0,
      [Trait.Rank]: 0,
      [Trait.SixthSense]: 0,
      [Trait.TechEmpathy]: 0,
      [Trait.ThickSkinned]: 0,
      [Trait.Title]: 0,
      [Trait.Bloodname]: 0,
      [Trait.Toughness]: 0,
      [Trait.AnimalAntipathy]: 0,
      [Trait.Bloodmark]: 0,
      [Trait.CombatParalysis]: 0,
      [Trait.Compulsion]: {},
      [Trait.DarkSecret]: 0,
      [Trait.Enemy]: 0,
      [Trait.GlassJaw]: 0,
      [Trait.Gremlins]: 0,
      [Trait.Handicap]: 0,
      [Trait.Illiterate]: 0,
      [Trait.Impatient]: 0,
      [Trait.InForLife]: 0,
      [Trait.Introvert]: 0,
      [Trait.LostLimb]: 0,
      [Trait.PoorHearing]: 0,
      [Trait.PoorVision]: 0,
      [Trait.SlowLearner]: 0,
      [Trait.ThinSkinned]: 0,
      [Trait.TDS]: 0,
      [Trait.Unattractive]: 0,
      [Trait.Unlucky]: 0,
      [Trait.Equipped]: 0,
      [Trait.ExtraIncome]: 0,
      [Trait.Reputation]: 0,
      [Trait.Wealth]: 0,
      [Trait.CustomVehicle]: 0,
      [Trait.DesignQuirk]: 0,
      [Trait.VehicleLevel]: 0,
      [Trait.Mutation]: 0
    }

    const processExp = (exp: Experience) => {
      if('Or' in exp) {
        OrExperience.push(exp);
      } else if ('Pick' in exp) {
        PickExperience.push(exp);
      } else if('Set' in exp) {
        SetExperience.push(exp);
      } else {
        switch(exp.Kind) {
          case Statistic.Attribute:
            AttributeExperience[exp.Attribute] += exp.Quantity;
            return;
          case Statistic.Skill:
            switch(exp.Skill) {
              case Skill.Acrobatics:
                const acrobatics = exp.Subskill as keyof typeof SkillExperience[Skill.Acrobatics];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][acrobatics].Quantity += exp.Quantity;
                }
                return;
              case Skill.AnimalHandling:
                const handleanimal = exp.Subskill as keyof typeof SkillExperience[Skill.AnimalHandling];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][handleanimal].Quantity += exp.Quantity;
                }
                return;
              case Skill.Communications:
                const communications = exp.Subskill as keyof typeof SkillExperience[Skill.Communications];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][communications].Quantity += exp.Quantity;
                }
                return;
              case Skill.Driving:
                const driving = exp.Subskill as keyof typeof SkillExperience[Skill.Driving];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][driving].Quantity += exp.Quantity;
                }
                return;
              case Skill.Gunnery:
                const gunnery = exp.Subskill as keyof typeof SkillExperience[Skill.Gunnery];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][gunnery].Quantity += exp.Quantity;
                }
                return;
              case Skill.MedTech:
                const medtech = exp.Subskill as keyof typeof SkillExperience[Skill.MedTech];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][medtech].Quantity += exp.Quantity;
                }
                return;
              case Skill.Navigation:
                const navigation = exp.Subskill as keyof typeof SkillExperience[Skill.Navigation];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][navigation].Quantity += exp.Quantity;
                }
                return;
              case Skill.Piloting:
                const piloting = exp.Subskill as keyof typeof SkillExperience[Skill.Piloting];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][piloting].Quantity += exp.Quantity;
                }
                return;
              case Skill.Prestidigitation:
                const prestidigitation = exp.Subskill as keyof typeof SkillExperience[Skill.Prestidigitation];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][prestidigitation].Quantity += exp.Quantity;
                }
                return;
              case Skill.SecuritySystem:
                const securitysystem= exp.Subskill as keyof typeof SkillExperience[Skill.SecuritySystem];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][securitysystem].Quantity += exp.Quantity;
                }
                return;
              case Skill.Surgery:
                const surgery= exp.Subskill as keyof typeof SkillExperience[Skill.Surgery];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][surgery].Quantity += exp.Quantity;
                }
                return;
              case Skill.Tactics:
                const tactics= exp.Subskill as keyof typeof SkillExperience[Skill.Tactics];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][tactics].Quantity += exp.Quantity;
                }
                return;
              case Skill.Technician:
                const technician= exp.Subskill as keyof typeof SkillExperience[Skill.Technician];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][technician].Quantity += exp.Quantity;
                }
                return;
              case Skill.ThrownWeapons:
                const thrownweapons = exp.Subskill as keyof typeof SkillExperience[Skill.ThrownWeapons];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][thrownweapons].Quantity += exp.Quantity;
                }
                return;
              case Skill.Tracking:
                const tracking = exp.Subskill as keyof typeof SkillExperience[Skill.Tracking];
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][tracking].Quantity += exp.Quantity;
                }
                return;
              // Language, Career, Protocol, Streetwise, Survival, Art, Interest all need to fall through here.
              case Skill.Language:
              case Skill.Career:
              case Skill.Protocol:
              case Skill.Streetwise:
              case Skill.Survival:
              case Skill.Art:
              case Skill.Interest:
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  if(exp.Subskill in SkillExperience[exp.Skill]) {
                    SkillExperience[exp.Skill][exp.Subskill].Quantity += exp.Quantity;
                  } else {
                    SkillExperience[exp.Skill][exp.Subskill] = { Quantity: exp.Quantity };
                  }
                }
                return;
              default:
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill].Quantity += exp.Quantity;
                }
                return;
            }
          case Statistic.Trait:
            switch(exp.Trait) {
              case Trait.Compulsion:
                if(!('Trigger' in exp) ) throw new Error('Compulsion must have a trigger!')
                if(exp.Trigger in TraitExperience[exp.Trait]) {
                  TraitExperience[exp.Trait][exp.Trigger] += exp.Quantity
                } else {
                  TraitExperience[exp.Trait] = {
                    [exp.Trigger]: exp.Quantity,
                    ...TraitExperience[exp.Trait]
                  }
                }
                return;
              case Trait.ExceptionalAttribute:
                if(!('Attribute' in exp)) throw new Error('Exceptional Attribute must have an attribute assigned!');
                const attribute = exp.Attribute as Attribute;
                TraitExperience[exp.Trait][attribute] += exp.Quantity;
                return;
              case Trait.NaturalAptitude:
                if(!('Skill' in exp)) throw new Error('Natural aptitude must have a skill assigned!');
                const skill = exp.Skill as Skill;
                TraitExperience[exp.Trait][skill] += exp.Quantity;
                return;
              default:
                TraitExperience[exp.Trait] += exp.Quantity;
                return;
            }
        }
      }
    }

    [
      ...(this.stageZero ? this.stageZero.experience : []),
      ...(this.stageOne ? this.stageOne.experience : []),
      ...(this.stageTwo ? this.stageTwo.experience : []),
      ...this.affiliationExperience
    ].forEach(processExp);

    const atts = EnumMap(Attribute).map(att => { return { Kind: Statistic.Attribute, Attribute: att, Quantity: AttributeExperience[att as Attribute]}})
    const skills = EnumMap(Skill).flatMap(skill => { 
      switch(skill) {
        case Skill.Acrobatics:
        case Skill.AnimalHandling:
        case Skill.Communications:
        case Skill.Driving:
        case Skill.Gunnery:
        case Skill.MedTech:
        case Skill.Navigation:
        case Skill.Piloting:
        case Skill.Prestidigitation:
        case Skill.SecuritySystem:
        case Skill.Surgery:
        case Skill.Tactics:
        case Skill.Technician:
        case Skill.ThrownWeapons:
        case Skill.Tracking:
        case Skill.Language:
        case Skill.Career:
        case Skill.Protocol:
        case Skill.Streetwise:
        case Skill.Survival:
        case Skill.Art:
        case Skill.Interest:
          const subskill = (SkillExperience[skill as Skill] as { [any:string]: { Quantity: number }});
          return Object.keys(subskill).map(sub => { return { Kind: Statistic.Skill, Skill: skill, Subskill: sub, Quantity: subskill[sub].Quantity }})
        default:
          return [{ Kind: Statistic.Skill, Skill: skill, Quantity: (SkillExperience[skill as Skill] as { Quantity: number }).Quantity}]
      }
    });
    const traits = EnumMap(Trait).flatMap(trait => {
      switch(trait) {
        case Trait.Compulsion:
          const triggers = TraitExperience[trait];
          return Object.keys(triggers).map(trigger => { return { Kind: Statistic.Trait, Trait: trait, Trigger: trigger, Quantity: triggers[trigger] }});
        case Trait.ExceptionalAttribute:
          const attributes = TraitExperience[trait] as { [value in Attribute]: number };
          return Object.keys(attributes).map(att =>  { return { Kind: Statistic.Trait, Trait: trait, Attribute: att, Quantity: attributes[(+att) as keyof typeof attributes] }});
        case Trait.NaturalAptitude:
          const skills = TraitExperience[trait] as { [value in Skill]: number };
          return Object.keys(skills).map(skill =>  { return { Kind: Statistic.Trait, Trait: trait, Skill: skill, Quantity: skills[(+skill) as keyof typeof skills] }});

        default:
          return [{ Kind: Statistic.Trait, Trait: trait, Quantity: (TraitExperience[trait as Trait])}]
    }});

    return [...atts, ...skills, ...traits].map(exp => exp as Experience).filter(exp => ('Or' in exp) || ('Pick' in exp) ? false : exp.Quantity !== 0);
  }

  get affiliationExperience(): Experience[] {
    const affNames: { [value in Stage]: string | undefined } = {
      0: this.stageZero?.currentAffiliation?.Name,
      1: this.stageOne?.currentAffiliation.Name,
      2: this.stageTwo?.currentAffiliation.Name,
      3: undefined,
      4: undefined
    }

    //I sorta hate this but i just need something to work correctly for now
    if(affNames[4]) {
      throw new Error('This isnt implemented yet!');
    } else {
      if(affNames[3]) {
        throw new Error('This isnt implemented yet!');
      } else {
        if(affNames[2]) {
          if(affNames[2] !== affNames[1]) {
            return [...this.stageOne.affiliationExperience, ...this.stageTwo.affiliationExperience].map(exp => { return { ...exp, Quantity: Math.floor(exp.Quantity / 2) } })
          } else {
            return this.stageOne.affiliationExperience;
          }
        } else {
          if(affNames[1]) {
            if(affNames[1] !== affNames[0]) {
              return [...this.stageZero.affiliationExperience, ...this.stageOne.affiliationExperience].map(exp => { return { ...exp, Quantity: Math.floor(exp.Quantity / 2) } })
            } else {
              return this.stageZero.affiliationExperience;
            }
          } else {
            if(affNames[0]) {
              return this.stageZero.affiliationExperience
            } else {
              return [];
            }
          }
        }
      }
    }
  }

  //CurrentLanguage: new Subject<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>();
  CurrentLanguage = new Subject<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>();


  get Requirments(): Requirment[] {
    const orReqs: Requirment[] = [];
    const andReqs: Requirment[] = [];
    const notReqs: Requirment[] = [];


    const attributeRequirments: Partial<{
      [att in Attribute]: OneOrBoth<Record<'upper', number>, Record<'lower', number>>
    }> = {}
    const skillRequirments: Requirment[] = [];
    const traitRequirments: Requirment[] = [];

    const processAttReq = (att: Attribute, value: Record<'upper', number> | Record<'lower', number>) => {
      const current = attributeRequirments[att];

      if(!current) {
        attributeRequirments[att] = value;
        return;
      }
      if('lower' in value) {
        if('lower' in current) {
          attributeRequirments[att] = { ...current, 'lower': Math.max(current.lower, value.lower) };
        } else {
          attributeRequirments[att] = { ...current, ...value };
        }
      } else {
        if('upper' in current) {
          attributeRequirments[att] = { ...current, 'upper': Math.min(current.upper, value.upper) };
        } else {
          attributeRequirments[att] = { ...current, ...value };
        }
      }
    }

    const processReq = (req: Requirment) => {
      if('Not' in req) notReqs.push(req);
      if('And' in req) andReqs.push(req);
      if('Or' in req) orReqs.push(req);
      if(!('Kind' in req)) throw new Error('Kind may not be missing from a requirment!');
      switch(req.Kind) {
        case Statistic.Attribute:
          switch(req.Op) {
            case '>':
              processAttReq(req.Attribute, { lower: req.Level + 1 });
              return;
            case '>=':
              processAttReq(req.Attribute, { lower: req.Level });
              return;
            case '<':
              processAttReq(req.Attribute, { upper: req.Level - 1 });
              return;
            case '<=':
              processAttReq(req.Attribute, { upper: req.Level });
              return;
            default:
              //does the = op even really mave much sense?  maybe it should be removed?
              return;
          }
        default:
          throw new Error('How did this even happen?');
      }
    };

    [
      ...(this.stageZero ? this.stageZero.requirments : []),
      ...(this.stageOne ? this.stageOne.requirments : []),
      ...(this.stageTwo ? this.stageTwo.requirments : []),
    ].forEach(processReq)

    //return [...attributeRequirments, ...skillRequirments, ...traitRequirments];
    return [];
  }

  ngAfterViewInit(): void {
    let alreadySubbed:{ [value in Exclude<Stage, 0>]: boolean } = {
      1: false,
      2: false,
      3: false,
      4: false
    };
    this.subscriptions.push(
      this.stageZero.complete.subscribe((_) => {
        this.ref.detectChanges();  
        this.ref.markForCheck(); 

        if(!alreadySubbed[1]) {
          this.subscriptions.push(this.stageOne.complete.subscribe((_) => {
            this.ref.detectChanges();  
            this.ref.markForCheck(); 
    
            if(!alreadySubbed[2]) {
              this.subscriptions.push(this.stageTwo.complete.subscribe((_) => {
                this.ref.detectChanges();  
                this.ref.markForCheck(); 
              }),
              this.stageTwo.changed.subscribe(() => {
                this.ref.detectChanges();  
                this.ref.markForCheck(); 
              }),
              this.stageTwo.affiliationChanged.subscribe((_) => {
                this.ref.detectChanges();  
                this.ref.markForCheck(); 
              }));
              alreadySubbed[2] = true;
            }
          }),
          this.stageOne.changed.subscribe(() => {
            this.ref.detectChanges();  
            this.ref.markForCheck(); 
          }),
          this.stageOne.affiliationChanged.subscribe((_) => {
            this.ref.detectChanges();  
            this.ref.markForCheck(); 
          }),
          this.stageOne.backgroundChanged.subscribe((_) => {
            this.ref.detectChanges();  
            this.ref.markForCheck(); 
          }));
          alreadySubbed[1] = true;
        }
      }),
      this.stageZero.changed.subscribe(() => {
        this.ref.detectChanges();  
        this.ref.markForCheck(); 
      }),
      this.stageZero.languageChanged.subscribe((lang) => {
        this.CurrentLanguage.next(lang);
        this.ref.detectChanges();  
        this.ref.markForCheck(); 
      }),
    );
    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  characterExp: Experience[] = [];
  ngOnInit(): void {
    this.subscriptions.push(this.character.Experience.subscribe({
      next: (value) => this.characterExp.push(value)
    }));
    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  showHideItemizedExp(_: Event) {
    this.itemizedExp.nativeElement.value = this.itemizedExp.nativeElement.value === 'on' ? 'off' : 'on';

    this.ref.detectChanges();  
    this.ref.markForCheck();
  }
}