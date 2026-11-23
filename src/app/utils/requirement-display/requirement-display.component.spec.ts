import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { Attribute, Statistic } from '../common';
import { RequirementDisplayComponent } from './requirement-display.component';

import { beforeEach, describe, expect, it } from 'vitest';

describe('RequirementDisplayComponent', () => {
  let component: RequirementDisplayComponent;
  let fixture: ComponentFixture<RequirementDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppModule] });
    fixture = TestBed.createComponent(RequirementDisplayComponent);
    component = fixture.componentInstance;
  });

  it('renders nested all-of and counted groups with indented entries', () => {
    component.requirement = {
      And: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op: '>=', Level: 4 },
        {
          Or: [
            { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>=', Level: 4 },
            { Kind: Statistic.Attribute, Attribute: Attribute.Body, Op: '>=', Level: 3 }
          ]
        },
        {
          Or: [
            { Kind: Statistic.Attribute, Attribute: Attribute.Reflexes, Op: '>=', Level: 2 },
            { Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Op: '>=', Level: 2 },
            { Kind: Statistic.Attribute, Attribute: Attribute.Edge, Op: '>=', Level: 1 }
          ],
          Count: 2
        }
      ]
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h4')?.textContent).toBe('Requirments');
    expect(fixture.nativeElement.querySelectorAll('.top-level-requirements > li')).toHaveLength(1);
    expect(Array.from(fixture.nativeElement.querySelectorAll('.group-label'), (element: Element) => element.textContent))
      .toEqual(['All of:', 'One of:', '2 of:']);
    expect(fixture.nativeElement.querySelectorAll('ul > li')).toHaveLength(9);
  });
});
