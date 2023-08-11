import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BackgroundInfo } from 'src/app/background/background';
import { BackgroundsService } from 'src/app/background/backgrounds.service';
import { Archtype, Experience } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.component.html',
  styleUrls: ['./stage1.component.scss']
})
export class Stage1Component {
  @Input() hidden: boolean = false;
  @Input({ required: true }) startingYear!: number;
  @Input({ required: true }) archtype!: Archtype | undefined;

  @Output() backgroundChanged = new EventEmitter<BackgroundInfo>();

  @ViewChild('exp') exp!: ExpComponent;

  get isComplete(): boolean {
    return false;
  }

  get experience(): Experience[] {
    return []
  }

  private _cache: { [year:number]: BackgroundInfo[] } = {};
  get backgrounds(): BackgroundInfo[] {
    if(this.startingYear in this._cache) 
      return this._cache[this.startingYear];
    else {
      return (this._cache[this.startingYear] = this.backgroundServices.At(this.startingYear, 1));
    }
  }

  get currentBackground(): BackgroundInfo | undefined {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }

  get subtotal():number {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a+b.Quantity, 0) : 0;
  }

  currentBackgroundIndex?: number;

  constructor(
    public backgroundServices: BackgroundsService,
    private ref: ChangeDetectorRef) {

  }

  hasHideButton: boolean = false;
  visible: boolean = true;
  toggleVisibility(newState: boolean): void {
    this.visible = newState;

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  currentBackgroundChanged(_: Event) {
    this.backgroundChanged.emit(this.currentBackground);

    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }
}
