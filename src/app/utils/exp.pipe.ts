import { Pipe, PipeTransform } from '@angular/core';
import { Experience } from './common';
import { StatPipe } from './stat.pipe';

@Pipe({
    name: 'exp',
    standalone: false
})
export class ExpPipe implements PipeTransform {
  statPipe: StatPipe;
  constructor() {
    this.statPipe = new StatPipe();
  }

  transform(value: Experience | undefined, part?: 'label' | 'amount'): string {
    if(!value) return part === 'amount' ? '' : 'undefined';
    if('Or' in value) {
      return part === 'amount' ? '' : 'Or?!'
    } else if('Pick' in value) {
      return part === 'amount' ? '' : 'Pick?!'
    } else if('Set' in value) {
      return part === 'amount' ? '' : 'Set?!'
    } else if ('If' in value) {
      return part === 'amount' ? '' : 'If?!'
    } else {
      const label = this.statPipe.transform(value);
      const amount = `${ value.Quantity > 0 ? '+' : '' }${value.Quantity} EXP`;
      if (part === 'label') return label.replace(/\//g, '/\u200B');
      if (part === 'amount') return amount;
      return `${label} ${amount}`;
    }
  }

}
