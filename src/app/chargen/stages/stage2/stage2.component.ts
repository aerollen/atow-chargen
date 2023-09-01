import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';
import { BackgroundInfo } from 'src/app/background/background';
import { BackgroundsService } from 'src/app/background/backgrounds.service';
import { Archtype, Book, Citation, Experience, Requirment, Skill, Statistic } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { RandomLifeEventComponent } from '../random-life-event/random-life-event.component';

@Component({
  selector: 'app-stage2',
  templateUrl: './stage2.component.html',
  styleUrls: ['./stage2.component.scss']
})
export class Stage2Component implements OnInit, AfterViewInit, OnDestroy {
  @Input() hidden: boolean = false;
  @Input({ required: true }) startingYear!: number;
  @Input({ required: true }) archtype!: Archtype | undefined;
  @Input({ required: true }) affiliation!: AffiliationInfo;
  @Input({ required: true }) language!: Observable<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>

  @Output() backgroundChanged = new EventEmitter<BackgroundInfo>();
  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() affiliationChanged = new EventEmitter<AffiliationInfo>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('changeAff') changeAff!: ElementRef<HTMLInputElement>;
  @ViewChild('newaff') newaff!: NewaffComponent;
  @ViewChild('rle') rle!: RandomLifeEventComponent;

  changeAffState = 'off';

  affChangeCitation: Citation = {
    Book: Book.ATimeOfWar,
    Page: 53
  }

  get affYearChange() {
    return this.startingYear+(this.currentBackground?.Duration ?? 8); //I know 10 works here because every single background at this stage is 10 years
  }

  get currentAffiliation(): AffiliationInfo {
    return this.newaff?.currentAffiliation ?? this.affiliation;
  }

  get isComplete(): boolean {
    if(this.hidden) return false;
    const check = this.exp.isComplete && this.rle.isComplete;
    if(this.changeAffState === 'off') return check;
    return this.newaff?.isComplete && check;
  }

  get experience(): Experience[] {
    return [...this.exp.experience, ...this.rle.experience];
  }

  get affiliationExperience(): Experience[] {
    return this.changeAffState === 'off' ? this.affiliation.Experience : this.newaff.experience
  }

  get requirments(): Requirment[] {
    return this.currentBackground?.Prereq ? [this.currentBackground.Prereq] : [];
  }

  get affiliationRequirments(): Requirment[] {
    return this.changeAffState === 'off' ? [] : this.newaff.requirments;
  }

  get exAff() : AffiliationInfo[] {
    return this.affiliation ? [this.affiliation] : [];
  }

  private _cache: { [year:number]: BackgroundInfo[] } = {};
  get backgrounds(): BackgroundInfo[] {
    if(this.startingYear in this._cache) 
      return this._cache[this.startingYear];
    else {
      return (this._cache[this.startingYear] = this.backgroundServices.At(this.startingYear, 2));
    }
  }

  private _fixedBkgExp: Experience[] = [];
  set fixedBackgroundExperience(values: Experience[]) {
    this.ref.markForCheck();  
    this._fixedBkgExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => {
      if('Or' in exp || 'Pick' in exp) return exp;
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

  currentBackgroundIndex?: number;
  subscriptions: Subscription[] = [];
  newaffSubs: Subscription[] = [];
  constructor(
    public backgroundServices: BackgroundsService,
    private ref: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.subscriptions.push(this.language.subscribe(lang => {
      this.currentLanguage = lang;
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
      this.checkForComplete();
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
