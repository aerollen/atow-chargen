import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';
import { BackgroundInfo } from 'src/app/background/background';
import { Archtype, Experience, Requirement, Skill, Statistic } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { RandomLifeEventComponent } from '../random-life-event/random-life-event.component';
import { Observable, Subscription } from 'rxjs';
import { BackgroundsService } from 'src/app/background/backgrounds.service';


@Component({
  selector: 'app-stage4',
  templateUrl: './stage4.component.html',
  styleUrls: ['./stage4.component.scss']
})
export class Stage4Component implements OnInit, AfterViewInit, OnDestroy{
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
  get isComplete(): boolean {
    const check = this.exp.isComplete && this.rle.isComplete;
    if(this.changeAffState === 'off') return check;
    return this.newaff?.isComplete && check;
  }

  get experience(): Experience[] {
    return [...this.exp.experience, ...this.rle.experience];
  }

  get Requirments(): Requirement[] {
    return [];
  }

  currentBackgroundIndex?: number;
  get currentBackground(): BackgroundInfo | undefined {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }

  private _cache: { [year:number]: BackgroundInfo[] } = {};
  get backgrounds(): BackgroundInfo[] {
    if(this.startingYear in this._cache) 
      return this._cache[this.startingYear];
    else {
      return (this._cache[this.startingYear] = this.backgroundService.At(this.startingYear, 4));
    }
  }

  get currentAffiliation(): AffiliationInfo {
    return this.newaff?.currentAffiliation ?? this.affiliation;
  }
  private currentLanguage?: Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string };

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

  get subtotal():number {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a+('Pick' in b ? b.Pick.Count : 1)*b.Quantity, 0) : 0;
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

  subscriptions: Subscription[] = [];
  newaffSubs: Subscription[] = [];

  hasHideButton: boolean = false;
  visible: boolean = true;

  constructor(
    public backgroundService: BackgroundsService,
    private ref: ChangeDetectorRef) {

  }

  toggleVisibility(newState: boolean): void {
    this.visible = newState;
  }

  currentBackgroundChanged(_: Event) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];

    this.ref.detectChanges();  
    this.ref.markForCheck();  
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
}
