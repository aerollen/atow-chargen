import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationInfo, Subaffiliation } from 'src/app/affiliation/affiliation';
import { Stat, Skill, Statistic, Experience, Trait } from 'src/app/utils/common';
import { OrExpComponent } from 'src/app/utils/or-exp/or-exp.component';
import { StarExpComponent } from 'src/app/utils/star-exp/star-exp.component';

@Component({
  selector: 'app-stage0-aff',
  templateUrl: './aff.component.html',
  styleUrls: ['./aff.component.scss']
})
export class AffComponent implements AfterViewInit, OnDestroy {

  @Input({ required: true }) affiliations!: (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)[];
  @Output() affiliationChanged = new EventEmitter<(AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)>();
  @Output() languageChanged = new EventEmitter<Experience>();
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();

  @ViewChildren(OrExpComponent) orChoices!: QueryList<OrExpComponent>;
  @ViewChildren(StarExpComponent) starChoices!: QueryList<StarExpComponent>;
  @ViewChild('langsel') langsel!: ElementRef<HTMLSelectElement>

  currentAffiliationIndex?: number;
  currentLangIndex?:number;

  get isComplete(): boolean {
    return this.currentLangIndex !== undefined && this.currentAffiliationIndex !== undefined && [...this.orChoices, ...this.starChoices].map(choice => choice.isComplete).reduce((a, b) => a && b, true);
  }

  get currentAffiliation(): (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>) | undefined {
    return this.currentAffiliationIndex !== undefined ? this.affiliations[this.currentAffiliationIndex] : undefined;
  }

  get subaffiliations(): Subaffiliation[] {
    return this.currentAffiliation ? this.currentAffiliation.Subaffiliations : [];
  }

  get languages(): Array<Stat & { Skill: Skill.Language, Kind: Statistic.Skill }> {
    return this.currentAffiliation ? [this.currentAffiliation.PrimaryLanguage, ...this.currentAffiliation.SecondaryLanguages] : [];
  }

  get affSubTotal():number {
    return this.currentAffiliation ? this.currentAffiliation.Experience.reduce((a, b) => a+b.Quantity, 0) : 0;
  }

  private subscriptions: Subscription[] = [];
  private orSubs: Subscription[] = [];
  private starSubs: Subscription[] = [];
  ngAfterViewInit(): void {
    this.subscriptions.push(this.orChoices.changes.subscribe((choice: QueryList<OrExpComponent>) => {
      [...this.orSubs].forEach(_ => {
        this.orSubs.shift()?.unsubscribe();
      });
      choice.forEach(or => {
        this.orSubs.push(or.choice.subscribe(change => {
          this.choice.emit(change);
        }));
      });
    }));
    this.subscriptions.push(this.starChoices.changes.subscribe((choice: QueryList<StarExpComponent>) => {
      [...this.starSubs].forEach(_ => {
        this.starSubs.shift()?.unsubscribe();
      });
      choice.forEach(or => {
        this.starSubs.push(or.choice.subscribe(change => {
          this.choice.emit(change);
        }));
      });
    }));
  }

  ngOnDestroy(): void {
    [...this.subscriptions, ...this.orSubs, ...this.starSubs].forEach(sub => sub.unsubscribe());
  }

  langselChanged(_: Event) {
    if(!this.currentLangIndex) return;
    this.languageChanged.emit({ ...this.languages[this.currentLangIndex], Quantity: 20 })
  }

  currentAffiliationChanged(_: Event) {
    this.affiliationChanged.emit(this.currentAffiliation);
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
