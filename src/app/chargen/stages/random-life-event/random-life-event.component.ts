import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { Stage, Range, Book, Citation, Attribute, EnumMap, Skill, Stat, Statistic, Trait, Experience } from 'src/app/utils/common';
import { RngService } from 'src/app/utils/rng.service';
import { SetExpComponent } from 'src/app/utils/set-exp/set-exp.component';

@Component({
  selector: 'app-random-life-event',
  templateUrl: './random-life-event.component.html',
  styleUrls: ['./random-life-event.component.scss']
})
export class RandomLifeEventComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) stage!: Exclude<Stage, 0>;

  @ViewChildren(SetExpComponent) setExp!: QueryList<SetExpComponent>;

  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();

  currentRoll!: Range<2, 13>;
  rerollCount: number = 0;
  acceptance = false;
  modifiers: number = 0;

  citation: Citation = {
    Book: Book.ATimeOfWarCompanion,
    Page: 77
  }

  traitAndAttStats = [
    ...EnumMap(Attribute).map<Stat>(att => { return { Kind: Statistic.Attribute, Attribute: <Attribute>att }}),
    ...EnumMap(Trait).map<Stat>(trait => { return { Kind: Statistic.Trait, Trait: trait }}),
  ]
  anyStats = [
    ...this.traitAndAttStats,
    ...EnumMap(Skill).map<Stat>(skill => { return { Kind: Statistic.Skill, Skill: skill }})
  ]

  get isComplete(): boolean {
    const reduce = this.currentRoll !== 7 ? this.setExp.reduce((sofar, current) => sofar && current.isComplete, true) : true;
    return this.acceptance && reduce;
  }

  get outcome(): {
    Severity: string,
    Experience: { [stage in Exclude<Stage, 0>]: number },
    Denominator?:  2 | 3
  } {
    const effectiveRoll: Range<2, 13> = Math.min(Math.max(this.currentRoll + this.modifiers, 2), 12) as Range<2, 13>;

    switch(effectiveRoll) {
      case 2:
        return {
          Severity: 'Catastrophic!',
          Experience: {
            1: -100,
            2: -200,
            3: -400,
            4: -500
          },
          Denominator: 2,
        };
      case 3:
        return {
          Severity: 'Horrific!',
          Experience: {
            1: -75,
            2: -150,
            3: -300,
            4: -375
          },
          Denominator: 3
        };
      case 4:
        return {
          Severity: 'Terrible!',
          Experience: {
            1: -50,
            2: -100,
            3: -200,
            4: -250
          },
        };
      case 5:
        return {
          Severity: 'Bad',
          Experience: {
            1: -25,
            2: -50,
            3: -100,
            4: -125
          }
        };
      case 6:
        return {
          Severity: 'Not So Bad',
          Experience: {
            1: -10,
            2: -20,
            3: -50,
            4: -60
          }
        };
      case 7:
        return {
          Severity: 'Mundane',
          Experience: {
            1: 0,
            2: 0,
            3: 0,
            4: 0
          }
        };
      case 8:
        return {
          Severity: 'Medicore',
          Experience: {
            1: 10,
            2: 20,
            3: 50,
            4: 60
          }
        };
      case 9:
        return {
          Severity: 'Pretty Good',
          Experience: {
            1: 25,
            2: 50,
            3: 100,
            4: 125
          }
        };
      case 10:
        return {
          Severity: 'Great!',
          Experience: {
            1: 50,
            2: 100,
            3: 200,
            4: 250
          }
        };
      case 11:
        return {
          Severity: 'Awesome!',
          Experience: {
            1: 75,
            2: 150,
            3: 300,
            4: 375
          },
          Denominator: 3
        };
      case 12:
        return {
          Severity: 'Blessed!',
          Experience: {
            1: 100,
            2: 200,
            3: 400,
            4: 500
          },
          Denominator: 2
        };
    }
  }

  get experience(): Experience[] {
    return this.setExp ? this.setExp.filter(exp => exp.isComplete).map(exp => exp.experience).flatMap(exp => exp) : [];
  }

  constructor(private rng: RngService,  private ref: ChangeDetectorRef) {
    
  }

  private subscriptions: Subscription[] = [];
  private setSubs: Subscription[] = [];
  ngAfterViewInit(): void {
    this.subscriptions.push(this.setExp.changes.subscribe((change: QueryList<SetExpComponent>) => {
      this.setSubs.forEach(sub => sub.unsubscribe());
      change.forEach(set => {
        this.setSubs.push(set.choice.subscribe(_ => {
          this.changed.emit();
          if(this.isComplete) this.complete.emit(this.experience);
          this.ref.detectChanges();  
          this.ref.markForCheck();
        }));
      });
    }));
    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  ngOnDestroy(): void {
    [...this.subscriptions, ...this.setSubs].forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.currentRoll = this.rng.Roll() + this.rng.Roll() as Range<2, 13>;
    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  reroll() {
    this.currentRoll = this.rng.Roll() + this.rng.Roll() as Range<2, 13>;
    this.rerollCount = this.rerollCount+1;
  }

  acceptRoll(_:Event) {
    this.acceptance = !this.acceptance
    if(this.isComplete) this.complete.emit(this.experience);
    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  round(numerator: number, denominator: number): number {
    return Math.ceil(numerator / denominator);
  }
}

