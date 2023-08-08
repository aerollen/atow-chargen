import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Experience, Stat } from '../common';

@Component({
  selector: 'app-or-exp',
  templateUrl: './or-exp.component.html',
  styleUrls: ['./or-exp.component.scss']
})
export class OrExpComponent  {
  @Input({ required: true }) options!: Stat[];
  @Input({ required: true }) quantity!: number;
  @ViewChild('or') or!: ElementRef<HTMLSelectElement>
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();

  get isComplete(): boolean {
    return this.or.nativeElement.selectedIndex !== 0;
  }

  set selectedIndex(value: number) {
    this.or.nativeElement.selectedIndex = value;
  }

  private lastIndex = 0;
  onOrChanged(e: Event) {
    this.choice.emit({
      add: this.or.nativeElement.selectedIndex === 0 ? [] : [{ ...this.options[this.or.nativeElement.selectedIndex-1], Quantity: this.quantity}],
      remove: this.lastIndex === 0 ? [] : [{ ...this.options[this.lastIndex-1], Quantity: -this.quantity}]
    });
    this.lastIndex = this.or.nativeElement.selectedIndex;
  }
}
