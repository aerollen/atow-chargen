import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Attribute, Acrobatics, AnimalHandling, Communications, Driving, EnumMap, Experience, Gunnery, MedTech, Navigation, Piloting, Prestidigitation, SecuritySystem, Skill, Stat, Statistic, Surgery, Tactics, Technician, ThrownWeapons, Tracking, Trait } from '../common';
import { StatPipe } from '../stat.pipe';
import { Subscription } from 'rxjs';
import { StarExpComponent } from '../star-exp/star-exp.component';
import { OrExpComponent } from '../or-exp/or-exp.component';

@Component({
  selector: 'app-pick-exp',
  templateUrl: './pick-exp.component.html',
  styleUrls: ['./pick-exp.component.scss']
})
export class PickExpComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input({ required: true }) count!: Exclude<number, 0>;
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
    const subIndexes = [...(this.starChoices ?? []), ...(this.orChoices ?? [])].map<number>(component => component.assignedIndex!);
    return this.indexes
      .filter(index => !subIndexes.includes(index))
      .reduce((sofar, index) => sofar && !!this.pickedOption[index] && !this.needsExtra(this.pickedOption[index]), true)
      && [...(this.starChoices ?? []), ...(this.orChoices ?? [])].reduce((sofar, component) => sofar && component.isComplete, true);
  }

  get experience(): Experience[] {
    const orIndex = this.indexes.filter(i => (this.orChoices ?? []).map(or => or.assignedIndex).includes(i));
    const starIndex= this.indexes.filter(i => (this.starChoices ?? []).map(star => star.assignedIndex).includes(i));
    const otherIndex = this.indexes.filter(i => orIndex.includes(i) || starIndex.includes(i));

    return [
      ...((this.orChoices ?? []).filter(or => orIndex.includes(or.assignedIndex ?? -1)).map<Experience[]>(or => or.experience ? [or.experience] : [])),
      ...((this.starChoices ?? []).filter(star => starIndex.includes(star.assignedIndex ?? -1)).map<Experience[]>(star => star.experience ? [star.experience] : [])),
      ...((otherIndex.map<Experience[]>(index => this.pickedOption[index] ? [this.asExp(this.pickedOption[index]!)] : [])))
    ].flatMap(exp => exp).filter(exp => !this.needsExtra(exp));
  }

  get indexes(): number[] {
    return [...Array(this.count).keys()]
  }

  _cachedSubOptions:{ [any: number]: Stat[] } = {};
  get cachedSubOptions(): { [any: number]: Stat[] } {
    return this._cachedSubOptions;
  }
  
  pickedOption: { [any: number]: Stat | undefined } = {};
  pickerOptions: { [any: number]: Stat[] } = {};
  maxPickedCounts: { [any: string]: number } = {};

  private subscriptions: Subscription[] = [];
  private starSubs: Subscription[] = [];
  private orSubs: Subscription[] = [];

  private statPipe: StatPipe;
  private _precalcualted: { [any:string]: Stat[] };

  constructor(private ref: ChangeDetectorRef) {
    this.statPipe = new StatPipe();
    this._precalcualted = {};
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
      this.pickerOptions[i] = [...new Set(this.options.map(stat => JSON.stringify(stat)))].map(json => JSON.parse(json));
      this.pickedOption[i] = undefined;
    });

    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  private sendUpdate(change: Record<'add',Experience[]> & Record<'remove', Experience[]>) {
    const noneNeedExtra = change.add.length > 0 && !change.add.map((exp) => this.needsExtra(exp as Stat)).reduce((sofar, current) => sofar || current, false);
    if(noneNeedExtra) {
      this.choice.emit(change);
    }
    if (this.isComplete) this.completed.emit();

    this.indexes.forEach(index => {
      this.pickedOption[index] = this.pickedOption[index];
    })
  }

  needsExtra(stat: Stat | Experience| undefined): boolean {
    if (stat === undefined) return false;
    if ('Quantity' in stat) {
      if('Or' in stat || 'Pick' in stat) {
        return false;
      }
      const asStat: Stat & Partial<Experience> = { ...stat };
      delete asStat.Quantity;
      return this.needsExtra(asStat);
    }
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
          case Skill.Science:
            return 'text';
          default:
            return 'none';
        }
      default:
        return 'none';
    }
  }

  asExp(stat: Stat): Experience {
    const ret = { ...stat, Quantity: this.quantity };
    return ret;
  }

  
  asOpts(stat:Stat | undefined): Stat[] {
    if(!stat) return [];
    const json = JSON.stringify(stat)
    if(json in this._precalcualted) return this._precalcualted[json];
    switch (stat.Kind) {
      case Statistic.Trait:
        switch (stat.Trait) {
          case Trait.ExceptionalAttribute:
            this._precalcualted[json] = EnumMap(Attribute).map(att => { return { ...stat, Attribute: att }});
            break;
          case Trait.NaturalAptitude:
            this._precalcualted[json] = EnumMap(Skill).map<Stat & { Kind: Statistic.Trait, Trait: Trait.NaturalAptitude, Skill: Skill }>((skill : Skill) => { return { Kind: Statistic.Trait, Trait: Trait.NaturalAptitude, Skill: skill }});
            break;
          default:
            return [];
        }
        break;
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
    return this._precalcualted[json];
  }

  onPickerChoice(e: Record<'add',Experience[]> & Record<'remove', Experience[]>, index: number) {
    const added = [...e.add].map<Stat>(item => { return <Stat>{...item}});
    const removed = [...e.remove].map<Stat>(item => { return <Stat>{...item}});
    [...added, ...removed].forEach(item => {
      if('Quantity' in item) delete item.Quantity;
    });

    this.pickedOption[index] = added[0];

    if(this.needsExtra(this.pickedOption[index])) {
      this.ref.markForCheck();
      this.cachedSubOptions[index] = this.asOpts(this.pickedOption[index]);
      this.ref.detectChanges();
    }

    this.pickedOption[index] = added[0];

    const nonspecial: {
      json: string,
      delta: number
    }[] = [];
    const special: {
      json: string,
      delta: number
    }[] = [];

    const cal = (values: Stat[], delta: number): {
      json: string,
      delta: number
    }[] => {
      return values.map(value => { return {
        json: JSON.stringify(value),
        delta: delta
      }})
    };
    [...cal(added, -1), ...cal(removed, 1)].forEach(item => {
      switch(item.delta) {
        case 1:
          if(item.json in this.maxPickedCounts) {
            if(this.maxPickedCounts[item.json] > 0) {
              nonspecial.push(item);
            } else {
              special.push(item);
            }
          } else {
            //Maybe its json for some reason?
            const json = JSON.parse(item.json);
            console.log('que');
          }
          break;
        case -1:
          if(item.json in this.maxPickedCounts) {
            if(this.maxPickedCounts[item.json] > 1) {
              nonspecial.push(item);
            } else {
              special.push(item);
            }
          } else {
            console.log('wat');
          }
          break;
        default:
          throw new Error('This should not happen!');
      };
    });
    [...nonspecial, ...special].forEach(item => this.maxPickedCounts[item.json] += item.delta);
    if(special.length > 0) {
      this.indexes.forEach(index => {
        const choice = JSON.stringify(this.pickedOption[index]);
        const filter = (key: string) => {
          if(key === choice) {
            return true
          }
          return this.maxPickedCounts[key] > 0;
        }
        const options = [...new Set([...Object.keys(this.maxPickedCounts).filter(filter)])].map(value => JSON.parse(value))
        
        this.pickerOptions[index] = options
      });
    }

    this.sendUpdate({
      add: e.add.map(x => { return { ...x }}),
      remove: e.remove.map(x => { return { ...x }}),
    });
  }
}
