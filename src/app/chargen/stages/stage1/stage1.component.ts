import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';
import { BackgroundInfo } from 'src/app/background/background';
import { BackgroundsService } from 'src/app/background/backgrounds.service';
import { Archtype, Book, Citation, Eternal, Experience, Requirement, Skill, Statistic } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { RandomLifeEventComponent } from '../random-life-event/random-life-event.component';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.component.html',
  styleUrls: ['./stage1.component.scss']
})
export class Stage1Component implements OnInit, AfterViewInit, OnDestroy {
  @Input() hidden: boolean = false;
  @Input({ required: true }) startingYear!: Observable<Eternal>;
  @Input({ required: true }) archtype!: Archtype | undefined;
  @Input({ required: true }) startingAffiliation!: AffiliationInfo;
  @Input({ required: true }) language!: Observable<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>

  @Output() backgroundChanged = new EventEmitter<BackgroundInfo>();
  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() affiliationChanged = new EventEmitter<AffiliationInfo>();
  @Output() affYearChanged = new ReplaySubject<Eternal>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('changeAff') changeAff!: ElementRef<HTMLInputElement>;
  @ViewChild('newaff') newaff!: NewaffComponent;
  @ViewChild('rle') rle!: RandomLifeEventComponent;

  changeAffState = 'off';

  affChangeCitation: Citation = {
    Book: Book.ATimeOfWar,
    Page: 53
  }

  get affYear(): Eternal {
    return (this.currentStartingYear + (this.currentBackground?.Duration ?? 0)) as Eternal;
  }

  get currentAffiliation(): AffiliationInfo {
    return this.newaff?.currentAffiliation ?? this.startingAffiliation;
  }

  get isComplete(): boolean {
    if(this.hidden) return false;
    const check = this.exp.isComplete && this.rle.isComplete;
    if(this.changeAffState === 'off') return check;
    return (this.newaff?.isComplete ?? false) && check;
  }

  get experience(): Experience[] {
    return [...this.exp.experience, ...this.rle.experience];
  }

  get affiliationExperience(): Experience[] {
    return this.changeAffState === 'off' ? this.startingAffiliation.Experience : this.newaff.experience
  }

  get requirments(): Requirement[] {
    return this.currentBackground?.Prereq ? [this.currentBackground.Prereq] : [];
  }

  get affiliationRequirments(): Requirement[] {
    return this.changeAffState === 'off' ? [] : this.newaff.requirments;
  }

  get exAff() : AffiliationInfo[] {
    return this.startingAffiliation ? [this.startingAffiliation] : [];
  }

  private _cache: { [year:number]: BackgroundInfo[] } = {};
  get backgrounds(): BackgroundInfo[] {
    if(isNaN(this.currentStartingYear)) return [];
    if(this.currentStartingYear === undefined) return [];
    if(this.currentStartingYear in this._cache) 
      return this._cache[this.currentStartingYear];
    else {
      return (this._cache[this.currentStartingYear] = this.backgroundServices.At(this.currentStartingYear, 1));
    }
  }

  private _fixedBkgExp: Experience[] = [];
  set fixedBackgroundExperience(values: Experience[]) {
    this.ref.markForCheck();  
    this._fixedBkgExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => {
      if('Or' in exp || 'Pick' in exp || 'Set' in exp || 'If' in exp) return exp;
      switch(exp.Kind) {
        case Statistic.Skill:
          switch(exp.Skill) {
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
    });
    this.ref.detectChanges();  
  }
  get fixedBackgroundExperience(): Experience[] {
    if(this._fixedBkgExp.length === 0 && this.currentBackground) {
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    }
    return this._fixedBkgExp;
  }

  get currentBackground(): BackgroundInfo | undefined {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }

  get subtotal():number {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a+('Pick' in b ? b.Pick.Count : 1)*b.Quantity, 0) : 0;
  }

  private _currentBackgroundIndex?: number;
  get currentBackgroundIndex(): number | undefined {
    return this._currentBackgroundIndex;
  }
  set currentBackgroundIndex(value: number | undefined) {
    this._currentBackgroundIndex = value;

    this.ref.detectChanges();  
    this.ref.markForCheck();  

  }
  currentStartingYear!: Eternal;

  subscriptions: Subscription[] = [];
  newaffSubs: Subscription[] = [];
  constructor(
    public backgroundServices: BackgroundsService,
    private ref: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.subscriptions.push(this.startingYear.subscribe(year => {
      this.currentStartingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }

  private currentLanguage?: Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string };

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
    this.subscriptions.push(this.language.subscribe(lang => {
      this.currentLanguage = lang;
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
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
}
