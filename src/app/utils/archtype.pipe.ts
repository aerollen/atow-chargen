import { Pipe, PipeTransform } from '@angular/core';
import { Archtype } from './common';

@Pipe({
  name: 'archtype'
})
export class ArchtypePipe implements PipeTransform {

  transform(value: number | Archtype): string {
    const ret = Archtype[value].replace(/([A-Z]+)/g, ' $1').trim();
    return ret;
  }

}
