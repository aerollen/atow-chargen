import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationInfo, Subaffiliation } from 'src/app/affiliation/affiliation';
import { Stat, Skill, Statistic, Experience, Requirment, Citation } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';

@Component({
  selector: 'app-stage0-aff',
  templateUrl: './aff.component.html',
  styleUrls: ['./aff.component.scss']
})
export class AffComponent implements AfterViewInit, OnDestroy {

  @Input({ required: true }) affiliations!: (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)[];
  @Output() affiliationChanged = new EventEmitter<(AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)>();
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('affSel') affSel!: ElementRef<HTMLSelectElement>;

  currentAffiliationIndex?: number;

  get experience(): Experience[] {
    return [
      ...this.exp.experience,
    ]
  }

  get requirments(): Requirment[] {
    return [];
  }

  get isComplete(): boolean {
    return this.currentAffiliationIndex !== undefined && this.exp.isComplete;
  }

  get currentAffiliation(): (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>) | undefined {
    return this.currentAffiliationIndex !== undefined ? this.affiliations[this.currentAffiliationIndex] : undefined;
  }

  get subaffiliations(): Subaffiliation[] {
    return this.currentAffiliation ? this.currentAffiliation.Subaffiliations : [];
  }

  get affSubTotal():number {
    return this.currentAffiliation ? this.currentAffiliation.Experience.reduce((a, b) => a+b.Quantity, 0) : 0;
  }

  private subscriptions: Subscription[] = [];
  constructor(
    private ref: ChangeDetectorRef) {

  }


  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.exp.choice.subscribe(choice => {
        this.choice.emit(choice);
        this.ref.detectChanges();  
        this.ref.markForCheck();  
      }),
      this.exp.completed.subscribe(() => {
        this.ref.detectChanges();  
        this.ref.markForCheck();
      }));
  }

  ngOnDestroy(): void {
    [...this.subscriptions].forEach(sub => sub.unsubscribe());
  }

  currentAffiliationChanged(_: Event) {
    this.affiliationChanged.emit(this.currentAffiliation);
    this.ref.detectChanges();  
    this.ref.markForCheck(); 
  }
}
