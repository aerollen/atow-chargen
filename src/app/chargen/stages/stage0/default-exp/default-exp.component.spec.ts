import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultExpComponent } from './default-exp.component';
import { AppModule } from '../../../../app.module';
import { Attribute, EnumMap, Skill, Statistic } from '../../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('DefaultExpComponent', () => {
  let component: DefaultExpComponent;
  let fixture: ComponentFixture<DefaultExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [DefaultExpComponent]
    });
    fixture = TestBed.createComponent(DefaultExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('grants 100 experience to each attribute exactly once', () => {
    const attributeExperience = component.defaultExperience.filter(exp =>
      'Kind' in exp && exp.Kind === Statistic.Attribute
    );

    expect(attributeExperience).toHaveLength(EnumMap(Attribute).length);
    EnumMap(Attribute).forEach(attribute => {
      expect(attributeExperience).toContainEqual({
        Kind: Statistic.Attribute,
        Attribute: attribute,
        Quantity: 100
      });
    });
  });

  it('grants the expected starting skill experience', () => {
    expect(component.defaultExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'English',
      Quantity: 20
    });
    expect(component.defaultExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Perception,
      Quantity: 10
    });
    expect(component.defaultExperience).toHaveLength(10);
  });

  it('requires a positive starting level in each attribute', () => {
    expect(component.defaultRequirment).toHaveLength(EnumMap(Attribute).length);
    EnumMap(Attribute).forEach(attribute => {
      expect(component.defaultRequirment).toContainEqual({
        Kind: Statistic.Attribute,
        Attribute: attribute,
        Op: '>',
        Level: 0
      });
    });
  });

  it('renders the experience entries and citation', () => {
    const listItems = Array.from(
      fixture.nativeElement.querySelectorAll('li') as NodeListOf<HTMLLIElement>
    ).map(item => item.textContent?.trim());

    expect(listItems).toHaveLength(10);
    expect(listItems).toContain('Strength +100 EXP');
    expect(listItems).toContain('Language/English +20 EXP');
    expect(listItems).toContain('Perception +10 EXP');
    expect(fixture.nativeElement.textContent).toContain('See A Time Of War, pg: 52');
  });
});