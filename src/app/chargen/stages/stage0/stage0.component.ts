import { Component, Input, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationsService } from 'src/app/affiliation/affiliations.service';
import { Archtype, Experience, Requirment } from 'src/app/utils/common';
import { DefaultExpComponent } from './default-exp/default-exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';

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
  @ViewChild('aff') aff!: NewaffComponent;

  get currentAffiliation(): AffiliationInfo | undefined {
    return this.aff?.currentAffiliation;
  }

  get isComplete(): boolean {
    return this.aff.isComplete;
  }

  get experience(): Experience[] {
    return [
      ...this.default.defaultExperience,
      ...this.aff.experience
    ]
  }

  get requirments(): Requirment[] {
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
      }));
  }

  hasHideButton: boolean = false;
  checkForComplete() {
    setTimeout((() => {
      if (this.isComplete) {
        //this should probaly emit all the completed info
        this.complete.emit(this.experience);
        this.hasHideButton = true;
      } else {
        this.hasHideButton = false;
        this.changed.emit();
      }
    }).bind(this), 2);
    this.ref.detectChanges();  
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

