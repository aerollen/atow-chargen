import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationInfo, Subaffiliation } from 'src/app/affiliation/affiliation';
import { AffiliationsService } from 'src/app/affiliation/affiliations.service';
import { Experience, Requirment } from 'src/app/utils/common';
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

  @ViewChild('aff') aff!: AffComponent;
  @ViewChild('subaff') subaff!: SubaffComponent;

  get isComplete(): boolean {
    const affcompleted = this.aff?.isComplete ?? false;
    const subaffcompleted = this.subaff?.isComplete ?? false
    return affcompleted && subaffcompleted;
  }

  get experience(): Experience[] {
    return [...this.aff.experience, ...this.subaff.experience];
  }

  get requirments(): Requirment[] {
    return [];
  }

  get affiliations():  (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)[]  {
    if(this.currentYear === undefined) return [];
    if(!this.excludedAffiliations || this.excludedAffiliations.length === 0) return this.affliliationService.At(this.currentYear);
    return this.affliliationService.At(this.currentYear).filter(aff => !this.excludedAffiliations!.map(exaff => exaff.Name).includes(aff.Name));
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
        this.checkForComplete();
      }),
      this.aff.languageChanged.subscribe(_ => {
        this.checkForComplete();
      }),
      this.subaff.subaffiliationChanged.subscribe(_ => {
        this.checkForComplete();
      }),
      this.subaff.choice.subscribe(_ => {
        this.checkForComplete();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  checkForComplete() {
    setTimeout((() => {
      if (this.isComplete) {
        //this should probaly emit all the completed info
        this.complete.emit(this.experience);
      } else {
        this.changed.emit();
      }
    }).bind(this), 2);
    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }
}
