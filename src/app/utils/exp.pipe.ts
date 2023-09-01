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

  transform(value: Experience | undefined): string {
    if(!value) return 'undefined';
    if('Or' in value) {
      return 'Or?!'
    } else if('Pick' in value) {
      return 'Pick?!'
    } else if('Set' in value) {
      return 'Set?!'
    } else {
      return `${this.statPipe.transform(value)} ${ value.Quantity > 0 ? '+' : '' }${value.Quantity} EXP`;
    }
  }

}
