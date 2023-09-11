import {  AfterViewInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChildren } from '@angular/core';
import { Experience, Stat, Statistic, Trait } from '../common';
import { OrExpComponent } from '../or-exp/or-exp.component';
import { StarExpComponent } from '../star-exp/star-exp.component';
import { Subscription } from 'rxjs';
import { PickExpComponent } from '../pick-exp/pick-exp.component';
import { SetExpComponent } from '../set-exp/set-exp.component';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) values!: Experience[];
  @ViewChildren(OrExpComponent) orChoices!: QueryList<OrExpComponent>;
  @ViewChildren(StarExpComponent) starChoices!: QueryList<StarExpComponent>;
  @ViewChildren(PickExpComponent) pickChoices!: QueryList<PickExpComponent>;
  @ViewChildren(SetExpComponent) setChoices!: QueryList<PickExpComponent>;
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();
  @Output() completed = new EventEmitter<never>();

  get isComplete(): boolean {
    const toCheck = [
      ...(this.orChoices ?? []), 
      ...(this.starChoices ?? []),
      ...(this.pickChoices ?? []),
      ...(this.setChoices ?? [])];
    return toCheck.map(choice => choice.isComplete).reduce((a, b) => a && b, true);
  }

  get experience(): Experience[] {
    return [
      ...this.values.filter(exp => this.isStd(exp)), 
      // if we try to access these values at the wrong time then or and star might not be initialized yet
      ...[
        ...(this.orChoices ?? []), 
        ...(this.starChoices ?? []),
        ...(this.pickChoices ?? []),
        ...(this.setChoices ?? [])
      ]
        //we will filter out incomplete choices as that will ensure all remaining have a defined experience property
        .flatMap(choice => choice.experience!)
        .filter(exp => !!exp)
    ]
  }

  private subscriptions: Subscription[] = [];
  private orSubs: Subscription[] = [];
  private starSubs: Subscription[] = [];
  private pickSubs: Subscription[] = [];
  private setSubs: Subscription[] = [];

  constructor(private ref: ChangeDetectorRef) {

  }

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
    this.subscriptions.push(this.pickChoices.changes.subscribe((choice: QueryList<PickExpComponent>) => {
      [...this.pickSubs].forEach(_ => {
        this.pickSubs.shift()?.unsubscribe();
      });
      choice.forEach(pick => {
        this.pickSubs.push(pick.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
      choice.forEach(pick => {
        this.pickSubs.push(pick.completed.subscribe(() => {
          if (this.isComplete) this.completed.emit();

          this.ref.detectChanges();
          this.ref.markForCheck();
        }));
      });
    }));
    this.subscriptions.push(this.setChoices.changes.subscribe((choice: QueryList<SetExpComponent>) => {
      [...this.setSubs].forEach(_ => {
        this.setSubs.shift()?.unsubscribe();
      });
      choice.forEach(set => {
        this.setSubs.push(set.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));
  }

  private sendUpdate(change: Record<'add',Experience[]> & Record<'remove', Experience[]>) {
    this.choice.emit(change);
    if (this.isComplete) this.completed.emit();

    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  ngOnDestroy(): void {
    [...this.subscriptions, ...this.orSubs, ...this.starSubs, ...this.pickSubs, ...this.setSubs].forEach(sub => sub.unsubscribe());
  }

  isOr(exp: Experience): Stat[] | undefined {
    return 'Or' in exp ? exp.Or : undefined;
  }

  isPick(exp: Experience): { Count: number, Options: Stat[], Quantity: number } | undefined {
    return 'Pick' in exp ? { ...exp.Pick, Quantity: exp.Quantity } : undefined;
  }

  isSet(exp: Experience): { Options: ((Stat & Partial<Record<'Limit', number>>))[], Quantity: number } | undefined {
    return 'Set' in exp ? { ...exp.Set, Quantity: exp.Quantity } : undefined;
  }

  isStar(exp: Experience): Stat | undefined {
    if ('Or' in exp) return undefined;//TODO figure out if this case is correct
    if ('Pick' in exp) return undefined;//TODO figure out if this case is correct
    if ('Set' in exp) return undefined;
    switch(exp.Kind) {
      case Statistic.Attribute:
        return undefined;//TODO figure out if this case is correct or even possible
      case Statistic.Skill:
        if ('Subskill' in exp && (exp.Subskill === '*' || exp.Subskill instanceof RegExp)) return {...exp};
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

  isStd(exp: Experience): boolean {
    return !(this.isOr(exp) || this.isStar(exp) || this.isPick(exp) || this.isSet(exp));
  }
}
