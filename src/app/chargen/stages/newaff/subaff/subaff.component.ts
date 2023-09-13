import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subaffiliation } from 'src/app/affiliation/affiliation';
import { Experience, Requirement } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';

@Component({
  selector: 'app-stage0-subaff',
  templateUrl: './subaff.component.html',
  styleUrls: ['./subaff.component.scss']
})
export class SubaffComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) subaffiliations!: Subaffiliation[];
  @Output() subaffiliationChanged = new EventEmitter<Subaffiliation>();
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();
  @ViewChild('exp') exp!: ExpComponent;

  get experience(): Experience[] {
    return this.exp ? this.exp.experience : [];
  }

  get requirments(): Requirement[] {
    return [];
  }

  get isComplete(): boolean {
    if ((this.subaffiliations?.length ?? 0) === 0) return false;
    if (this.currentSubaffiliationIndex === undefined) return false;
    return (!!this.currentSubaffiliation) && this.exp.isComplete;
  }

  currentSubaffiliationIndex?: number;
  get currentSubaffiliation(): Subaffiliation | undefined {
    return this.currentSubaffiliationIndex !== undefined ? this.subaffiliations[this.currentSubaffiliationIndex] : undefined;
  }

  get subaffSubTotal(): number {
    return this.currentSubaffiliation ? this.currentSubaffiliation.Experience.reduce((a, b) => a+b.Quantity, 0) : 0;
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

  currentSubaffiliationChanged(e: any) {
    this.subaffiliationChanged.emit(this.currentSubaffiliation);
    this.ref.detectChanges();  
    this.ref.markForCheck(); 
  }
}
