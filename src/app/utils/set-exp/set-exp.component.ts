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

  @ViewChild('picker') picker!: PickExpComponent;
  @ViewChild('speciality') speciality!: ElementRef<HTMLInputElement>;
  @ViewChild('counter') counter!: ElementRef<HTMLInputElement>;
  @ViewChild('recSetExp') recSetExp?: SetExpComponent;

  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();
  
  _quantity: number = 0;
  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  get min(): number {
    return Math.min(this.limit, Math.sign(this.limit));
  }

  get max(): number {
    return Math.max(this.limit, Math.sign(this.limit));
  }

  get remaining(): number {
    return Math.sign(this.max) > 0 ? this.max-this.quantity : this.min-this.quantity;
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
  constructor(private ref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.quantity = Math.sign(this.limit) > 0 ? this.max : this.min;
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.picker.choice.subscribe(_ => {      
        this.onChange();
      }),
      this.picker.completed.subscribe(() => {
        this.onChange();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  quantityChanged(_:Event){
    const clamped = clamp(this.counter.nativeElement.valueAsNumber, this.min, this.max);
    this.counter.nativeElement.valueAsNumber = clamped;
    this.quantity = clamped;
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
