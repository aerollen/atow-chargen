import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Stage, Range, Book, Citation } from 'src/app/utils/common';
import { RngService } from 'src/app/utils/rng.service';

@Component({
  selector: 'app-random-life-event',
  templateUrl: './random-life-event.component.html',
  styleUrls: ['./random-life-event.component.scss']
})
export class RandomLifeEventComponent implements OnInit {
  @Input({ required: true }) stage!: Exclude<Stage, 0>;

  currentRoll!: Range<2, 13>;
  rerollCount: number = 0;
  acceptance = false;
  modifiers: number = 0;

  citation: Citation = {
    Book: Book.ATimeOfWarCompanion,
    Page: 77
  }

  get isComplete(): boolean {
    return this.acceptance && false; //TODO finish this
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

  constructor(private rng: RngService,  private ref: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    this.currentRoll = this.rng.Roll() + this.rng.Roll() as Range<2, 13>;
  }

  reroll() {
    this.currentRoll = this.rng.Roll() + this.rng.Roll() as Range<2, 13>;
    this.rerollCount = this.rerollCount+1;
  }

  acceptRoll(_:Event) {
    this.acceptance = !this.acceptance
    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  round(numerator: number, denominator: number): number {
    return Math.ceil(numerator / denominator);
  }
}

