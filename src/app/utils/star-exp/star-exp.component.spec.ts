import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarExpComponent } from './star-exp.component';
import { AppModule } from 'src/app/app.module';
import { Experience, Skill, Statistic } from '../common';

describe('StarExpComponent', () => {
  let component: StarExpComponent;
  let fixture: ComponentFixture<StarExpComponent>;
  let exp: Experience = {
    Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '*', Quantity: 5 
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [StarExpComponent]
    });
    fixture = TestBed.createComponent(StarExpComponent);
    component = fixture.componentInstance;
    component.exp = exp;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
