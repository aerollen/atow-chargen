import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.component.html',
  styleUrls: ['./stage1.component.scss']
})
export class Stage1Component {
  @Input({ required: true }) hidden!: boolean;
}