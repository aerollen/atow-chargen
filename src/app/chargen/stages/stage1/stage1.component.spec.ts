import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage1Component } from './stage1.component';
import { AppModule } from '../../../app.module';
import { NEVER, of } from 'rxjs';
import { Eternal } from '../../../utils/common';
import { AffiliationsService } from '../../../affiliation/affiliations.service';

import { beforeEach, describe, expect, it } from 'vitest';

describe('Stage1Component', () => {
  let component: Stage1Component;
  let fixture: ComponentFixture<Stage1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage1Component]
    });
    fixture = TestBed.createComponent(Stage1Component);
    component = fixture.componentInstance;
    component.startingYear = of(3051 as Eternal);
    component.archtype = undefined;
    component.startingAffiliation = TestBed.inject(AffiliationsService).At(3051)[0];
    component.language = NEVER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('loads backgrounds available for the starting year', () => {
    expect(component.backgrounds.length).toBeGreaterThan(0);
  });
});