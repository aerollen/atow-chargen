import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationInfo, Subaffiliation } from 'src/app/affiliation/affiliation';
import { AffiliationsService } from 'src/app/affiliation/affiliations.service';
import { Experience, Requirement } from 'src/app/utils/common';
import { AffComponent } from './aff/aff.component';
import { SubaffComponent } from './subaff/subaff.component';

@Component({
  selector: 'app-newaff',
  templateUrl: './newaff.component.html',
  styleUrls: ['./newaff.component.scss']
})
export class NewaffComponent implements AfterViewInit, OnDestroy {
  @Input() excludedAffiliations?: AffiliationInfo[];
  @Input({ required: true }) currentYear!: number;
  
  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() affiliationChanged = new EventEmitter<AffiliationInfo>();

  @ViewChild('aff') aff!: AffComponent;
  @ViewChild('subaff') subaff!: SubaffComponent;

  get currentAffiliation(): AffiliationInfo | undefined {
    return this.aff.currentAffiliation;
  }

  get isComplete(): boolean {
    const affcompleted = this.aff?.isComplete ?? false;
    const subaffcompleted = this.subaff?.isComplete ?? false
    return affcompleted && subaffcompleted;
  }

  get experience(): Experience[] {
    return [...this.aff.experience, ...this.subaff.experience];
  }

  get requirments(): Requirement[] {
    return [...this.aff.requirments, ...this.subaff.requirments];
  }

  get affiliations():  (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)[]  {
    const gottenAffs = this.affliliationService.At(this.currentYear);
    const exAffs = (this.excludedAffiliations ? this.excludedAffiliations : []).map(exaff => exaff.Name);
    return gottenAffs.filter(aff => !exAffs.includes(aff.Name));
  }
  
  private subscriptions: Subscription[] = [];
  constructor(
    public affliliationService: AffiliationsService,
    private ref: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.aff.choice.subscribe(_ => {
        this.checkForComplete();
      }),
      this.aff.affiliationChanged.subscribe(_ => {
        this.affiliationChanged.emit(this.currentAffiliation);
        this.checkForComplete();
      }),
      this.subaff.subaffiliationChanged.subscribe(_ => {
        this.affiliationChanged.emit(this.currentAffiliation);
        this.checkForComplete();
      }),
      this.subaff.choice.subscribe(_ => {
        this.checkForComplete();
      })
    );
    this.ref.detectChanges();  
    this.ref.markForCheck(); 
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  checkForComplete() {
    this.ref.detectChanges();  
    if (this.isComplete) {
      //this should probaly emit all the completed info
      this.complete.emit(this.experience);
    } else {
      this.changed.emit();
    }
    this.ref.markForCheck();  
  }
}
