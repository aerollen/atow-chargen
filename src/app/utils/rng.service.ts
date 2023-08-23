import { Injectable } from '@angular/core';
import { Range } from 'src/app/utils/common';

@Injectable({
  providedIn: 'root'
})
export class RngService {

  constructor() { }

 Roll(): Range<1, 7> {
  return Math.round(Math.random() * 5 + 1) as Range<1, 7>;
 } 
}