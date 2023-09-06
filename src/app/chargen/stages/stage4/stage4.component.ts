import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AffiliationInfo } from 'src/app/affiliation/affiliation';
import { BackgroundInfo } from 'src/app/background/background';
import { Experience, Requirement } from 'src/app/utils/common';
import { ExpComponent } from 'src/app/utils/exp/exp.component';
import { NewaffComponent } from '../newaff/newaff.component';
import { RandomLifeEventComponent } from '../random-life-event/random-life-event.component';


@Component({
  selector: 'app-stage4',
  templateUrl: './stage4.component.html',
  styleUrls: ['./stage4.component.scss']
})
export class Stage4Component {
  @Output() backgroundChanged = new EventEmitter<BackgroundInfo>();
  @Output() complete = new EventEmitter<Experience[]>();
  @Output() changed = new EventEmitter<never>();
  @Output() affiliationChanged = new EventEmitter<AffiliationInfo>();

  @ViewChild('exp') exp!: ExpComponent;
  @ViewChild('changeAff') changeAff!: ElementRef<HTMLInputElement>;
  @ViewChild('newaff') newaff!: NewaffComponent;
  @ViewChild('rle') rle!: RandomLifeEventComponent;

  Stage = 4;
  get isComplete(): boolean {
    return false;
  }

  get experience(): Experience[] {
    return [];
  }

  get Requirments(): Requirement[] {
    return [];
  }
}
