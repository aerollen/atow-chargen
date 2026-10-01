import { Injectable } from '@angular/core';
import { Range } from './common';

@Injectable({
  providedIn: 'root'
})
export class RngService {

  constructor() { }

 Roll(): Range<1, 7> {
  return (Math.floor(Math.random() * 6) + 1) as Range<1, 7>;
 } 
}