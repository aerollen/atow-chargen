import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomLifeEventComponent } from './random-life-event.component';

describe('RandomLifeEventComponent', () => {
  let component: RandomLifeEventComponent;
  let fixture: ComponentFixture<RandomLifeEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RandomLifeEventComponent]
    });
    fixture = TestBed.createComponent(RandomLifeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
