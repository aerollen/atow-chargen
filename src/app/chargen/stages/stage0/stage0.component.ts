import { Component, Input, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationsService } from '../../../affiliation/affiliations.service';
import { Archtype, Attribute, Book, Experience, Requirement, Skill, Stat, Statistic, Trait } from '../../../utils/common';
import { DefaultExpComponent } from './default-exp/default-exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { AffiliationInfo } from '../../../affiliation/affiliation';
import { OrExpComponent } from '../../../utils/or-exp/or-exp.component';

@Component({
    selector: 'app-stage0',
    templateUrl: './stage0.component.html',
    styleUrls: ['./stage0.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Stage0Component implements AfterViewInit, OnDestroy {
  @Input({ required: true }) startingYear!: number;
  @Input({ required: true }) archtype!: Archtype | undefined;

  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() languageChanged = new EventEmitter<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>();

  @ViewChild('default') default!: DefaultExpComponent;
  @ViewChild('aff') aff!: NewaffComponent;
  @ViewChild('langsel') langsel!: OrExpComponent;

  get currentAffiliation(): AffiliationInfo | undefined {
    return this.aff?.currentAffiliation;
  }

  get isComplete(): boolean {
    return !!this.language && this.aff.isComplete;
  }

  private _language: (Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }) | undefined = undefined;
  private get language(): (Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }) | undefined {
    return this._language;
  }
  get currentLanguageSubskill(): string | undefined {
    return this.language?.Subskill;
  }
  private set language(value: typeof this._language) {
    this.ref.markForCheck(); 
    this._language = value;
    this.ref.detectChanges();  
  }
  
  get languages(): Array<Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string }> {
    return this.currentAffiliation ? [this.currentAffiliation.PrimaryLanguage, ...this.currentAffiliation.SecondaryLanguages] : [];
  }

  get isAnyLanguageSelected(): boolean {
    const selected = this.langsel?.selectedValue;
    return selected?.Kind === Statistic.Skill &&
      selected.Skill === Skill.Language &&
      selected.Subskill === '*';
  }

  readonly anyLanguageExperience: Experience = {
    Kind: Statistic.Skill,
    Skill: Skill.Language,
    Subskill: '*',
    Quantity: 20
  };

  get experience(): Experience[] {
    return [
      ...(this.language ? [this.language] : []),
      ...this.default.defaultExperience,
    ]
  }

  get affiliationExperience(): Experience[] {
    return this.aff.experience;
  }

  get requirments(): Requirement[] {
    return [];
  }

  get affiliationRequirments(): Requirement[] {
    return this.aff.requirments;
  }

  get naturalAptitudeRequirement(): Requirement | undefined {
    const affiliation = this.currentAffiliation;
    const hasNaturalAptitudeRequirement = this.aff?.experience.some(experience =>
      'Kind' in experience &&
      experience.Kind === Statistic.Trait &&
      experience.Trait === Trait.NaturalAptitude &&
      'Skill' in experience &&
      (experience.Skill === Skill.Protocol || experience.Skill === Skill.Strategy)
    ) ?? false;

    if (
      affiliation?.Name === 'Federated Suns' &&
      (affiliation.Citation.Book === Book.ATimeOfWar || affiliation.Citation.Book === Book.FieldManual3085) &&
      hasNaturalAptitudeRequirement
    ) {
      return {
        Kind: Statistic.Attribute,
        Attribute: Attribute.Intelligence,
        Op: '>=',
        Level: 4
      };
    }

    return undefined;
  }

  private subscriptions: Subscription[] = [];
  private languageSubscription?: Subscription;
  constructor(
    public affliliationService: AffiliationsService,
    private ref: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.aff.changed.subscribe(() => {
        this.checkForComplete();
      }),
      this.aff.complete.subscribe((_) => {
        this.checkForComplete();
      }),
      this.aff.affiliationChanged.subscribe((_) => {
        this.checkForComplete();
        this.languageSubscription?.unsubscribe();
        this.languageSubscription = this.langsel.choice.subscribe(changes => {
          const selected = changes.add[0];
          if (!selected || !this.isLanguageExperience(selected)) return;
          if (selected.Subskill === '*') {
            this.language = undefined;
            this.checkForComplete();
            return;
          }
          this.language = selected;
          this.languageChanged.emit(selected);
          this.checkForComplete();
        });
      })
    );
    this.ref.detectChanges();  
    this.ref.markForCheck(); 
  }

  hasHideButton: boolean = false;
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

  onAnyLanguageChanged(changes: Record<'add', Experience[]> & Record<'remove', Experience[]>): void {
    const selected = changes.add[0];
    if (!selected || !this.isLanguageExperience(selected) || selected.Subskill === '*') return;
    this.language = selected;
    this.languageChanged.emit(selected);
    this.checkForComplete();
  }

  private isLanguageExperience(
    experience: Experience
  ): experience is Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string } {
    return 'Kind' in experience &&
      experience.Kind === Statistic.Skill &&
      'Skill' in experience &&
      experience.Skill === Skill.Language &&
      'Subskill' in experience &&
      typeof experience.Subskill === 'string';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.languageSubscription?.unsubscribe();
  }

  visible: boolean = true;
  toggleVisibility(newState: boolean): void {
    this.visible = newState;

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }
}

