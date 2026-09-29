import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage4Component } from './stage4.component';
import { AppModule } from '../../../app.module';
import { AffiliationsService } from '../../../affiliation/affiliations.service';
import { NEVER } from 'rxjs';

import { beforeEach, describe, expect, it } from 'vitest';

describe('Stage4Component', () => {
  let component: Stage4Component;
  let fixture: ComponentFixture<Stage4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage4Component]
    });
    fixture = TestBed.createComponent(Stage4Component);
    component = fixture.componentInstance;
    component.startingYear = NEVER;
    component.endingYear = NEVER;
    component.archtype = undefined;
    component.affiliation = TestBed.inject(AffiliationsService).At(3055)[0];
    component.language = NEVER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
