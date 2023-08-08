import { Component, Input, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationsService } from 'src/app/affiliation/affiliations.service';
import { Archtype, Experience } from 'src/app/utils/common';
import { AffComponent } from './aff/aff.component';
import { SubaffComponent } from './subaff/subaff.component';

@Component({
  selector: 'app-stage0',
  templateUrl: './stage0.component.html',
  styleUrls: ['./stage0.component.scss']
})
export class Stage0Component implements AfterViewInit, OnDestroy {
  @Input({ required: true }) startingYear!: number;
  @Input({ required: true }) archtype!: Archtype | undefined;

  @Output() complete = new EventEmitter<Experience[]>();

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

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.aff.choice.subscribe(changes => {
        this.checkForComplete();
      }),
      this.aff.affiliationChanged.subscribe(change => {
        this.checkForComplete();
      }),
      this.aff.languageChanged.subscribe(change => {
        this.checkForComplete();
      }),
      this.subaff.subaffiliationChanged.subscribe(change => {
        this.checkForComplete();
      }),
      this.subaff.choice.subscribe(change => {
        this.checkForComplete();
      })
    );
  }

  hasHideButton: boolean = false;
  checkForComplete() {
    setTimeout((() => {
      if (this.isComplete) {
        //this should probaly emit all the completed info
        this.complete.emit([]);
        this.hasHideButton = true;
      } else {
        this.hasHideButton = false;
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
}

