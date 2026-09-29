import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewaffComponent } from './newaff.component';
import { AppModule } from '../../../app.module';

import { beforeEach, describe, expect, it } from 'vitest';

describe('NewaffComponent', () => {
  let component: NewaffComponent;
  let fixture: ComponentFixture<NewaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [NewaffComponent]
    });
    fixture = TestBed.createComponent(NewaffComponent);
    component = fixture.componentInstance;
    component.currentYear = 3051;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('provides affiliations for the configured year', () => {
    expect(component.affiliations.length).toBeGreaterThan(0);
  });
});
