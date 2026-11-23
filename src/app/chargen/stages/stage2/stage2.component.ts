import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnDestroy, ElementRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { AffiliationInfo } from '../../../affiliation/affiliation';
import { BackgroundInfo, BackgroundOption } from '../../../background/background';
import { Archtype, Book, Citation, Eternal, Experience, Requirement, Skill, Statistic } from '../../../utils/common';
import { ExpComponent } from '../../../utils/exp/exp.component';
import { matchesAffiliationRequirement } from '../../../utils/requirements';
import { resolveExperienceListSubskills, resolveExperienceSubskills, resolveRequirementSubskills } from '../../../utils/affiliation-placeholders';
import { BackgroundsService } from '../../../background/backgrounds.service';
import { NewaffComponent } from '../newaff/newaff.component';
import { RandomLifeEventComponent } from '../random-life-event/random-life-event.component';
import { Stage4Component } from '../stage4/stage4.component';

@Component({
    selector: 'app-stage2',
    templateUrl: './stage2.component.html',
    styleUrls: ['./stage2.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Stage2Component implements OnInit, AfterViewInit, OnDestroy {
  @Input() hidden: boolean = false;
  @Input({ required: true }) startingYear!: Observable<Eternal>;
  @Input({ required: true }) endingYear!: Observable<Eternal>;
  @Input({ required: true }) yearAt18!: Eternal;
  @Input({ required: true }) archtype!: Archtype | undefined;
  private _affiliation!: AffiliationInfo;
  @Input({ required: true })
  set affiliation(value: AffiliationInfo) {
    this._affiliation = value;
    if (value?.ChildLabor !== true) this._childLaborSelected = false;
  }
  get affiliation(): AffiliationInfo {
    return this._affiliation;
  }
  @Input({ required: true }) language!: Observable<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>
  @Input({ required: true }) backgrounds!: BackgroundInfo[];

  @Output() backgroundChanged = new EventEmitter<BackgroundInfo>();
  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() affiliationChanged = new EventEmitter<AffiliationInfo>();
  @Output() childLaborSelectionChanged = new EventEmitter<boolean>();
  @Output() affYearChanged = new ReplaySubject<Eternal>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('optionalexp') optionalexp!: ExpComponent;
  @ViewChild('changeAff') changeAff!: ElementRef<HTMLInputElement>;
  @ViewChild('newaff') newaff!: NewaffComponent;
  @ViewChild('rle') rle!: RandomLifeEventComponent;
  @ViewChild('childLaborStage') childLaborStage?: Stage4Component;

  changeAffState = 'off';
  private _childLaborSelected = false;

  get childLaborSelected(): boolean {
    return this._childLaborSelected && this.affiliation?.ChildLabor === true;
  }

  affChangeCitation: Citation = {
    Book: Book.ATimeOfWar,
    Page: 53
  }

  get affYear() {
    return (this.currentStartingYear
      + (this.currentBackground?.Duration ?? 0)
      + (this.currentBackgroundOption?.DurationModifier ?? 0)) as Eternal;
  }

  get currentAffiliation(): AffiliationInfo {
    if (this.childLaborSelected) {
      return this.childLaborStage?.currentAffiliation ?? this.affiliation;
    }
    return this.newaff?.currentAffiliation ?? this.affiliation;
  }

  get isComplete(): boolean {
    if(this.hidden) return false;
    if(this.childLaborSelected) return this.childLaborStage?.isComplete ?? false;
    if(!this.currentBackground) return false;
    const hasOptions = this.currentBackgroundOptions.length > 0;
    const optionIsComplete = !hasOptions || (
      this.currentBackgroundOptionIndex !== undefined
      && (this.optionalexp?.isComplete ?? false)
    );
    const check = this.exp.isComplete && this.rle.isComplete && optionIsComplete;
    if(this.changeAffState === 'off') return check;
    return (this.newaff?.isComplete ?? false) && check;
  }

  get experience(): Experience[] {
    if (this.childLaborSelected) return this.childLaborStage?.experience ?? [];
    return [
      ...this.exp.experience,
      ...this.rle.experience,
      ...(this.currentBackgroundOptionIndex !== undefined ? this.optionalexp.experience : [])
    ];
  }

  get requirments(): Requirement[] {
    if (this.childLaborSelected) return this.childLaborStage?.Requirments ?? [];
    return [
      ...(this.currentBackground?.Prereq ? [this.currentBackground.Prereq] : []),
      ...(this.currentBackgroundOption?.Prereq ? [this.currentBackgroundOption.Prereq] : []),
      ...this.affiliationRequirments
    ].map(requirement =>
      resolveRequirementSubskills(requirement, this.currentAffiliation, this.currentLanguageSubskill)!);
  }

  get affiliationRequirments(): Requirement[] {
    return this.changeAffState === 'off' ? [] : this.newaff.requirments;
  }

  get affiliationExperience(): Experience[] {
    if (this.childLaborSelected) {
      return this.childLaborStage?.affiliationExperience ?? this.affiliation.Experience;
    }
    return this.changeAffState === 'off'
      ? resolveExperienceListSubskills(this.affiliation.Experience, this.affiliation, this.currentLanguageSubskill)
      : this.newaff.experience;
  }

  get childLaborBackgrounds(): BackgroundInfo[] {
    if (!this.childLaborSelected || !Number.isFinite(this.currentStartingYear)) return [];
    return this.backgroundServices.At(this.currentStartingYear, 4)
      .filter(background => background.Name === 'Civilian Job')
      .filter(background =>
        matchesAffiliationRequirement(
          background.Prereq,
          this.affiliation.Name,
          this.affiliation.IsClanner === true
        ));
  }

  get exAff() : AffiliationInfo[] {
    return this.affiliation ? [this.affiliation] : [];
  }

  private _fixedBkgExp: Experience[] = [];
  set fixedBackgroundExperience(values: Experience[]) {
    this.ref.markForCheck();  
    this._fixedBkgExp = values.map(exp =>
      resolveExperienceSubskills(exp, this.currentAffiliation, this.currentLanguageSubskill));
    this.ref.detectChanges();  
  }
  get fixedBackgroundExperience(): Experience[] {
    return this._fixedBkgExp;
  }

  private _fixedOptExp: Experience[] = [];
  set fixedOptionExperience(values: Experience[]) {
    this.ref.markForCheck();
    this._fixedOptExp = values.map(exp =>
      resolveExperienceSubskills(exp, this.currentAffiliation, this.currentLanguageSubskill));
    this.ref.detectChanges();
  }
  get fixedOptionExperience(): Experience[] {
    return this._fixedOptExp;
  }

  get currentBackground(): BackgroundInfo | undefined {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }

  get currentBackgroundOptions(): BackgroundOption[] {
    return (this.currentBackground?.Options ?? []).filter(option =>
      matchesAffiliationRequirement(
        option.Prereq,
        this.affiliation.Name,
        this.affiliation.IsClanner === true
      ));
  }

  currentBackgroundOptionIndex?: number;
  get currentBackgroundOption(): BackgroundOption | undefined {
    return this.currentBackgroundOptionIndex !== undefined
      ? this.currentBackgroundOptions[this.currentBackgroundOptionIndex]
      : undefined;
  }

  get subtotal():number {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a+('Pick' in b ? b.Pick.Count : 1)*b.Quantity, 0) : 0;
  }
  get optionSubtotal(): number {
    return this.currentBackgroundOption
      ? this.currentBackgroundOption.Experience.reduce((a, b) => a+('Pick' in b ? b.Pick.Count : 1)*b.Quantity, 0)
      : 0;
  }
  get currentBackgroundCost(): number | undefined {
    return this.currentBackgroundOption?.Cost ?? this.currentBackground?.Cost;
  }
  currentStartingYear!: Eternal;

  currentBackgroundIndex?: number;
  subscriptions: Subscription[] = [];
  newaffSubs: Subscription[] = [];
  constructor(
    private ref: ChangeDetectorRef,
    private backgroundServices: BackgroundsService) {

  }
  ngOnInit(): void {
    this.subscriptions.push(this.language.subscribe(lang => {
      this.currentLanguage = lang;
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
      this.fixedOptionExperience = this.currentBackgroundOption?.Experience ?? [];
      this.checkForComplete();
    }));
    this.subscriptions.push(this.startingYear.subscribe(year => {
      this.currentStartingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }

  private currentLanguage?: Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string };
  get currentLanguageSubskill(): string | undefined {
    return this.currentLanguage?.Subskill;
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
      this.affYearChanged.next(this.affYear);
      this.hasHideButton = true;
    } else {
      this.hasHideButton = false;
      this.changed.emit();
    }
    this.ref.markForCheck();  
  }

  currentBackgroundOptionChanged(_: Event) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedOptionExperience = this.currentBackgroundOption?.Experience ?? [];
    this.affYearChanged.next(this.affYear);
    this.checkForComplete();
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  currentBackgroundChanged(_: Event) {
    this.currentBackgroundOptionIndex = undefined;
    this.fixedOptionExperience = [];
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  childLaborChanged(event: Event): void {
    const selected = (event.target as HTMLInputElement).checked
      && this.affiliation.ChildLabor === true;
    if (selected === this._childLaborSelected) return;

    this._childLaborSelected = selected;
    this.currentBackgroundIndex = undefined;
    this.currentBackgroundOptionIndex = undefined;
    this.fixedBackgroundExperience = [];
    this.fixedOptionExperience = [];
    this.ref.detectChanges();
    this.childLaborSelectionChanged.emit(selected);
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
