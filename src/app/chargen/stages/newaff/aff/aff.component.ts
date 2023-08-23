import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationInfo, Subaffiliation } from 'src/app/affiliation/affiliation';
import { Stat, Skill, Statistic, Experience, Requirment } from 'src/app/utils/common';
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

  get experience(): Experience[] {
    return [
      ...(this.language ? [this.language] : []),
      ...this.exp.experience,
    ]
  }

  get requirments(): Requirment[] {
    return [];
  }

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

  private get language(): Experience | undefined {
    return this.currentLangIndex !== undefined ? { ...this.languages[this.currentLangIndex], Quantity: 20 } : undefined;
  }
  langselChanged(_: Event) {
    if(this.currentLangIndex !== undefined) this.languageChanged.emit(this.language);

    this.ref.detectChanges();  
    this.ref.markForCheck(); 
  }

  showlang: boolean = true;
  currentAffiliationChanged(_: Event) {
    this.affiliationChanged.emit(this.currentAffiliation);
    this.currentLangIndex === undefined
    this.langsel.nativeElement.selectedIndex = -1;
    this.ref.detectChanges();  
    this.ref.markForCheck(); 
  }
}
