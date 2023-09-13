import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Character } from 'src/app/character/character';
import { Archtype, EnumMap, Eternal, clamp } from 'src/app/utils/common';

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.scss']
})
export class VitalsComponent implements OnInit {
  @Input({ required: true }) character!: Character;

  @ViewChild('startYear') startYear!: ElementRef<HTMLInputElement>;
  @ViewChild('startAge') startAge!: ElementRef<HTMLInputElement>;
  @ViewChild('birthYear') birthYear!: ElementRef<HTMLInputElement>;
  @ViewChild('archtype') archtype!: ElementRef<HTMLSelectElement>;

  @Output() archtypeChanged = new EventEmitter<Archtype>();
  @Output() characterChanged = new EventEmitter<Character>();
  @Output() startingYearChanged = new ReplaySubject<Eternal>();
  @Output() birthYearChanged = new ReplaySubject<Eternal>();

  _startingYear: number = 3076;
  _startingAge: number = 21;
  targetExperience: number = 5000;
  characterName: string = ''
  private _currentArchtype: Archtype | undefined = undefined;

  get startingYear(): Eternal {
    return Math.max(this._startingYear, 2398+16) as Eternal;
  }

  set startingYear(value: number) {
    if(value < 0) return;
    if(this._startingYear > value) {
      this.startingAge -= (this.startingYear - value);
    } else {
      this.startingAge += value - this.startingYear;
    }
    this._startingYear = value;

    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  get startingAge(): number {
    return Math.max(16, this._startingAge);
  }

  set startingAge(value: number) {
    this._startingAge = Math.max(value, 16);

    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  get archtypes(): number[] {
    const vals = EnumMap(Archtype)
    return vals;
  }

  get yearOfBirth(): Eternal {
    return this.startingYear-this.startingAge as Eternal;
  }

  set yearOfBirth(value: number) {
    this.startingAge = this.startingYear - Math.max(value, 2398);

    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  get maxBirthYear(): number {
    return this.startingYear - 16;
  }

  get currentArchtype():  Archtype | undefined {
    return this._currentArchtype;
  }

  set currentArchtype(val: Archtype | undefined) {
    this._currentArchtype = val;

    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  constructor(private ref: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.startingYearChanged.next(this.startingYear);
    this.birthYearChanged.next(this.yearOfBirth);
  }


  nameChanged(e: Event) {
    this.ref.detectChanges();  
    this.ref.markForCheck();

    this.characterChanged.emit(this.character);
  }

  ageChanged(e: Event) {
    this.startingAge = this.startAge.nativeElement.valueAsNumber;
    this.startAge.nativeElement.valueAsNumber = this.startingAge;

    this.ref.detectChanges();  
    this.ref.markForCheck();

    this.characterChanged.emit(this.character);
    if(!isNaN(this.yearOfBirth)) this.birthYearChanged.next(this.yearOfBirth);
  }

  startYearChanged(e: Event) {
    this.startingYear = this.startYear.nativeElement.valueAsNumber;
    this.startYear.nativeElement.valueAsNumber = this.startingYear;

    this.ref.detectChanges();  
    this.ref.markForCheck();

    this.characterChanged.emit(this.character);
    if(!isNaN(this.startingYear)) this.startingYearChanged.next(this.startingYear);
  }

  yearOfBirthChanged(e: Event) {
    this.yearOfBirth = this.birthYear.nativeElement.valueAsNumber;
    this.birthYear.nativeElement.valueAsNumber = this.yearOfBirth;

    this.ref.detectChanges();  
    this.ref.markForCheck();

    this.characterChanged.emit(this.character);
    if(!isNaN(this.yearOfBirth)) this.birthYearChanged.next(this.yearOfBirth);
  }

  currentArchtypeChanged(e: Event) {
    this.ref.detectChanges();  
    this.ref.markForCheck();
    
    const val = Archtype[this.archtype.nativeElement.selectedIndex-1] as keyof typeof Archtype
    this.currentArchtype = Archtype[val];

    this.characterChanged.emit(this.character);
  }
}

