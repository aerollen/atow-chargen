import { Component, Input, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationsService } from 'src/app/affiliation/affiliations.service';
import { Archtype, Experience, Stat, Statistic, Trait } from 'src/app/utils/common';
import { AffComponent } from './aff/aff.component';
import { SubaffComponent } from './subaff/subaff.component';
import { DefaultExpComponent } from './default-exp/default-exp.component';

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

  @ViewChild('default') default!: DefaultExpComponent;
  @ViewChild('aff') aff!: AffComponent;
  @ViewChild('subaff') subaff!: SubaffComponent;

  get isComplete(): boolean {
    const affcompleted = this.aff?.isComplete ?? false;
    const subaffcompleted = this.subaff?.isComplete ?? false
    return affcompleted && subaffcompleted;
  }

  private subscriptions: Subscription[] = [];
  constructor(
    public affliliationService: AffiliationsService,
    private ref: ChangeDetectorRef) {

  }

  //prevLang: Experience | undefined;
  currentLang: Experience | undefined;
  affChoices: Experience[] = [];
  subaffChoices: Experience[] = [];
  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.aff.choice.subscribe(changes => {
        [...changes.add, ...changes.remove].forEach(change => this.affChoices.push(change))
        this.checkForComplete();
      }),
      this.aff.affiliationChanged.subscribe(change => {
        this.affChoices = [];
        this.checkForComplete();
      }),
      this.aff.languageChanged.subscribe(change => {
        //if(this.currentLang) this.prevLang = { ...this.currentLang, Quantity: -this.currentLang.Quantity }
        this.currentLang = change;
        this.checkForComplete();
      }),
      this.subaff.subaffiliationChanged.subscribe(change => {
        this.subaffChoices = [];
        this.checkForComplete();
      }),
      this.subaff.choice.subscribe(changes => {
        [...changes.add, ...changes.remove].forEach(change => this.subaffChoices.push(change))
        this.checkForComplete();
      })
    );
  }

  hasHideButton: boolean = false;
  checkForComplete() {
    setTimeout((() => {
      if (this.isComplete) {
        //this should probaly emit all the completed info
        this.complete.emit([
          ...this.default.defaultExperience, 
          //...(this.prevLang ? [this.prevLang] : []), 
          ...(this.currentLang ? [this.currentLang] : []), 
          ...this.aff.currentAffiliation?.Experience ?? [], 
          ...this.affChoices,
          ...(this.subaff.currentSubaffiliation?.Experience ?? []),
          ...this.subaffChoices].filter(exp => !this.isOrExp(exp) && !this.isStar(exp)));
        this.hasHideButton = true;
      } else {
        this.hasHideButton = false;
        this.changed.emit();
      }
    }).bind(this), 2);
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

  isOrExp(exp: Experience): Stat[] | undefined {
    return 'Or' in exp ? exp.Or : undefined;
  }

  isStar(exp: Experience): Stat | undefined {
    if ('Or' in exp) return undefined;//TODO figure out if this case is correct
    switch(exp.Kind) {
      case Statistic.Attribute:
        return undefined;//TODO figure out if this case is correct or even possible
      case Statistic.Skill:
        if ('Subskill' in exp && exp.Subskill === '*') return {...exp};
        if ('Speciality' in exp && exp.Speciality === '*') return {...exp};
        return undefined;
      case Statistic.Trait:
        switch(exp.Trait) {
          case Trait.Compulsion:
            if ('Trigger' in exp && exp.Trigger === '*') return {...exp};
            else return undefined;
          default:
            return undefined;
        }
      default:
        return undefined;
    }
  }
}

