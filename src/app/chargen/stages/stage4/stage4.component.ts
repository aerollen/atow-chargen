import { Component } from '@angular/core';

@Component({
  selector: 'app-stage4',
  templateUrl: './stage4.component.html',
  styleUrls: ['./stage4.component.scss']
})
export class Stage4Component {
  Stage = 4;
  get isComplete(): boolean {
    return false;
  }
}
