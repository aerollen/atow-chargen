import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationInfo, Subaffiliation } from 'src/app/affiliation/affiliation';
import { Stat, Skill, Statistic, Experience, Trait } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';

@Component({
  selector: 'app-stage0-aff',
  templateUrl: './aff.component.html',
  styleUrls: ['./aff.component.scss']
})
export class AffComponent implements AfterViewInit, OnDestroy {

  @Input({ required: true }) affiliations!: (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)[];
  @Output() affiliationChanged = new EventEmitter<(AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>)>();
  @Output() languageChanged = new EventEmitter<Experience>();
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('langsel') langsel!: ElementRef<HTMLSelectElement>;

  currentAffiliationIndex?: number;
  currentLangIndex?:number;

  get isComplete(): boolean {
    return this.currentLangIndex !== undefined && this.currentAffiliationIndex !== undefined && this.exp.isComplete;
  }

  get currentAffiliation(): (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>) | undefined {
    return this.currentAffiliationIndex !== undefined ? this.affiliations[this.currentAffiliationIndex] : undefined;
  }

  get subaffiliations(): Subaffiliation[] {
    return this.currentAffiliation ? this.currentAffiliation.Subaffiliations : [];
  }

  get languages(): Array<Stat & { Skill: Skill.Language, Kind: Statistic.Skill }> {
    return this.currentAffiliation ? [this.currentAffiliation.PrimaryLanguage, ...this.currentAffiliation.SecondaryLanguages] : [];
  }

  get affSubTotal():number {
    return this.currentAffiliation ? this.currentAffiliation.Experience.reduce((a, b) => a+b.Quantity, 0) : 0;
  }

  private subscriptions: Subscription[] = [];
  constructor(
    private ref: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.exp.choice.subscribe(_ => {
      this.ref.detectChanges();  
      this.ref.markForCheck();  
    }))
  }

  ngOnDestroy(): void {
    [...this.subscriptions].forEach(sub => sub.unsubscribe());
  }

  langselChanged(_: Event) {
    if(this.currentLangIndex === undefined) return;
    this.languageChanged.emit({ ...this.languages[this.currentLangIndex], Quantity: 20 })
  }

  currentAffiliationChanged(_: Event) {
    this.affiliationChanged.emit(this.currentAffiliation);
  }
}
