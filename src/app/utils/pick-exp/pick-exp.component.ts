import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Attribute, Acrobatics, AnimalHandling, Communications, Driving, EnumMap, Experience, Gunnery, MedTech, Navigation, Piloting, Prestidigitation, SecuritySystem, Skill, Stat, Statistic, Surgery, Tactics, Technician, ThrownWeapons, Tracking, Trait } from '../common';
import { StatPipe } from '../stat.pipe';
import { Subscription } from 'rxjs';
import { StarExpComponent } from '../star-exp/star-exp.component';
import { OrExpComponent } from '../or-exp/or-exp.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pick-exp',
  templateUrl: './pick-exp.component.html',
  styleUrls: ['./pick-exp.component.scss']
})
export class PickExpComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input({ required: true }) count!: number;
  @Input({ required: true }) options!: Stat[];
  @Input({ required: true }) quantity!: number;
  @Input() enlist: boolean = true;
  @Input() showQuantity: boolean = true;

  @Output() choice = new EventEmitter<Record<'add',Experience[]> & Record<'remove', Experience[]>>();
  @Output() completed = new EventEmitter<never>();

  @ViewChildren(StarExpComponent) starChoices!: QueryList<StarExpComponent>;
  @ViewChildren(OrExpComponent) orChoices!: QueryList<OrExpComponent>;

  readonly labelArgs: {
    value: string,
    index: number
  } = {
    value: '/',
    index: 0
  };

  get isComplete(): boolean {
    const subIndexes = [...(this.starChoices ? this.starChoices : []), ...(this.orChoices ? this.orChoices : [])].map(component => component.assignedIndex!);
    return this.indexes
      .filter(index => !subIndexes.includes(index))
      .reduce((sofar, index) => sofar && !!this.pickedOption[index] && !this.needsExtra(this.pickedOption[index]), true)
      && [...(this.starChoices ? this.starChoices : []), ...(this.orChoices ? this.orChoices : [])].reduce((sofar, component) => sofar && component.isComplete, true);
  }

  get experience(): Experience[] {
    const subIndexes = [...(this.starChoices ? this.starChoices : []), ...(this.orChoices ? this.orChoices : [])].map(component => component.assignedIndex!);
    return [
      ...this.indexes
        .filter(index => !subIndexes.includes(index))
        .map(index => this.pickedOption[index])
        .filter(stat => !this.needsExtra(stat))
        .filter((stat): stat is Stat => !!stat)
        .map(stat => { return { ...stat, Quantity: this.quantity } }),
      ...[...(this.starChoices ? this.starChoices : []), ...(this.orChoices ? this.orChoices : [])]
        .filter(compoent => compoent.isComplete)
        .map(component => component.experience)
        .filter((exp): exp is Experience => !!exp),
    ]
  }

  get indexes(): number[] {
    return [...Array(this.count).keys()]
  }

  selectedIndexes: { [any:number]: number } = {};
  pickedOption: { [any: number]: Stat | undefined } = {};
  pickerOptions: { [any: number]: Stat[] } = {};
  maxPickedCounts: { [any: string]: number } = {};

  private subscriptions: Subscription[] = [];
  private starSubs: Subscription[] = [];
  private orSubs: Subscription[] = [];

  private statPipe: StatPipe;
  constructor(private ref: ChangeDetectorRef) {
    this.statPipe = new StatPipe();
  }

  ngOnDestroy(): void {
    [...this.subscriptions, ...this.orSubs, ...this.starSubs].forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.orChoices.changes.subscribe((choice: QueryList<OrExpComponent>) => {
      [...this.orSubs].forEach(_ => {
        this.orSubs.shift()?.unsubscribe();
      });
      choice.forEach(or => {
        this.orSubs.push(or.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));
    this.subscriptions.push(this.starChoices.changes.subscribe((choice: QueryList<StarExpComponent>) => {
      [...this.starSubs].forEach(_ => {
        this.starSubs.shift()?.unsubscribe();
      });
      choice.forEach(star => {
        this.starSubs.push(star.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));

    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  ngOnInit(): void {
    this.options.map(opt => JSON.stringify(opt)).forEach(opt => {
      this.maxPickedCounts[opt] = opt in this.maxPickedCounts ? this.maxPickedCounts[opt] + 1 : 1;
    });
    this.indexes.forEach(i => {
      this.pickerOptions[i] = Object.keys(this.maxPickedCounts).map<Stat>(key => JSON.parse(key));
      this.pickedOption[i] = undefined;
      this.selectedIndexes[i] = 0;
    });

    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  private sendUpdate(change: Record<'add',Experience[]> & Record<'remove', Experience[]>) {
    if(change.add.length > 0 && !change.add.map((exp) => this.needsExtra(exp as Stat)).reduce((sofar, current) => sofar || current, false)) {
      this.choice.emit(change);
    }
    if (this.isComplete) this.completed.emit();

    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  needsExtra(stat: Stat | undefined): boolean {
    if (stat === undefined) return false;
    const transformed = this.statPipe.transform(stat);
    if (transformed.slice(-1) === '/' || transformed.slice(-2) === '/*') {
      switch (stat.Kind) {
        case Statistic.Trait:
          switch (stat.Trait) {
            case Trait.Compulsion:
              return 'Trigger' in stat ? stat.Trigger.length === 0 : true
            case Trait.ExceptionalAttribute:
              return !('Attribute' in stat);
            case Trait.NaturalAptitude:
              return !('Skill' in stat);
            default:
              return false;
          }
        case Statistic.Skill:
          const expectSpeciality = stat.Speciality && stat.Speciality.length === 0;
          switch (stat.Skill) {
            case Skill.Acrobatics:
            case Skill.AnimalHandling:
            case Skill.Communications:
            case Skill.Driving:
            case Skill.Gunnery:
            case Skill.MedTech:
            case Skill.Navigation:
            case Skill.Piloting:
            case Skill.Prestidigitation:
            case Skill.SecuritySystem:
            case Skill.Surgery:
            case Skill.Tactics:
            case Skill.Technician:
            case Skill.ThrownWeapons:
            case Skill.Tracking:
              return !('Subskill' in stat) && !expectSpeciality;
            // Skills which usually have * for subskill
            case Skill.Language:
            case Skill.Career:
            case Skill.Protocol:
            case Skill.Streetwise:
            case Skill.Survival:
            case Skill.Art:
            case Skill.Interest:
              return !('Subskill' in stat 
                      && typeof stat.Subskill === 'string' 
                      && stat.Subskill.length > 0 
                      && stat.Subskill !== '*') 
                    && !expectSpeciality;
            default:
              return false;
          }
        default:
          return false;
      }
    } else {
      return false;
    }
  }

  extraType(stat: Stat | undefined): 'dropdown' | 'text' | 'none' {
    if (!stat) return 'none';
    switch (stat.Kind) {
      case Statistic.Trait:
        switch (stat.Trait) {
          case Trait.Compulsion:
            return 'text';
          case Trait.ExceptionalAttribute:
          case Trait.NaturalAptitude:
            return 'dropdown';
          default:
            return 'none';
        }
      case Statistic.Skill:
        switch (stat.Skill) {
          case Skill.Acrobatics:
          case Skill.AnimalHandling:
          case Skill.Communications:
          case Skill.Driving:
          case Skill.Gunnery:
          case Skill.MedTech:
          case Skill.Navigation:
          case Skill.Piloting:
          case Skill.Prestidigitation:
          case Skill.SecuritySystem:
          case Skill.Surgery:
          case Skill.Tactics:
          case Skill.Technician:
          case Skill.ThrownWeapons:
          case Skill.Tracking:
            return 'dropdown';
          // Skills which usually have * for subskill
          case Skill.Language:
          case Skill.Career:
          case Skill.Protocol:
          case Skill.Streetwise:
          case Skill.Survival:
          case Skill.Art:
          case Skill.Interest:
            return 'text';
          default:
            return 'none';
        }
      default:
        return 'none';
    }
  }

  previous: Experience[] = [];
  onChange(e: EventTarget, index: number) {
    const input = e as HTMLSelectElement;
    const value = this.pickerOptions[index][input.selectedIndex - 1];
    this.pickedOption[index] = value;
    this.selectedIndexes[index] = input.selectedIndex;

    this.indexes.filter(i => i !== index).forEach(i => {
      const otherPicks = this.indexes.filter(j => j !== i && !!this.pickedOption[j]).map(j => JSON.stringify(this.pickedOption[j]));
      const currentPick = JSON.stringify(this.pickedOption[i]);

      const currentCounts: typeof this.maxPickedCounts = {};
      Object.keys(this.maxPickedCounts).forEach(key => currentCounts[key] = this.maxPickedCounts[key]);
      otherPicks.forEach(pick => currentCounts[pick] -= 1);

      const allowedItems = Object.keys(currentCounts).filter(key => currentCounts[key] > 0);
      // currentIndex is offset by 1 because of the initial placeholder value which is not selectable.
      const currentIndex = allowedItems.indexOf(currentPick) + 1;

      this.selectedIndexes[i] = 0;
      this.pickedOption[i] = undefined;
      this.pickerOptions[i] = allowedItems.map(item => JSON.parse(item));
      this.ref.detectChanges();
      this.ref.markForCheck();
      this.selectedIndexes[i] = currentIndex;
      this.pickedOption[i] = this.pickerOptions[i][currentIndex - 1];
      this.ref.detectChanges();
      this.ref.markForCheck();
    });

    if(!this.needsExtra(this.pickedOption[index])) {
      this.choice.emit({
        add: this.experience,
        remove: this.previous
      })
      if (this.isComplete) this.completed.emit();
  
      this.previous = this.experience.map(exp => { return { ...exp, Quantity: -this.quantity } });
    }
    
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  asExp(stat: Stat): Experience {
    const ret = { ...stat, Quantity: this.quantity };
    return ret;
  }

  asOpts(stat:Stat | undefined): Stat[] {
    if(!stat) return [];
    switch (stat.Kind) {
      case Statistic.Trait:
        switch (stat.Trait) {
          case Trait.ExceptionalAttribute:
            return EnumMap(Attribute).map(att => { return { ...stat, Attribute: att }});
          case Trait.NaturalAptitude:
            return EnumMap(Skill).map(skill => { return { ...stat, Skill: skill }});
          default:
            return [];
        }
      case Statistic.Skill:
        switch (stat.Skill) {
          case Skill.Acrobatics:
            return EnumMap(Acrobatics).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.AnimalHandling:
            return EnumMap(AnimalHandling).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Communications:
            return EnumMap(Communications).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Driving:
            return EnumMap(Driving).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Gunnery:
            return EnumMap(Gunnery).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.MedTech:
            return EnumMap(MedTech).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Navigation:
            return EnumMap(Navigation).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Piloting:
            return EnumMap(Piloting).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Prestidigitation:
            return EnumMap(Prestidigitation).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.SecuritySystem:
            return EnumMap(SecuritySystem).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Surgery:
            return EnumMap(Surgery).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Tactics:
            return EnumMap(Tactics).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Technician:
            return EnumMap(Technician).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.ThrownWeapons:
            return EnumMap(ThrownWeapons).map(subskill => { return { ...stat, Subskill: subskill}});
          case Skill.Tracking:
            return EnumMap(Tracking).map(subskill => { return { ...stat, Subskill: subskill}});
          default:
            return [];
        }
      default:
        return [];
    }
  }
}
