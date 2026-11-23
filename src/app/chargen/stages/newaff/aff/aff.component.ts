import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationInfo, Subaffiliation } from '../../../../affiliation/affiliation';
import { Experience, Requirement, Stat } from '../../../../utils/common';
import { ExpComponent } from '../../../../utils/exp/exp.component';
import { resolveExperienceListSubskills, resolveRequirementSubskills, resolveStatSubskill } from '../../../../utils/affiliation-placeholders';

@Component({
    selector: 'app-stage0-aff',
    templateUrl: './aff.component.html',
    styleUrls: ['./aff.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AffComponent implements AfterViewInit, OnDestroy {

  @Input({ required: true }) affiliations!: (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)[];
  @Input() languageSubskill?: string;
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

  get requirments(): Requirement[] {
    const requirement = this.currentAffiliation?.Prereq;
    if (!requirement || !this.currentAffiliation) return [];
    return [resolveRequirementSubskills(requirement, this.currentAffiliation, this.languageSubskill)!];
  }

  get isComplete(): boolean {
    return this.currentAffiliationIndex !== undefined && this.exp.isComplete;
  }

  get currentAffiliation(): (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>) | undefined {
    return this.currentAffiliationIndex !== undefined ? this.affiliations[this.currentAffiliationIndex] : undefined;
  }

  get resolvedExperience(): Experience[] {
    return resolveExperienceListSubskills(
      this.currentAffiliation?.Experience ?? [],
      this.currentAffiliation,
      this.languageSubskill
    );
  }

  get resolvedFlexibleExperience(): { Quantity: number, Options: Stat[] } {
    const flexible = this.currentAffiliation?.FlexibleExperience;
    if (!flexible || !this.currentAffiliation) return { Quantity: 0, Options: [] };
    return {
      ...flexible,
      Options: flexible.Options.map(option =>
        resolveStatSubskill(option, this.currentAffiliation, this.languageSubskill))
    };
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
