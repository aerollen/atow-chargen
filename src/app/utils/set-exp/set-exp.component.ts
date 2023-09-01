import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Experience, Stat, Statistic, clamp } from '../common';
import { PickExpComponent } from '../pick-exp/pick-exp.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-set-exp',
  templateUrl: './set-exp.component.html',
  styleUrls: ['./set-exp.component.scss']
})
export class SetExpComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input({ required: true}) limit!: Exclude<number, 0>;
  @Input({ required: true}) options!: (Stat & { Limit?: number })[];
  @Input() enlist: boolean = true;

  @ViewChild('picker') picker!: PickExpComponent;
  @ViewChild('speciality') speciality!: ElementRef<HTMLInputElement>;
  @ViewChild('counter') counter!: ElementRef<HTMLInputElement>;
  @ViewChild('recSetExp') recSetExp?: SetExpComponent;

  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();
  
  private _propertLimit?: number;
  get properLimit(): number {
    return this._propertLimit ?? this.limit;
  }

  set properLimit(value: number) {
    this._propertLimit = Math.sign(this.limit) > 0 ? Math.min(this.limit, value) : Math.max(this.limit, value);
  }

  _quantity: number = 0;
  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = clamp(value, this.min, this.max);
    this.ref.detectChanges();
    this.ref.markForCheck();

    if(this.recSetExp) {
      this.recsub?.unsubscribe();
      this.recsub = undefined;
      this.recsub = this.recSetExp.choice.subscribe(values => {
        this.choice.emit(values);
      });
    }
  }

  get min(): number {
    return Math.min(this.properLimit, Math.sign(this.properLimit));
  }

  get max(): number {
    return Math.max(this.properLimit, Math.sign(this.properLimit));
  }

  get remaining(): number {
    const current = this.limit - this.quantity;

    return Math.sign(this.limit) > 0 ? clamp(current, 0, Math.max(this.limit, Math.sign(this.limit))) : clamp(current, Math.min(this.limit, Math.sign(this.limit)), 0);
  }

  get unspent(): number {
    return this.remaining + (this.recSetExp?.unspent ?? 0);
  }

  get total(): number {
    return this.quantity + (this.recSetExp?.total ?? 0);
  }

  get subtotal(): number {
    return !!this.recSetExp ? this.total - this.quantity : 0;
  }

  get isComplete(): boolean {
    const validQuantity = this.quantity >= this.min && this.max >= this.quantity;
    const pickerComplete = (this.picker?.isComplete ?? false);
    const recursiveComplete = ((!!this.recSetExp) ? (this.recSetExp?.isComplete!) : (this.remaining === 0));
    return validQuantity && pickerComplete && recursiveComplete;
  }

  get experience(): Experience[] {
    return [...this.picker.experience.map(exp => {
      const skill = this.isSkill(exp);
      const speciality = this.speciality?.nativeElement.value
      if(skill && speciality !== undefined) return this.handleSpeciality(skill, speciality);
      else return exp;
    }), ...(this.recSetExp?.experience ?? [])];
  }

  private subscriptions: Subscription[] = [];
  private recsub: Subscription | undefined;
  constructor(private ref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.quantity = Math.sign(this.properLimit) > 0 ? this.max : this.min;
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.picker.choice.subscribe(changes => {
        const value = this.hasLimit(changes.add[0]);
        if(value) {
          this.properLimit = value.Limit;
          this.quantityChanged();
        }
        this.onChange();
      }),
      this.picker.completed.subscribe(() => {
        this.onChange();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.recsub?.unsubscribe();
  }

  quantityChanged(_?:Event){
    if(isNaN(this.counter.nativeElement.valueAsNumber)) {
      this.ref.markForCheck();
      this.counter.nativeElement.valueAsNumber = this.quantity;
      this.ref.detectChanges();
      return;
    }
    this.ref.markForCheck();
    const clamped = clamp(this.counter.nativeElement.valueAsNumber, this.min, this.max);
    this.counter.nativeElement.valueAsNumber = clamped;
    this.quantity = clamped;

  
    if(this.total !== this.limit) {
      const diff = this.limit - this.total;
      if(this.recSetExp) {
        this.recSetExp.quantity += diff
      } else {
        this.quantity += diff;
      }
    }
    this.ref.detectChanges();

    this.onChange();
  }

  private previous: Experience[] = [];
  onChange() {
    if(this.isComplete) this.choice.emit({
      add: this.experience,
      remove: this.previous
    });

    this.previous = this.experience.map(exp => { return { ...exp, Quantity: -exp.Quantity }})
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  isSkill(exp: Experience): (Experience & { Kind: Statistic.Skill }) | undefined {
    if('Kind' in exp && exp.Kind === Statistic.Skill) return exp;
    return undefined;
  }

  hasLimit(stat: Experience & { Limit?: number }): (Experience & Record<'Limit', number>) | undefined {
    return stat.Limit !== undefined ? { ...stat, Limit: stat.Limit } : undefined
  }

  handleSpeciality(skill: (Experience & { Kind: Statistic.Skill }), speciality:string ): (Experience & { Kind: Statistic.Skill }) {
    if('Speciality' in skill) {
      if(speciality.length > 0) {
        skill.Speciality = speciality;
      } else {
        delete skill.Speciality;
      }
    } else {
      if(speciality.length > 0) {
        Object.assign(skill, { Speciality:speciality });
      } else {
        //If the Speciality property is missing and we dont have an input value just return as there is nothing to do.
      }
    }
    return skill;
  }

  specialityBlur(_:Event) {
    const speciality = this.speciality.nativeElement.value;
    const skill = this.isSkill(this.experience[0])!;

    this.handleSpeciality(skill, speciality);

    this.onChange();
  }
}
