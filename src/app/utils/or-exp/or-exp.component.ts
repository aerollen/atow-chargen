import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Experience, Stat } from '../common';
import { StatPipe } from '../stat.pipe';

@Component({
  selector: 'app-or-exp',
  templateUrl: './or-exp.component.html',
  styleUrls: ['./or-exp.component.scss']
})
export class OrExpComponent  {
  @Input({ required: true }) options!: Stat[];
  @Input({ required: true }) quantity!: number;
  @Input() showQuantity: boolean = true;
  @Input() showLabel: boolean = true;
  @Input() assignedIndex?: number;

  @ViewChild('or') or!: ElementRef<HTMLSelectElement>
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();

  statPipe: StatPipe;
  constructor() {
    this.statPipe = new StatPipe();
  }

  get experience(): Experience | undefined {
    return this.or.nativeElement.selectedIndex === 0 ? undefined : { ...this.options[this.or.nativeElement.selectedIndex-1], Quantity: this.quantity}
  }

  get isComplete(): boolean {
    return this.or.nativeElement.selectedIndex !== 0;
  }

  set selectedIndex(value: number) {
    this.or.nativeElement.selectedIndex = value;
  }

  private lastIndex = 0;
  onOrChanged(e: Event) {
    this.choice.emit({
      add: this.experience ? [this.experience] : [],
      remove: this.lastIndex === 0 ? [] : [{ ...this.options[this.lastIndex-1], Quantity: -this.quantity}]
    });
    this.lastIndex = this.or.nativeElement.selectedIndex;
  }

  label(stat: Stat): string {
    const transfomred = this.statPipe.transform(stat);
    return this.showLabel ? transfomred : transfomred.split('/')[1];
  }
}
