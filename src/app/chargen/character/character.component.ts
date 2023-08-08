import { Component, ViewChild, ElementRef, ChangeDetectorRef, Input, EventEmitter, Output, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Acrobatics, AnimalHandling, Archtype, Attribute, Communications, Driving, EnumMap, Experience, Gunnery, MedTech, Navigation, Piloting, Prestidigitation, SecuritySystem, Skill, Statistic, Surgery, Tactics, Technician, ThrownWeapons, Tracking, Trait } from "src/app/utils/common";
import { Character } from "../../character/character"
import { Subscription } from "rxjs";
import { Stage0Component } from "../stages/stage0/stage0.component";

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit, OnDestroy, AfterViewInit {
  startingYear: number = 3076;
  startingAge: number = 21;
  targetExperience: number = 5000;
  _currentArchtype: Archtype | undefined = undefined;

  @Input({ required: true }) character!: Character;
  @Output() characterChanged = new EventEmitter<Character>();
  @Output() archtypeChanged = new EventEmitter<Archtype>();

  get characterName(): string {
    return this.character.Name;
  }
  set characterName(val: string) {
    this.character.Name = val;
    this.ref.detectChanges();  
    this.ref.markForCheck(); 
  }

  @ViewChild('startYear') startYear!: ElementRef<HTMLInputElement>;
  @ViewChild('startAge') startAge!: ElementRef<HTMLInputElement>;
  @ViewChild('birthYear') birthYear!: ElementRef<HTMLInputElement>;
  @ViewChild('archtype') archtype!: ElementRef<HTMLSelectElement>;
  @ViewChild('stageZero') stageZero!: Stage0Component;

  get archtypes(): number[] {
    const vals = EnumMap(Archtype)
    return vals;
  }

  get yearOfBirth(): number {
    return this.startingYear-this.startingAge;
  }

  set yearOfBirth(value: number) {
    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  get maxBirthYear(): number {
    return this.startingYear - 16;
  }

  get currentArchtype():  Archtype | undefined {
    return this._currentArchtype;
  }

  set currentArchtype(val: Archtype | undefined) {
    this._currentArchtype = val;
    this.ref.detectChanges();  
    this.ref.markForCheck(); 
    this.archtypeChanged.emit(this.currentArchtype);
  }

  private subscriptions: Subscription[] = [];
  constructor(private ref: ChangeDetectorRef) {

  }
  ngAfterViewInit(): void {
    /*this.stageZero.defaultExperience.forEach(exp => this.character.Experience.next(exp));
    this.subscriptions.push(this.stageZero.choice.subscribe(next => {
      [...next.remove,...next.add].forEach(exp => this.character.Experience.next(exp));
    }));*/
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  get TotalExp(): number {
    return this.Experience.reduce((a, b) => a + b.Quantity, 0);
  }
  get Experience(): Experience[] {
    const atts = EnumMap(Attribute).map(att => { return { Kind: Statistic.Attribute, Attribute: att, Quantity: this.AttributeExperience[att as Attribute]}})
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
          const subskill = (this.SkillExperience[skill as Skill] as { [any:string]: { Quantity: number }});
          return Object.keys(subskill).map(sub => { return { Kind: Statistic.Skill, Skill: skill, Subskill: sub, Quantity: subskill[sub].Quantity }})
        default:
          return [{ Kind: Statistic.Skill, Skill: skill, Quantity: (this.SkillExperience[skill as Skill] as { Quantity: number }).Quantity}]
      }
    });
    const traits = EnumMap(Trait).flatMap(trait => {
      switch(trait) {
        case Trait.Compulsion:
          const triggers = this.TraitExperience[trait];
          return Object.keys(triggers).map(trigger => { return { Kind: Statistic.Trait, Trait: trait, Trigger: trigger, Quantity: triggers[trigger] }});
        case Trait.ExceptionalAttribute:
          const attributes = this.TraitExperience[trait] as { [value in Attribute]: number };
          return Object.keys(attributes).map(att =>  { return { Kind: Statistic.Trait, Trait: trait, Attribute: att, Quantity: attributes[(+att) as keyof typeof attributes] }});
        case Trait.NaturalAptitude:
          return [];
          // TODO: add implementation
          // const skills = this.TraitExperience[trait] as { 
          //   [value in Skill]: value extends 
          //     Skill.Acrobatics | Skill.AnimalHandling | Skill.Communications | 
          //     Skill.Driving | Skill.Gunnery | Skill.MedTech | Skill.Navigation |
          //     Skill.Piloting | Skill.Prestidigitation | Skill.SecuritySystem | 
          //     Skill.Surgery | Skill.Tactics | Skill.Technician | Skill.ThrownWeapons |
          //     Skill.Tracking | Skill.Language | Skill.Career | Skill.Protocol | 
          //     Skill.Streetwise | Skill.Survival | Skill.Art 
          //       ? { [any:string]: { Quantity: number }} 
          //       : { Quantity: number }}
          // return EnumMap(Skill).flatMap(skill => {
          //   switch(skill) {
          //     case Skill.Acrobatics:
          //     case Skill.AnimalHandling:
          //     case Skill.Communications:
          //     case Skill.Driving:
          //     case Skill.Gunnery:
          //     case Skill.MedTech:
          //     case Skill.Navigation:
          //     case Skill.Piloting:
          //     case Skill.Prestidigitation:
          //     case Skill.SecuritySystem:
          //     case Skill.Surgery:
          //     case Skill.Tactics:
          //     case Skill.Technician:
          //     case Skill.ThrownWeapons:
          //     case Skill.Tracking:
          //     case Skill.Language:
          //     case Skill.Career:
          //     case Skill.Protocol:
          //     case Skill.Streetwise:
          //     case Skill.Survival:
          //     case Skill.Art:
          //       const subskill = (skills[skill as Skill] as { [any:string]: { Quantity: number }});
          //       return Object.keys(subskill).map(sub => { return { Kind: Statistic.Trait, Trait:trait, Skill: skill, Subskill: sub, Quantity: subskill[sub].Quantity }})
          //     default:
          //       return [{ Kind: Statistic.Skill, Skill: skill, Quantity: (this.SkillExperience[skill as Skill] as { Quantity: number }).Quantity}]
          //   }
          // });
        default:
          return [{ Kind: Statistic.Trait, Trait: trait, Quantity: (this.TraitExperience[trait as Trait])}]
      }
    });
    return [...atts, ...skills, ...traits].map(exp => exp as Experience).filter(exp => ('Or' in exp) ? false : exp.Kind === Statistic.Attribute || exp.Quantity !== 0);
  }
  OrExperience: Array<Experience> = []
  AttributeExperience: {
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
  SkillExperience: {
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
      : S extends (Skill.Language | Skill.Career | Skill.Protocol | Skill.Streetwise | Skill.Survival | Skill.Art) ? {
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
    [Skill.Interest]: { Quantity: 0 },
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
  TraitExperience: {
    [T in Trait]:
      ( T extends Trait.Compulsion ? { [Trigger: string]: number } 
      : T extends Trait.ExceptionalAttribute ? { [Value in Attribute]: number }
      : T extends Trait.NaturalAptitude ? { [Value in Skill]: typeof this.SkillExperience[Value] }
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
    [Trait.NaturalAptitude]: {...this.SkillExperience},
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
  ngOnInit(): void {
    const processExp = (exp: Experience) => {
      if('Or' in exp) {
        this.OrExperience.push(exp);
      } else {
        switch(exp.Kind) {
          case Statistic.Attribute:
            this.AttributeExperience[exp.Attribute] += exp.Quantity;
            return;
          case Statistic.Skill:
            switch(exp.Skill) {
              case Skill.Acrobatics:
                const acrobatics = exp.Subskill as Acrobatics;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][acrobatics].Quantity += exp.Quantity;
                }
                return;
              case Skill.AnimalHandling:
                const handleanimal = exp.Subskill as AnimalHandling;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][handleanimal].Quantity += exp.Quantity;
                }
                return;
              case Skill.Communications:
                const communications = exp.Subskill as Communications;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][communications].Quantity += exp.Quantity;
                }
                return;
              case Skill.Driving:
                const driving = exp.Subskill as Driving;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][driving].Quantity += exp.Quantity;
                }
                return;
              case Skill.Gunnery:
                const gunnery = exp.Subskill as Gunnery;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][gunnery].Quantity += exp.Quantity;
                }
                return;
              case Skill.MedTech:
                const medtech = exp.Subskill as MedTech;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][medtech].Quantity += exp.Quantity;
                }
                return;
              case Skill.Navigation:
                const navigation = exp.Subskill as Navigation;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][navigation].Quantity += exp.Quantity;
                }
                return;
              case Skill.Piloting:
                const piloting = exp.Subskill as Piloting;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][piloting].Quantity += exp.Quantity;
                }
                return;
              case Skill.Prestidigitation:
                const prestidigitation = exp.Subskill as Prestidigitation;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][prestidigitation].Quantity += exp.Quantity;
                }
                return;
              case Skill.SecuritySystem:
                const securitysystem = exp.Subskill as SecuritySystem;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][securitysystem].Quantity += exp.Quantity;
                }
                return;
              case Skill.Surgery:
                const surgery = exp.Subskill as Surgery;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][surgery].Quantity += exp.Quantity;
                }
                return;
              case Skill.Tactics:
                const tactics = exp.Subskill as Tactics;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][tactics].Quantity += exp.Quantity;
                }
                return;
              case Skill.Technician:
                const technician = exp.Subskill as Technician;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][technician].Quantity += exp.Quantity;
                }
                return;
              case Skill.ThrownWeapons:
                const thrownweapons = exp.Subskill as ThrownWeapons;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][thrownweapons].Quantity += exp.Quantity;
                }
                return;
              case Skill.Tracking:
                const tracking = exp.Subskill as Tracking;
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  this.SkillExperience[exp.Skill][tracking].Quantity += exp.Quantity;
                }
                return;
              // Language, Career, Protocol, Streetwise, Survival, Art all need to fall through here.
              case Skill.Language:
              case Skill.Career:
              case Skill.Protocol:
              case Skill.Streetwise:
              case Skill.Survival:
              case Skill.Art:
                if(exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  if(exp.Subskill in this.SkillExperience[exp.Skill]) {
                    this.SkillExperience[exp.Skill][exp.Subskill].Quantity += exp.Quantity;
                  } else {
                    this.SkillExperience[exp.Skill][exp.Subskill] = { Quantity: exp.Quantity };
                  }
                }
                return;
              default:
                this.SkillExperience[exp.Skill].Quantity += exp.Quantity;
                return;
            }
          case Statistic.Trait:
            switch(exp.Trait) {
              case Trait.Compulsion:
                if(!('Trigger' in exp) ) throw new Error('Compulsion must have a trigger!')
                if(exp.Trigger in this.TraitExperience[exp.Trait]) {
                  this.TraitExperience[exp.Trait][exp.Trigger] += exp.Quantity
                } else {
                  this.TraitExperience[exp.Trait] = {
                    [exp.Trigger]: exp.Quantity,
                    ...this.TraitExperience[exp.Trait]
                  }
                }
                return;
              case Trait.ExceptionalAttribute:
                if(!('Attribute' in exp)) throw new Error('Exceptional Attribute must have an attribute assigned!');
                const attribute = exp.Attribute as Attribute;
                this.TraitExperience[exp.Trait][attribute] += exp.Quantity;
                return;
              case Trait.NaturalAptitude:
                if(!('Skill' in exp)) throw new Error('Natural aptitude must have a skill assigned!');
                switch(exp.Skill) {
                  case Skill.Acrobatics:
                    if(!('Subskill' in exp)) throw new Error();
                    const acrobatics = exp.Subskill as Acrobatics;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][acrobatics].Quantity += exp.Quantity
                    }
                    return;
                  case Skill.AnimalHandling:
                    if(!('Subskill' in exp)) throw new Error();
                    const AnimalHandling = exp.Subskill as AnimalHandling;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][AnimalHandling].Quantity += exp.Quantity
                    }
                    return;
                  case Skill.Communications:
                    if(!('Subskill' in exp)) throw new Error();
                    const Communications = exp.Subskill as Communications;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Communications].Quantity += exp.Quantity
                    }
                    return;    
                  case Skill.Driving:
                    if(!('Subskill' in exp)) throw new Error();
                    const Driving = exp.Subskill as Driving;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Driving].Quantity += exp.Quantity
                    }
                    return;     
                  case Skill.Gunnery:
                    if(!('Subskill' in exp)) throw new Error();
                    const Gunnery = exp.Subskill as Gunnery;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Gunnery].Quantity += exp.Quantity
                    }
                    return;
                  case Skill.MedTech:
                    if(!('Subskill' in exp)) throw new Error();
                    const MedTech = exp.Subskill as MedTech;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][MedTech].Quantity += exp.Quantity
                    }
                    return;
                  case Skill.Navigation:
                    if(!('Subskill' in exp)) throw new Error();
                    const Navigation = exp.Subskill as Navigation;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Navigation].Quantity += exp.Quantity
                    }
                    return;
                  case Skill.Piloting:
                    if(!('Subskill' in exp)) throw new Error();
                    const Piloting = exp.Subskill as Piloting;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Piloting].Quantity += exp.Quantity
                    }
                    return;    
                  case Skill.Prestidigitation:
                    if(!('Subskill' in exp)) throw new Error();
                    const Prestidigitation = exp.Subskill as Prestidigitation;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Prestidigitation].Quantity += exp.Quantity
                    }
                    return;    
                  case Skill.SecuritySystem:
                    if(!('Subskill' in exp)) throw new Error();
                    const SecuritySystem = exp.Subskill as SecuritySystem;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][SecuritySystem].Quantity += exp.Quantity
                    }
                    return;   
                  case Skill.Surgery:
                    if(!('Subskill' in exp)) throw new Error();
                    const Surgery = exp.Subskill as Surgery;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Surgery].Quantity += exp.Quantity
                    }
                    return;
                  case Skill.Tactics:
                    if(!('Subskill' in exp)) throw new Error();
                    const Tactics = exp.Subskill as Tactics;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Tactics].Quantity += exp.Quantity
                    }
                    return; 
                  case Skill.Technician:
                    if(!('Subskill' in exp)) throw new Error();
                    const Technician = exp.Subskill as Technician;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Technician].Quantity += exp.Quantity
                    }
                    return; 
                  case Skill.ThrownWeapons:
                    if(!('Subskill' in exp)) throw new Error();
                    const ThrownWeapons = exp.Subskill as ThrownWeapons;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][ThrownWeapons].Quantity += exp.Quantity
                    }
                    return; 
                  case Skill.Tracking:
                    if(!('Subskill' in exp)) throw new Error();
                    const Tracking = exp.Subskill as Tracking;
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      this.TraitExperience[exp.Trait][exp.Skill][Tracking].Quantity += exp.Quantity
                    }
                    return; 
                  // Language, Career, Protocol, Streetwise, Survival, Art all need to fall through here.
                  case Skill.Language:
                  case Skill.Career:
                  case Skill.Protocol:
                  case Skill.Streetwise:
                  case Skill.Survival:
                  case Skill.Art:
                    if(exp.Speciality) {
                      throw new Error('Not Implemented!');
                    } else {
                      if(!('Subskill' in exp)) throw new Error();
                      if((exp.Subskill as string) in this.TraitExperience[exp.Trait][exp.Skill]) {
                        this.TraitExperience[exp.Trait][exp.Skill][(exp.Subskill as string)].Quantity += exp.Quantity;
                      } else {
                        this.TraitExperience[exp.Trait][exp.Skill][(exp.Subskill as string)] = { Quantity: exp.Quantity };
                      }
                    }
                    return;
                }
                return;
              default:
                this.TraitExperience[exp.Trait] += exp.Quantity;
                return;
            }
        }
      }
    }
    this.subscriptions.push(this.character.Experience.subscribe({
      next: (value) => {
        //processExp(value);
      }
    }));
  }

  nameChanged(e: any) {
    this.characterName = e.target.value;
    this.characterChanged.emit(this.character);
  }

  ageChanged(e: any) {
    const dif = this.startingAge - this.startAge.nativeElement.valueAsNumber;
    this.startingAge = Math.max(this.startingAge - dif, 16);
    this.ref.detectChanges();  
    this.ref.markForCheck();  
    this.characterChanged.emit(this.character);
  }

  startYearChanged(e: any) {
    const dif = this.startingYear - this.startYear.nativeElement.valueAsNumber;
    this.startingYear = this.startYear.nativeElement.valueAsNumber;
    this.startingAge = Math.max(this.startingAge - dif, 16);
    this.ref.detectChanges();  
    this.ref.markForCheck();  
    this.characterChanged.emit(this.character);
  }

  yearOfBirthChanged(e: any) {
    const newAge = this.startingYear - this.birthYear.nativeElement.valueAsNumber
    this.startingAge = newAge;
    this.ref.detectChanges();  
    this.ref.markForCheck();  
    this.characterChanged.emit(this.character);
  }

  currentArchtypeChanged(e: any) {
    this.ref.detectChanges();  
    this.ref.markForCheck();
    
    const val = Archtype[this.archtype.nativeElement.selectedIndex-1] as keyof typeof Archtype
    this.currentArchtype = Archtype[val];

    this.characterChanged.emit(this.character);
  }
}