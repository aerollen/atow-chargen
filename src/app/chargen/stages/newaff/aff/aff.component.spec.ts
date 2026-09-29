import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffComponent } from './aff.component';
import { AppModule } from '../../../../app.module';
import { AffiliationsService } from '../../../../affiliation/affiliations.service';

import { beforeEach, describe, expect, it } from 'vitest';

describe('AffComponent', () => {
  let component: AffComponent;
  let fixture: ComponentFixture<AffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [AffComponent]
    });
    fixture = TestBed.createComponent(AffComponent);
    component = fixture.componentInstance;
    component.affiliations = TestBed.inject(AffiliationsService).At(3055);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});