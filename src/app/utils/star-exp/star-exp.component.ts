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
    if(!this.experience) return false;
    if ('Or' in this.experience || 'Pick' in this.experience) return false;
    if (this.experience.Kind === Statistic.Trait && this.experience.Trait === Trait.Compulsion && ('Trigger' in this.experience)) 
      return  this.experience.Trigger.length > 0;
    else if (this.experience.Kind === Statistic.Skill && ('Subskill' in this.experience) && typeof this.experience.Subskill === 'string') {
      return this.experience.Subskill.length > 0 && this.experience.Subskill !== '*';
    } else {
      return false;
    }
  }

  get value(): string {
    if(this.trigger) return this.compulsionTrigger.nativeElement.value;
    if(this.skill) return this.subskill.nativeElement.value;
    return '';
  }

  set value(newVal: string) {
    if(this.trigger) this.compulsionTrigger.nativeElement.value = newVal;
    if(this.skill) this.subskill.nativeElement.value = newVal;
  }

  get trigger(): boolean {
    if ('Or' in this.exp || 'Pick' in this.exp) return false;
    switch(this.exp.Kind) {
      case Statistic.Trait:
        switch(this.exp.Trait) {
          case Trait.Compulsion:
            return true;
          default:
            return false;
        }
      default:
        return false;
    }
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
    return Object.values(Skill)[this.exp.Skill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').replace(/([A-Z])([A-Z])/g, '$1-$2').trim();
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
    if (JSON.stringify(this.oldExp) === JSON.stringify(newExp)) return;
    if (this.value.length === 0) return;
    this.experience = newExp;
    this.choice.emit({
      add: [newExp],
      remove: this.oldExp ? [{...this.oldExp, Quantity: -this.oldExp}] : []
    });
    this.oldExp = newExp;
  }
}
