import { Component } from '@angular/core';
import { Citation, Book, Experience, EnumMap, Statistic, Skill, Attribute, Requirement } from 'src/app/utils/common';

@Component({
  selector: 'app-stage0-default-exp',
  templateUrl: './default-exp.component.html',
  styleUrls: ['./default-exp.component.scss']
})
export class DefaultExpComponent {


  defaultExperienceCitation: Citation = {
    Book: Book.ATimeOfWar,
    Page: 52
  }
  defaultExperience: Experience[] = [
    ...EnumMap(Attribute).map(att => { return <Experience>{ Kind: Statistic.Attribute, Attribute: <Attribute>att, Quantity: 100 } }),
    { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English', Quantity: 20 },
    { Kind: Statistic.Skill, Skill: Skill.Perception, Quantity: 10 }];
  defaultRequirment: Requirement[] = [
    ...EnumMap(Attribute).map(att => { return <Requirement>{ Kind: Statistic.Attribute, Attribute: <Attribute>att, Op: '>', Level: 0 } })
  ]
}
