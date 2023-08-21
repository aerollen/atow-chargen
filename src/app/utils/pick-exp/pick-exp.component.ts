import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Attribute, EnumMap, Experience, Skill, Stat, Statistic, Trait } from '../common';
import { Subscription, never } from 'rxjs';
import { StatPipe } from '../stat.pipe';

@Component({
  selector: 'app-pick-exp',
  templateUrl: './pick-exp.component.html',
  styleUrls: ['./pick-exp.component.scss']
})
export class PickExpComponent implements OnInit {
  @Input({ required: true }) count!: number;
  @Input({ required: true }) options!: Stat[];
  @Input({ required: true }) quantity!: number;
  @Input() templateRef!: TemplateRef<any>;

  @Output() choice = new EventEmitter<Record<'index', number> & Record<'add',Experience[]> & Record<'remove', Experience[]>>();

  get isComplete(): boolean {
    return this.indexes.reduce((sofar, index) => sofar && !!this.pickedOption[index] && !this.needsExtra(this.pickedOption[index]), true);
  }

  get experience(): Experience[] {
    return this.indexes.map(index => this.pickedOption[index]).filter(stat => !this.needsExtra(stat)).filter((stat): stat is Stat => !!stat).map(stat => { return { ...stat, Quantity: this.quantity }});
  }

  get indexes(): number[] {
    return [...Array(this.count).keys()]
  }

  pickedOption: { [any:number]: Stat | undefined } = {}

  pickerOptions: { [any:number]: Stat[] } = {};

  extraDropdownOptions: {
    ['types']: Trait[],
    ['type']: { 'NaturalAptitude': number, 'ExceptionalAttribute': number },
    [Trait.NaturalAptitude]: number[],
    [Trait.ExceptionalAttribute]: number[]
  } = {
    ['types']: [Trait.NaturalAptitude, Trait.ExceptionalAttribute],
    ['type']: {'NaturalAptitude': Trait.NaturalAptitude, 'ExceptionalAttribute': Trait.ExceptionalAttribute },
    [Trait.NaturalAptitude]: EnumMap(Skill),
    [Trait.ExceptionalAttribute]: EnumMap(Attribute)
  }

  private statPipe: StatPipe;
  constructor(private ref: ChangeDetectorRef) {
    this.statPipe = new StatPipe();
  }

  ngOnInit(): void {
    this.indexes.forEach(i => {
      this.pickerOptions[i] = [...this.options];
      this.pickedOption[i] = undefined;
    });
  }

  needsExtra(stat: Stat | undefined): boolean {
    if(stat === undefined) return false;
    if(this.statPipe.transform(stat).slice(-1) === '/') {
      switch(stat.Kind) {
        case Statistic.Trait:
          switch(stat.Trait) {
            case Trait.Compulsion:
              return 'Trigger' in stat ? stat.Trigger.length === 0 : true
            case Trait.ExceptionalAttribute:
              return !('Attribute' in stat);
            case Trait.NaturalAptitude:
              return !('Skill' in stat);
            default:
              return false;
          }
        default:
          return false;
      }
    } else {
      return false;
    }
  }

  extraType(stat: Stat | undefined): 'dropdown' | 'text' | 'none' {
    if(!stat) return 'none';
    if(stat.Kind !== Statistic.Trait) return 'none';
    switch(stat.Trait) {
      case Trait.Compulsion:
        return 'text';
      case Trait.ExceptionalAttribute:
      case Trait.NaturalAptitude:
        return 'dropdown';
      default:
        return 'none';
    }
  }

  compulsionBlur(e: EventTarget, index: number) {
    const input = e as HTMLInputElement;
    if(!(this.pickedOption[index])) throw new Error('How did this even happen?');
    const currentStat = this.pickedOption[index]!;
    if('Trigger' in currentStat) {
      currentStat.Trigger = input.value;
    } else {
      Object.assign(currentStat, { Trigger: input.value })
    }

    this.change(currentStat, index);
  }

  change(value: Stat, index: number) {
    this.pickedOption[index] = value;

    const old: Experience[] = this.experience.map(exp => { return { ...exp, Quantity: -exp.Quantity }});

    this.indexes.filter(i => i !== index).forEach(i => {
      const disallowed = this.indexes.filter(j => j !== i).map(j => this.pickedOption[j]).filter((item): item is Stat => !!item).map(item => JSON.stringify(item));
      const allowed = [...this.options].filter(item => !disallowed.includes(JSON.stringify(item)));
      this.pickerOptions[i] = allowed;
    });

    if(!this.needsExtra(value)) {
      this.choice.emit({
        index: index,
        add: this.experience,
        remove: old
      })
    }

    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  onChange(e: EventTarget, index: number) {
    const input = e as HTMLSelectElement;
    const value  = JSON.parse(input.selectedOptions[0].value) as Stat;
    this.change(value, index);
  }

  onExtraChange(e: EventTarget, index: number, type: Trait) {
    const input = e as HTMLSelectElement;
    const value = +input.selectedOptions[0].value;
    const currentStat = this.pickedOption[index]!;
    switch(type) {
      case Trait.NaturalAptitude:
        if('Skill' in currentStat) {
          currentStat.Skill = value as Skill;
        } else {
          Object.assign(currentStat, { Skill: value as Skill })
        }
        break;
      case Trait.ExceptionalAttribute:
        if('Attribute' in currentStat) {
          currentStat.Attribute = value as Attribute;
        } else {
          Object.assign(currentStat, { Attribute: value as Attribute })
        }
        break;
      default:
        throw new Error('onExtraChange event should not be firing!');
    }

    this.change(currentStat, index);
  }

  asAttribute(number: number): string {
    return Object.values(Attribute)[number].toString();
  }

  asAptitude(number: number): string {
    return Object.values(Skill)[number].toString();
  }

  asTrait(number: number): Trait.NaturalAptitude | Trait.ExceptionalAttribute | undefined {
    const opt = this.pickedOption[number]!;
    switch(opt?.Kind) {
      case Statistic.Trait:
        switch(opt.Trait){
          case Trait.NaturalAptitude:
          case Trait.ExceptionalAttribute:
            return opt.Trait;
          default:
            return undefined;
        }
      default:
        return undefined;
    }
  }
}
