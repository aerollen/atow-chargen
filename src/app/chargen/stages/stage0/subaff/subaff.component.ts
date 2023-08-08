import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subaffiliation } from 'src/app/affiliation/affiliation';
import { Experience, Stat, Statistic, Trait } from 'src/app/utils/common';
import { OrExpComponent } from 'src/app/utils/or-exp/or-exp.component';
import { StarExpComponent } from 'src/app/utils/star-exp/star-exp.component';

@Component({
  selector: 'app-stage0-subaff',
  templateUrl: './subaff.component.html',
  styleUrls: ['./subaff.component.scss']
})
export class SubaffComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) subaffiliations!: Subaffiliation[];
  @Output() subaffiliationChanged = new EventEmitter<Subaffiliation>();
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();
  @ViewChildren(OrExpComponent) orChoices!: QueryList<OrExpComponent>;
  @ViewChildren(StarExpComponent) starChoices!: QueryList<StarExpComponent>;

  get isComplete(): boolean {
    if (this.subaffiliations.length === 0) return false;
    if (this.currentSubaffiliationIndex === undefined) return false;
    return (!!this.currentSubaffiliation) && [...this.orChoices, ...this.starChoices].map(choice => choice.isComplete).reduce((a, b) => a && b, true);
  }

  currentSubaffiliationIndex?: number;
  get currentSubaffiliation(): Subaffiliation | undefined {
    return this.currentSubaffiliationIndex !== undefined ? this.subaffiliations[this.currentSubaffiliationIndex] : undefined;
  }

  get subaffSubTotal(): number {
    return this.currentSubaffiliation ? this.currentSubaffiliation.Experience.reduce((a, b) => a+b.Quantity, 0) : 0;
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
      choice.forEach(star => {
        this.starSubs.push(star.choice.subscribe(change => {
          this.choice.emit(change);
        }));
      });
    }));
  }

  ngOnDestroy(): void {
    [...this.subscriptions, ...this.orSubs, ...this.starSubs].forEach(sub => sub.unsubscribe());
  }

  currentSubaffiliationChanged(e: any) {
    this.subaffiliationChanged.emit(this.currentSubaffiliation);
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
