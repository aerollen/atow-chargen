import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  
  get selectedIndex(): number {
    return this._currentIndex;
  }

  get selectedValue(): Stat | undefined {
    return this._currentValue;
  }

  @ViewChild('or') or!: ElementRef<HTMLSelectElement>
  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();

  readonly labelArgs: {
    value: string,
    index: number
  } = {
    value: '/',
    index: 1
  };

  private _currentIndex = 0;
  private _currentValue: Stat | undefined = undefined;

  statPipe: StatPipe;
  constructor(private ref: ChangeDetectorRef) {
    this.statPipe = new StatPipe();
  }

  get experience(): Experience | undefined {
    return this.selectedIndex === 0 ? undefined : { ...this.options[this.selectedIndex-1], Quantity: this.quantity}
  }

  get isComplete(): boolean {
    return !!this.experience;
  }

  set selectedIndex(value: number) {
    this._currentIndex = value;
    this.ref.detectChanges();
    this.ref.markForCheck();  
  }

  set selectedValue(value: Stat) {
    this._currentValue = value;
    this.ref.detectChanges();
    this.ref.markForCheck();  
  }

  private lastIndex = 0;
  onOrChanged(e: Event) {
    const src: HTMLSelectElement = e.target as HTMLSelectElement;

    this.selectedIndex = src.selectedIndex;
    this.selectedValue = this.options[this.selectedIndex-1];
    this.choice.emit({
      add: this.experience ? [this.experience] : [],
      remove: this.lastIndex === 0 ? [] : [{ ...this.options[this.lastIndex-1], Quantity: -this.quantity}]
    });

    this.lastIndex = this.selectedIndex;
    
    const transform = this.statPipe.transform(this.selectedValue!, this.showLabel ? undefined : this.labelArgs);
    this.or.nativeElement.value = transform;
    src.value = transform;

    this.ref.detectChanges();
    this.ref.markForCheck(); 
  }
}
