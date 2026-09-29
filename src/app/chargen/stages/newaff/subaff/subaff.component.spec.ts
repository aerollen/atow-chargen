import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubaffComponent } from './subaff.component';
import { AppModule } from '../../../../app.module';
import { AffiliationsService } from '../../../../affiliation/affiliations.service';

import { beforeEach, describe, expect, it } from 'vitest';

describe('SubaffComponent', () => {
  let component: SubaffComponent;
  let fixture: ComponentFixture<SubaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SubaffComponent]
    });
    fixture = TestBed.createComponent(SubaffComponent);
    component = fixture.componentInstance;
    component.subaffiliations = TestBed.inject(AffiliationsService).At(3055)
      .flatMap(affiliation => affiliation.Subaffiliations);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});