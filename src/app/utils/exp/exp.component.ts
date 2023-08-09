import {  AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChildren } from '@angular/core';
import { Experience, Stat, Statistic, Trait } from '../common';
import { OrExpComponent } from '../or-exp/or-exp.component';
import { StarExpComponent } from '../star-exp/star-exp.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) values!: Experience[];
  @ViewChildren(OrExpComponent) orChoices!: QueryList<OrExpComponent>;
  @ViewChildren(StarExpComponent) starChoices!: QueryList<StarExpComponent>;
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();
  @Output() completed = new EventEmitter<never>();

  get isComplete(): boolean {
    return [...(this.orChoices ? this.orChoices : []), ...(this.starChoices ? this.starChoices : [])].map(choice => choice.isComplete).reduce((a, b) => a && b, true);
  }

  get experience(): Experience[] {
    return [
      ...this.values.filter(exp => !this.isOrExp(exp) && !this.isStar(exp)), 
      // if we try to access these values at the wrong time then or and star might not be initialized yet
      ...[...(this.orChoices ? this.orChoices : []), ...(this.starChoices ? this.starChoices : [])]
        //we will filter out incomplete choices as that will ensure all remaining have a defined experience property
        .filter(choice => choice.isComplete).map(choice => choice.experience!)
    ]
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
          this.sendUpdate(change);
        }));
      });
    }));
    this.subscriptions.push(this.starChoices.changes.subscribe((choice: QueryList<StarExpComponent>) => {
      [...this.starSubs].forEach(_ => {
        this.starSubs.shift()?.unsubscribe();
      });
      choice.forEach(star => {
        this.starSubs.push(star.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));
  }

  private sendUpdate(change: Record<'add',Experience[]> & Record<'remove', Experience[]>) {
    this.choice.emit(change);
    if (this.isComplete) this.completed.emit();
  }

  ngOnDestroy(): void {
    [...this.subscriptions, ...this.orSubs, ...this.starSubs].forEach(sub => sub.unsubscribe());
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
