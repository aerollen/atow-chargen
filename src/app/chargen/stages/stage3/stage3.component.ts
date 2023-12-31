import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';
import { Archtype, Book, Citation, EnumMap, Eternal, Experience, Requirement, Skill, Statistic } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { RandomLifeEventComponent } from '../random-life-event/random-life-event.component';
import { EducationInfo, EducationService } from 'src/app/education/education.service';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { EducationType } from 'src/app/education/education';
import { SkillField } from 'src/app/education/field';

@Component({
  selector: 'app-stage3',
  templateUrl: './stage3.component.html',
  styleUrls: ['./stage3.component.scss']
})
export class Stage3Component implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) startingYear!: Observable<Eternal>;
  @Input({ required: true }) endingYear!: Observable<Eternal>;
  @Input({ required: true }) archtype!: Archtype | undefined;
  @Input({ required: true }) affiliation!: AffiliationInfo;
  @Input({ required: true }) language!: Observable<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>

  @Output() backgroundChanged = new EventEmitter<EducationInfo>();
  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() affiliationChanged = new EventEmitter<AffiliationInfo>();
  @Output() affYearChanged = new ReplaySubject<Eternal>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('firstFieldExp') firstFieldExp!: ExpComponent;
  @ViewChild('secondFieldExp') secondFieldExp!: ExpComponent;
  @ViewChild('lastFieldExp') lastFieldExp!: ExpComponent;
  @ViewChild('basic') basic!: ElementRef<HTMLSelectElement>;
  @ViewChild('nextEdu') nextEdu!: ElementRef<HTMLSelectElement>;
  @ViewChild('lastEdu') lastEdu!: ElementRef<HTMLSelectElement>;

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

  get affYear(): Eternal {
    return [
      EducationType.Basic, 
      ...(this.nextEdu ? [EducationType[this.nextEdu.nativeElement.value as keyof typeof EducationType]] : []),
      ...(this.lastEdu ? [EducationType[this.lastEdu.nativeElement.value as keyof typeof EducationType]] : []) 
    ].reduce((sofar, current) => (sofar + (this.currentBackground?.[current as EducationType]?.Duration ?? 0)),this.currentStartingYear as number) as Eternal;
  }


  EduCitation: Citation = {
    Book: Book.ATimeOfWar,
    Page: 70
  }

  affChangeCitation: Citation = {
    Book: Book.ATimeOfWar,
    Page: 53
  }

  Stage = 3;
  get isComplete(): boolean {
    const check = this.exp?.isComplete && this.rle?.isComplete && this.firstFieldExp?.isComplete && (this.nextEdu?.nativeElement.value !== 'Complete' ? this.secondFieldExp.isComplete : true);
    if(this.changeAffState === 'off') return check;
    return (this.newaff?.isComplete ?? false) && check;
  }

  get exAff() : AffiliationInfo[] {
    return this.affiliation ? [this.affiliation] : [];
  }

  get experience(): Experience[] {
    return [...this.exp.experience, ...(this.firstFieldExp?.experience ?? []), ...(this.secondFieldExp?.experience ?? []), ...this.rle.experience];
  }

  get Requirments(): Requirement[] {
    return [...(this.currentBackground?.Prereq ? [this.currentBackground.Prereq, ...(EnumMap(EducationType)
      .filter((edu: EducationType) => this.educationIndex[edu] !== undefined)
      .map((edu: EducationType) => { return { index: this.educationIndex[edu]!, edu: edu }})
      .map(value => this.currentBackground![value.edu]?.Options[value.index].Prereq)
      .filter(req => !!req).map<Requirement>(req => req!))] : [])];
  }

  get currentBackground(): EducationInfo | undefined {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }

  get currentAffiliation(): AffiliationInfo {
    return this.newaff?.currentAffiliation ?? this.affiliation;
  }

  private FixExp(exp: Experience): Experience {
    if('Or' in exp || 'Pick' in exp || 'Set' in exp || 'If' in exp) return exp;
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
    this._fixedBkgExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map<Experience>(exp => this.FixExp(exp));
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
    this._fixedBasicExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map<Experience>(exp => this.FixExp(exp));
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
    this._fixedAdvExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map<Experience>(exp => this.FixExp(exp));
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

  private _fixedSpecExp: Experience[] = [];
  set fixedSpecExperience(values: Experience[]) {
    this.ref.markForCheck();  
    this._fixedSpecExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map<Experience>(exp => this.FixExp(exp));
    this.ref.detectChanges();  
  }
  get fixedSpecExperience(): Experience[] {
    const eduType: EducationType = EducationType[this.lastEdu.nativeElement.value as keyof typeof EducationType]
    if(this._fixedSpecExp.length === 0 
      && this.currentBackground 
      && eduType in this.currentBackground 
      && this.currentBackground[eduType] !== undefined
      && this.currentBackground[eduType]!.Options
      && this.educationIndex[EducationType.Special] !== undefined
      && this.educationIndex[EducationType.Special]! >= 0
      ) {
      this.fixedSpecExperience = this.currentBackground[eduType]!.Options[this.educationIndex[EducationType.Special]].Skills.map(skill => { return <Experience>{ ...skill, Quantity: 30 }}) ?? [];
    }
    return this._fixedSpecExp;
  }

  private _cache: { [year:number]: EducationInfo[] } = {};
  get backgrounds(): EducationInfo[] {
    if(isNaN(this.currentStartingYear)) return [];
    if(this.currentStartingYear === undefined) return [];
    if(this.currentStartingYear in this._cache) 
      return this._cache[this.currentStartingYear];
    else {
      return (this._cache[this.currentStartingYear] = this.educationService.At(this.currentStartingYear));
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
    this.subscriptions.push(this.endingYear.subscribe(year => {
      this.currentEndingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
    this.subscriptions.push(this.startingYear.subscribe(year => {
      this.currentStartingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }

  currentEndingYear!: Eternal;
  currentStartingYear!: Eternal;
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
      this.affYearChanged.next(this.affYear);
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
    
    [this.lastEdu, this.nextEdu, this.basic].filter(edu => edu).forEach(edu => edu.nativeElement.selectedIndex === 0);
    this.update(EducationType.Basic);
  }

  EduChanged(_:Event, selected: string, level: EducationType) {
    const eduType: EducationType = EducationType[selected as keyof typeof EducationType]

    this.backgroundChanged.emit(this.currentBackground);
    const newexp =  this.currentBackground![eduType]!.Options[this.educationIndex[level]!].Skills.map(skill => { return <Experience>{ ...skill, Quantity: 30 }});
    switch(level) {
      case EducationType.Basic:
        this.fixedBasicExperience = newexp;
        break;
      case EducationType.Advanced:
        this.fixedAdvExperience = newexp;
        break;
      case EducationType.Special:
        this.fixedSpecExperience = newexp;
        break
    }

    this.checkForComplete(); 
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
    return fields.filter(field => field.Name !== toExclude?.Name ?? '');
  }

  update(host: EducationType){
    const spec = () => {
      this.educationIndex[EducationType.Special] = undefined;
      this.fixedSpecExperience = [];
    }
    const adv = () => {
      this.educationIndex[EducationType.Advanced] = undefined;
      this.fixedAdvExperience = [];
      spec();
    }
    const basic = () => {
      this.educationIndex[EducationType.Basic] = undefined;
      this.fixedBasicExperience = [];
      adv();
    }
    this.ref.markForCheck();
    switch(host) {
      case EducationType.Special:
        spec();
        break;
      case EducationType.Advanced:
        adv();
        break;
      case EducationType.Basic:
        basic();
        break;
    }
    this.ref.detectChanges();  
  }
}
