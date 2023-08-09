import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffComponent } from './aff.component';

describe('AffComponent', () => {
  let component: AffComponent;
  let fixture: ComponentFixture<AffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffComponent]
    });
    fixture = TestBed.createComponent(AffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
