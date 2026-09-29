import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage2Component } from './stage2.component';
import { AppModule } from '../../../app.module';
import { AffiliationsService } from '../../../affiliation/affiliations.service';
import { NEVER } from 'rxjs';

import { beforeEach, describe, expect, it } from 'vitest';

describe('Stage2Component', () => {
  let component: Stage2Component;
  let fixture: ComponentFixture<Stage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage2Component]
    });
    fixture = TestBed.createComponent(Stage2Component);
    component = fixture.componentInstance;
    component.startingYear = NEVER;
    component.archtype = undefined;
    component.affiliation = TestBed.inject(AffiliationsService).At(3055)[0];
    component.language = NEVER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
