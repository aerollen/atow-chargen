/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage1Component } from './stage1.component';
import { AppModule } from '../../../app.module';
import { Archtype, Skill, Statistic } from '../../../utils/common';
import { AffiliationInfo } from '../../../affiliation/affiliation';

/*describe('Stage1Component', () => {
  let component: Stage1Component;
  let fixture: ComponentFixture<Stage1Component>;
  let aff: AffiliationInfo = {
    Name: '',
    Cost: 0,
    Experience: [],
    PrimaryLanguage:{
      Skill: Skill.Language,
      Subskill: 'TODO',
      Kind: Statistic.Skill },
    SecondaryLanguages: []
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage1Component]
    });
    fixture = TestBed.createComponent(Stage1Component);
    component = fixture.componentInstance;
    component.startingYear = 3051;
    component.archtype = Archtype.Academic;
    component.startingAffiliation = aff;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
  */