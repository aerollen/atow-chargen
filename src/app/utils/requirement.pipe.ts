import { Pipe, PipeTransform } from '@angular/core';
import { EducationType } from '../education/education';
import { Requirement } from './common';
import { requirementGroupLabel } from './requirements';
import { StatPipe } from './stat.pipe';

@Pipe({
  name: 'requirement',
  standalone: false
})
export class RequirementPipe implements PipeTransform {
  private readonly statPipe = new StatPipe();

  transform(requirement: Requirement, part?: 'label' | 'operator'): string {
    if (part) {
      if ('Kind' in requirement) {
        if (part === 'label') return this.statPipe.transform(requirement);
        const target = 'Level' in requirement ? requirement.Level : requirement.Exp;
        const unit = 'Exp' in requirement ? ' XP' : '';
        return `${requirement.Op} ${target}${unit}`;
      }
      return part === 'label' ? this.transform(requirement) : '';
    }

    if ('Not' in requirement) {
      return `Not:\n${this.indent(this.transform(requirement.Not))}`;
    }
    if ('And' in requirement) {
      return `All of:\n${requirement.And.map(value => this.indent(this.transform(value))).join('\n')}`;
    }
    if ('Or' in requirement) {
      const options = requirement.Or
        .map(value => this.indent(this.transform(value)))
        .join('\n');
      return `${requirementGroupLabel(requirement)}\n${options}`;
    }
    if ('Stage' in requirement) return `Stage ${requirement.Stage}: ${requirement.Name}`;
    if ('Field' in requirement) {
      if (typeof requirement.Field === 'string') return `Field: ${requirement.Field}`;
      const level = EducationType[requirement.Field.Level];
      const count = requirement.Field.Count === undefined ? '' : ` (count ${requirement.Field.Count})`;
      return `${level} field${count}`;
    }
    if ('Affiliation' in requirement) return `Affiliation: ${requirement.Affiliation}`;
    if ('IsClanner' in requirement) {
      return requirement.IsClanner ? 'Requires a Clan affiliation' : 'Requires a non-Clan affiliation';
    }
    if ('IsInner' in requirement) {
      return requirement.IsInner ? 'Requires an Inner Sphere affiliation' : 'Requires a non-Inner Sphere affiliation';
    }
    if ('IsPerifphery' in requirement) {
      return requirement.IsPerifphery ? 'Requires a Periphery affiliation' : 'Requires a non-Periphery affiliation';
    }
    if ('Kind' in requirement) {
      const target = 'Level' in requirement ? requirement.Level : requirement.Exp;
      const unit = 'Exp' in requirement ? ' XP' : '';
      return `${this.statPipe.transform(requirement)} ${requirement.Op} ${target}${unit}`;
    }
    throw new Error('Unsupported requirement format');
  }

  private indent(value: string): string {
    return value.split('\n').map(line => `  ${line}`).join('\n');
  }
}
