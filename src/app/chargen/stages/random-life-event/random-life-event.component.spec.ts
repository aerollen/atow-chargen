import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomLifeEventComponent } from './random-life-event.component';
import { AppModule } from 'src/app/app.module';

describe('RandomLifeEventComponent', () => {
  let component: RandomLifeEventComponent;
  let fixture: ComponentFixture<RandomLifeEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
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
