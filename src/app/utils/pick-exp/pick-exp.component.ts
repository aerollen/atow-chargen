import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { Experience, Stat } from '../common';
import { Subscription } from 'rxjs';
import { StatPipe } from '../stat.pipe';

@Component({
  selector: 'app-pick-exp',
  templateUrl: './pick-exp.component.html',
  styleUrls: ['./pick-exp.component.scss']
})
export class PickExpComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) count!: number;
  @Input({ required: true }) options!: Stat[];
  @Input({ required: true }) quantity!: number;
  @Input() templateRef!: TemplateRef<any>;

  @Output() choice = new EventEmitter<Record<'index', number> & Record<'add',Experience[]> & Record<'remove', Experience[]>>();
  @ViewChildren(HTMLInputElement) pickers!: QueryList<HTMLInputElement>;

  get isComplete(): boolean {
    return false;
  }

  get experience(): Experience[] | undefined {
    return undefined;
  }

  get indexes(): number[] {
    return [...Array(this.count).keys()]
  }

  pickerOptions: { [any:number]: Stat[] } = {};

  private statPipe: StatPipe;
  constructor() {
    this.statPipe = new StatPipe();
  }

  private subscriptions: Subscription[] = [];
  private pickerSubs: Subscription[] = [];
  ngOnInit(): void {
    this.indexes.forEach(i => this.pickerOptions[i] = [...this.options]);
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.pickers.changes.subscribe((choice: QueryList<HTMLInputElement>) => {
      choice.forEach(input => input.onblur)
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.pickerSubs.forEach(sub => sub.unsubscribe());
  }

  needsExtra(stat: Stat): boolean {
    return this.statPipe.transform(stat).slice(-1) === '/';
  }

  onChange(e: Event, index: number) {
    console.log('change', index);
  }
}
