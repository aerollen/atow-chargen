import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';
import { Archtype, Book, Citation, EnumMap, Experience, Requirement, Skill, Statistic } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { RandomLifeEventComponent } from '../random-life-event/random-life-event.component';
import { EducationInfo, EducationService } from 'src/app/education/education.service';
import { Observable, Subscription } from 'rxjs';
import { EducationType } from 'src/app/education/education';
import { SkillField } from 'src/app/education/field';

@Component({
  selector: 'app-stage3',
  templateUrl: './stage3.component.html',
  styleUrls: ['./stage3.component.scss']
})
export class Stage3Component implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) startingYear!: number;
  @Input({ required: true }) archtype!: Archtype | undefined;
  @Input({ required: true }) affiliation!: AffiliationInfo;
  @Input({ required: true }) language!: Observable<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>


  @Output() backgroundChanged = new EventEmitter<EducationInfo>();
  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() affiliationChanged = new EventEmitter<AffiliationInfo>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('firstFieldExp') firstFieldExp!: ExpComponent;
  @ViewChild('secondFieldExp') secondFieldExp!: ExpComponent;
  @ViewChild('nextEdu') nextEdu!: ElementRef<HTMLSelectElement>;
  @ViewChild('changeAff') changeAff!: ElementRef<HTMLInputElement>;
  @ViewChild('newaff') newaff!: NewaffComponent;
  @ViewChild('rle') rle!: RandomLifeEventComponent;

  Basic = EducationType.Basic;
  Advanced = EducationType.Advanced;
  Special = EducationType.Special;

  get EducationFields(): { [value in EducationType]: SkillField[] }  {
    return {
      [EducationType.Basic]: this.currentBackground?.[EducationType.Basic]?.Options ?? [],
      [EducationType.Advanced]: this.currentBackground?.[EducationType.Advanced]?.Options ?? [],
      [EducationType.Special]: this.currentBackground?.[EducationType.Special]?.Options ?? []
    }
  }

  EduCitation: Citation = {
    Book: Book.ATimeOfWar,
    Page: 70
  }

  Stage = 3;
  get isComplete(): boolean {
    return false;
  }

  get experience(): Experience[] {
    return [...this.exp.experience, ...(this.firstFieldExp?.experience ?? []), ...(this.secondFieldExp?.experience ?? []), ...this.rle.experience];
  }

  get Requirments(): Requirement[] {
    return [];
  }

  get currentBackground(): EducationInfo | undefined {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }

  get currentAffiliation(): AffiliationInfo {
    return this.newaff?.currentAffiliation ?? this.affiliation;
  }

  private FixExp(exp: Experience): Experience {
    if('Or' in exp || 'Pick' in exp || 'Set' in exp) return exp;
    switch(exp.Kind) {
      case Statistic.Skill:
        switch(exp.Skill) {
          case Skill.Streetwise:
          case Skill.Protocol:
            if(exp.Subskill === '!') {
              exp.Subskill = this.currentAffiliation.Protocol.Subskill;
            }
            return exp;
          case Skill.Language:
            if(exp.Subskill === '!' && !!this.currentLanguage) {
              exp.Subskill = this.currentLanguage.Subskill;
            }
            return exp;
          default:
            return exp;
        }
      default:
        return exp;
    }
  }

  private _fixedBkgExp: Experience[] = [];
  set fixedBackgroundExperience(values: Experience[]) {
    this.ref.markForCheck();  
    this._fixedBkgExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map<Experience>(this.FixExp);
    this.ref.detectChanges();  
  }
  get fixedBackgroundExperience(): Experience[] {
    if(this._fixedBkgExp.length === 0 && this.currentBackground) {
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    }
    return this._fixedBkgExp;
  }

  private _fixedBasicExp: Experience[] = [];
  set fixedBasicExperience(values: Experience[]) {
    this.ref.markForCheck();  
    this._fixedBasicExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map<Experience>(this.FixExp);
    this.ref.detectChanges();  
  }
  get fixedBasicExperience(): Experience[] {
    if(this._fixedBasicExp.length === 0 
      && this.currentBackground 
      && EducationType.Basic in this.currentBackground 
      && this.currentBackground[EducationType.Basic] 
      && this.currentBackground[EducationType.Basic].Options
      && this.educationIndex[EducationType.Basic] !== undefined
      && this.educationIndex[EducationType.Basic] >= 0) {
      this.fixedBasicExperience = this.currentBackground[EducationType.Basic].Options[this.educationIndex[EducationType.Basic]].Skills.map(skill => { return <Experience>{ ...skill, Quantity: 30 }}) ?? [];
    }
    return this._fixedBasicExp;
  }

  private _fixedAdvExp: Experience[] = [];
  set fixedAdvExperience(values: Experience[]) {
    this.ref.markForCheck();  
    this._fixedAdvExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map<Experience>(this.FixExp);
    this.ref.detectChanges();  
  }
  get fixedAdvExperience(): Experience[] {
    const eduType: EducationType = EducationType[this.nextEdu.nativeElement.value as keyof typeof EducationType]
    if(this._fixedAdvExp.length === 0 
      && this.currentBackground 
      && eduType in this.currentBackground 
      && this.currentBackground[eduType] !== undefined
      && this.currentBackground[eduType]!.Options
      && this.educationIndex[EducationType.Advanced] !== undefined
      && this.educationIndex[EducationType.Advanced]! >= 0
      ) {
      this.fixedAdvExperience = this.currentBackground[eduType]!.Options[this.educationIndex[EducationType.Advanced]].Skills.map(skill => { return <Experience>{ ...skill, Quantity: 30 }}) ?? [];
    }
    return this._fixedAdvExp;
  }

  private _cache: { [year:number]: EducationInfo[] } = {};
  get backgrounds(): EducationInfo[] {
    if(this.startingYear in this._cache) 
      return this._cache[this.startingYear];
    else {
      return (this._cache[this.startingYear] = this.educationService.At(this.startingYear));
    }
  }

  currentBackgroundIndex?: number;
  subscriptions: Subscription[] = [];
  newaffSubs: Subscription[] = [];

  educationIndex: { [values in EducationType]?: number } = {}

  private currentLanguage?: Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string };
  changeAffState = 'off';

  get subtotal():number {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a+('Pick' in b ? b.Pick.Count : 1)*b.Quantity, 0) : 0;
  }

  get EducationLevels(): EducationType[] {
    if(!this.currentBackground) return [];
    return EnumMap(EducationType).filter(edu => edu in this.currentBackground!);
  }

  constructor(
    public educationService: EducationService,
    private ref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.subscriptions.push(this.language.subscribe(lang => {
      this.currentLanguage = lang;
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
      this.checkForComplete();
    }));
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.exp.choice.subscribe(_ => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.exp.completed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.changed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.complete.subscribe(_ => {
      this.checkForComplete();
    }));
  }
  ngOnDestroy(): void {
    [...this.subscriptions, ...this.newaffSubs].forEach(sub => sub.unsubscribe());
  }

  hasHideButton: boolean = false;
  visible: boolean = true;
  toggleVisibility(newState: boolean): void {
    this.visible = newState;
  }

  checkForComplete() {
    this.ref.detectChanges();  
    if (this.isComplete) {
      //this should probaly emit all the completed info
      this.complete.emit(this.experience);
      this.hasHideButton = true;
    } else {
      this.hasHideButton = false;
      this.changed.emit();
    }
    this.ref.markForCheck();  
  }

  currentBackgroundChanged(_: Event) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  FirstEduChanged(_: Event, level: EducationType) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedBasicExperience = this.currentBackground![level]!.Options[this.educationIndex[level]!].Skills.map(skill => { return <Experience>{ ...skill, Quantity: 30 }});

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  SecondEduChanged(_: Event, selected: string) {
    const eduType: EducationType = EducationType[selected as keyof typeof EducationType]

    this.backgroundChanged.emit(this.currentBackground);
    this.fixedAdvExperience = this.currentBackground![eduType]!.Options[this.educationIndex[EducationType.Advanced]!].Skills.map(skill => { return <Experience>{ ...skill, Quantity: 30 }});

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }


  changeAffChanged(_: Event) {
    switch(this.changeAffState) {
      case 'off':
        this.changeAffState = 'on';
        break;
      case 'on':
      default:
        this.changeAffState = 'off';
        break;
    }
    this.ref.detectChanges();  
    switch(this.changeAffState) {
      case 'on':
        this.newaffSubs.push(this.newaff.changed.subscribe(_ => {
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.complete.subscribe(() => {
          this.affiliationChanged.emit(this.newaff.currentAffiliation);
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.affiliationChanged.subscribe((_) => {
          this.checkForComplete();
        }));
        break;
      case 'off':
      default:
        this.newaffSubs.forEach(sub => sub.unsubscribe());
        break;
    }
    this.ref.markForCheck();  
  }

  eduLvl(lvl: number | EducationType) : string {
    return EducationType[lvl].toString();
  }

  asEduLvl(lvl: number ) : EducationType {
    return lvl;
  }

  excludeEduOpt(fields: SkillField[], toExclude: SkillField): SkillField[] {
    return fields.filter(field => field.Name !== toExclude.Name);
  }

  update(host: EducationType){
    this.educationIndex[host] = undefined;
    this.fixedAdvExperience = [];
    this.ref.detectChanges();  
    this.ref.markForCheck();
  }
}
