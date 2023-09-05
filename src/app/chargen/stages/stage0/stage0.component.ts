import { Component, Input, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationsService } from 'src/app/affiliation/affiliations.service';
import { Archtype, Experience, Requirement, Skill, Stat, Statistic } from 'src/app/utils/common';
import { DefaultExpComponent } from './default-exp/default-exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';
import { OrExpComponent } from 'src/app/utils/or-exp/or-exp.component';

@Component({
  selector: 'app-stage0',
  templateUrl: './stage0.component.html',
  styleUrls: ['./stage0.component.scss']
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
  private set language(value: typeof this._language) {
    this.ref.markForCheck(); 
    this._language = value;
    this.ref.detectChanges();  
  }
  
  get languages(): Array<Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string }> {
    return this.currentAffiliation ? [this.currentAffiliation.PrimaryLanguage, ...this.currentAffiliation.SecondaryLanguages] : [];
  }

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

  private subscriptions: Subscription[] = [];
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
      this.langsel.choice.subscribe(changes => {
        this.language = (changes.add[0] as typeof this._language)!
        this.languageChanged.emit(this.language);
      })
    }));
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  visible: boolean = true;
  toggleVisibility(newState: boolean): void {
    this.visible = newState;

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }
}

