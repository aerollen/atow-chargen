import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarExpComponent } from './star-exp.component';

describe('StarExpComponent', () => {
  let component: StarExpComponent;
  let fixture: ComponentFixture<StarExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarExpComponent]
    });
    fixture = TestBed.createComponent(StarExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
