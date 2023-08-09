import { Pipe, PipeTransform } from '@angular/core';
import { Experience } from './common';
import { StatPipe } from './stat.pipe';

@Pipe({
  name: 'exp'
})
export class ExpPipe implements PipeTransform {
  statPipe: StatPipe;
  constructor() {
    this.statPipe = new StatPipe();
  }

  transform(value: Experience): string {
    if('Or' in value) {
      return 'Or?!'
    } else {
      return `${this.statPipe.transform(value)} ${ value.Quantity > 0 ? '+' : '' }${value.Quantity} EXP`;
    }
  }

}
