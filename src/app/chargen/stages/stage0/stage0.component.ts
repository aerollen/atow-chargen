import { Component, Input, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationsService } from 'src/app/affiliation/affiliations.service';
import { Archtype, Experience, Requirment, Skill, Stat, Statistic } from 'src/app/utils/common';
import { DefaultExpComponent } from './default-exp/default-exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';

@Component({
  selector: 'app-stage0',
  templateUrl: './stage0.component.html',
  styleUrls: ['./stage0.component.scss']
})
export class Stage0Component implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) startingYear!: number;
  @Input({ required: true }) archtype!: Archtype | undefined;

  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() languageChanged = new EventEmitter<Experience>();


  @ViewChild('default') default!: DefaultExpComponent;
  @ViewChild('aff') aff!: NewaffComponent;
  @ViewChild('langsel') langsel!: ElementRef<HTMLSelectElement>;

  currentLangIndex?:number;

  get currentAffiliation(): AffiliationInfo | undefined {
    return this.aff?.currentAffiliation;
  }

  get isComplete(): boolean {
    return this.currentLangIndex !== undefined && this.aff.isComplete;
  }

  private get language(): Experience | undefined {
    return this.currentLangIndex !== undefined ? { ...this.languages[this.currentLangIndex], Quantity: 20 } : undefined;
  }
  
  get languages(): Array<Stat & { Skill: Skill.Language, Kind: Statistic.Skill }> {
    return this.currentAffiliation ? [this.currentAffiliation.PrimaryLanguage, ...this.currentAffiliation.SecondaryLanguages] : [];
  }

  get experience(): Experience[] {
    return [
      ...(this.language ? [this.language] : []),
      ...this.default.defaultExperience,
    ]
  }

  get affiliationExperience(): Experience[] {
    return this.aff.experience;
  }

  get requirments(): Requirment[] {
    return [];
  }

  get affiliationRequirments(): Requirment[] {
    return this.aff.requirments;
  }

  private subscriptions: Subscription[] = [];
  constructor(
    public affliliationService: AffiliationsService,
    private ref: ChangeDetectorRef) {

  }
  
  ngOnInit(): void {
    this.currentLangIndex === undefined
  }

  langselChanged(_: Event) {
    if(this.currentLangIndex !== undefined) this.languageChanged.emit(this.language);
    
    this.ref.detectChanges();  
    this.ref.markForCheck(); 
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.aff.changed.subscribe(() => {
        this.checkForComplete();
      }),
      this.aff.complete.subscribe((_) => {
        this.checkForComplete();
      }),
      this.aff.affiliationChanged.subscribe((_) => {
        setTimeout((() => {
          this.currentLangIndex === undefined
          this.langsel.nativeElement.selectedIndex = -1;
          this.ref.detectChanges();  
          this.ref.markForCheck(); 
        }).bind(this), 2);
        this.ref.detectChanges();  
        this.ref.markForCheck(); 
      }));
      this.ref.detectChanges();  
      this.ref.markForCheck(); 
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

