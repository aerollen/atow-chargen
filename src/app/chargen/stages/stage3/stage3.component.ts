import { Component } from '@angular/core';

@Component({
  selector: 'app-stage3',
  templateUrl: './stage3.component.html',
  styleUrls: ['./stage3.component.scss']
})
export class Stage3Component {
  Stage = 3;
  get isComplete(): boolean {
    return false;
  }
}
