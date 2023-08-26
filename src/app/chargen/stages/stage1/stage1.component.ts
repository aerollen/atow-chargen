import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';
import { BackgroundInfo } from 'src/app/background/background';
import { BackgroundsService } from 'src/app/background/backgrounds.service';
import { Archtype, Book, Citation, Experience, Requirment } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { RandomLifeEventComponent } from '../random-life-event/random-life-event.component';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.component.html',
  styleUrls: ['./stage1.component.scss']
})
export class Stage1Component implements AfterViewInit, OnDestroy {
  @Input() hidden: boolean = false;
  @Input({ required: true }) startingYear!: number;
  @Input({ required: true }) archtype!: Archtype | undefined;
  @Input({ required: true }) startingAffiliation!: AffiliationInfo;

  @Output() backgroundChanged = new EventEmitter<BackgroundInfo>();
  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() affiliationChanged = new EventEmitter<AffiliationInfo>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('changeAff') changeAff!: ElementRef<HTMLInputElement>;
  @ViewChild('newaff') newaff!: NewaffComponent;
  @ViewChild('rle') rle!: RandomLifeEventComponent;

  changeAffState = 'off';

  affChangeCitation: Citation = {
    Book: Book.ATimeOfWar,
    Page: 53
  }

  get affYearChange() {
    return this.startingYear+10; //I know 10 works here because every single background at this stage is 10 years
  }

  get currentAffiliation(): AffiliationInfo {
    return this.newaff?.currentAffiliation ?? this.startingAffiliation;
  }

  get isComplete(): boolean {
    if(this.hidden) return false;
    const check = this.exp.isComplete && this.rle.isComplete;
    if(this.changeAffState === 'off') return check;
    return this.newaff?.isComplete && check;
  }

  get experience(): Experience[] {
    return [...this.exp.experience, ...this.rle.experience];
  }

  get affiliationExperience(): Experience[] {
    return this.changeAffState === 'off' ? this.startingAffiliation.Experience : this.newaff.experience
  }

  get requirments(): Requirment[] {
    return this.currentBackground?.Prereq ? [this.currentBackground.Prereq] : [];
  }

  get affiliationRequirments(): Requirment[] {
    return this.changeAffState === 'off' ? [] : this.newaff.requirments;
  }

  get exAff() : AffiliationInfo[] {
    return this.startingAffiliation ? [this.startingAffiliation] : [];
  }

  private _cache: { [year:number]: BackgroundInfo[] } = {};
  get backgrounds(): BackgroundInfo[] {
    if(this.startingYear in this._cache) 
      return this._cache[this.startingYear];
    else {
      return (this._cache[this.startingYear] = this.backgroundServices.At(this.startingYear, 1));
    }
  }

  get currentBackground(): BackgroundInfo | undefined {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }

  get subtotal():number {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a+('Pick' in b ? b.Pick.Count : 1)*b.Quantity, 0) : 0;
  }

  currentBackgroundIndex?: number;
  subscriptions: Subscription[] = [];
  newaffSubs: Subscription[] = [];
  constructor(
    public backgroundServices: BackgroundsService,
    private ref: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.exp.choice.subscribe(_ => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.exp.completed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.changed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.complete.subscribe(_ => {
      this.checkForComplete();
    }));
  }
  ngOnDestroy(): void {
    [...this.subscriptions, ...this.newaffSubs].forEach(sub => sub.unsubscribe());
  }

  hasHideButton: boolean = false;
  visible: boolean = true;
  toggleVisibility(newState: boolean): void {
    this.visible = newState;

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

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

  currentBackgroundChanged(_: Event) {
    this.backgroundChanged.emit(this.currentBackground);

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  changeAffChanged(_: Event) {
    switch(this.changeAffState) {
      case 'off':
        this.changeAffState = 'on';
        break;
      case 'on':
      default:
        this.changeAffState = 'off';
        break;
    }
    setTimeout((() => {
      switch(this.changeAffState) {
        case 'on':
          this.newaffSubs.push(this.newaff.changed.subscribe(_ => {
            this.checkForComplete();
          }));
          this.newaffSubs.push(this.newaff.complete.subscribe(() => {
            this.affiliationChanged.emit(this.newaff.currentAffiliation);
            this.checkForComplete();
          }));
          this.newaffSubs.push(this.newaff.affiliationChanged.subscribe((_) => {
            this.checkForComplete();
          }));
          break;
        case 'off':
        default:
          this.newaffSubs.forEach(sub => sub.unsubscribe());
          break;
      }
    }).bind(this), 2);

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }
}
