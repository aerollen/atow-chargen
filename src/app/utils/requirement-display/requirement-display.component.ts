import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AffiliationInfo } from '../../affiliation/affiliation';
import { Requirement } from '../common';
import { resolveRequirementSubskills } from '../affiliation-placeholders';
import { requirementGroupLabel } from '../requirements';

@Component({
  selector: 'app-requirement-display',
  templateUrl: './requirement-display.component.html',
  styleUrls: ['./requirement-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RequirementDisplayComponent {
  @Input() requirement?: Requirement;
  @Input() affiliation?: AffiliationInfo;
  @Input() languageSubskill?: string;
  @Input() showHeading = true;
  @Input() compact = false;
  @Input() depth = 0;

  get displayRequirement(): Requirement | undefined {
    return resolveRequirementSubskills(this.requirement, this.affiliation, this.languageSubskill);
  }

  get isGroup(): boolean {
    const requirement = this.displayRequirement;
    return !!requirement &&
      ('And' in requirement || 'Or' in requirement || 'Not' in requirement);
  }

  get isStat(): boolean {
    return !!this.displayRequirement && 'Kind' in this.displayRequirement;
  }

  get groupLabel(): string {
    if (!this.displayRequirement) return '';
    return requirementGroupLabel(this.displayRequirement);
  }

  get children(): Requirement[] {
    const requirement = this.displayRequirement;
    if (!requirement) return [];
    if ('And' in requirement) return requirement.And;
    if ('Or' in requirement) return requirement.Or;
    if ('Not' in requirement) return [requirement.Not];
    return [];
  }
}
