import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Experience, Skill, Stat, Statistic, Trait } from '../common';

@Component({
  selector: 'app-star-exp',
  templateUrl: './star-exp.component.html',
  styleUrls: ['./star-exp.component.scss']
})
export class StarExpComponent {
  @Input({ required: true }) exp!: Experience;
  @Input() showLabel: boolean = true;
  @Input() showQuantity: boolean = true;
  @Input() assignedIndex?: number;

  @ViewChild('compulsionTrigger') compulsionTrigger!: ElementRef<HTMLInputElement>;
  @ViewChild('subskill') subskill!: ElementRef<HTMLInputElement>
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();

  get isComplete(): boolean {
    if ('Or' in this.exp || 'Pick' in this.exp) return true;
    if (this.exp.Kind === Statistic.Trait && this.exp.Trait === Trait.Compulsion && ('Trigger' in this.exp)) 
      return  this.exp.Trigger.length > 0;
    else {
      return this.subskill.nativeElement.value.length > 0
    }
  }

  get value(): string {
    if(this.trigger) return this.compulsionTrigger.nativeElement.value;
    if(this.skill) return this.subskill.nativeElement.value;
    return '';
  }

  get trigger(): boolean {
    if ('Or' in this.exp || 'Pick' in this.exp) return false;
    return this.exp.Kind === Statistic.Trait && this.exp.Trait === Trait.Compulsion && ('Trigger' in this.exp) && this.exp.Trigger === '*'
  }

  get skill(): (Stat & { Kind: Statistic.Skill }) | undefined {
    if ('Or' in this.exp || 'Pick' in this.exp) return undefined;
    if (this.exp.Kind !== Statistic.Skill) return undefined;
    return {...this.exp};
  }

  get quantity(): string {
    return this.exp.Quantity > 0 ? `+${this.exp.Quantity}` : `${this.exp.Quantity}`;
  }

  get skillName(): string {
    if ('Or' in this.exp || 'Pick' in this.exp) return '';
    if (this.exp.Kind !== Statistic.Skill) return '';
    return Object.values(Skill)[this.exp.Skill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim();
  }

  compulsionBlur(e: Event) {
    if ('Or' in this.exp || 'Pick' in this.exp) return;
    if (this.exp.Kind !== Statistic.Trait) return;

    this.onBlur({
      Kind: Statistic.Trait,
      Trait: Trait.Compulsion,
      Trigger: this.compulsionTrigger.nativeElement.value,
      Quantity: this.exp.Quantity
    });
  }

  subskillBlur(e: Event) {
    if ('Or' in this.exp || 'Pick' in this.exp) return;
    if (this.exp.Kind !== Statistic.Skill) return;

    this.onBlur({
      Kind: Statistic.Skill,
      Skill: this.exp.Skill,
      Subskill: this.subskill.nativeElement.value,
      Quantity: this.exp.Quantity
    })
  }

  public experience: Experience | undefined = undefined;
  oldExp?: Experience;
  onBlur(newExp: Experience) {
    if (this.oldExp === newExp) return;
    if (this.value.length === 0) return;
    this.experience = newExp;
    this.choice.emit({
      add: [newExp],
      remove: this.oldExp ? [{...this.oldExp, Quantity: -this.oldExp}] : []
    });
    this.oldExp = newExp;
  }
}
