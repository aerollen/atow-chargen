import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Character } from 'src/app/character/character';
import { Archtype, EnumMap, clamp } from 'src/app/utils/common';

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.scss']
})
export class VitalsComponent {
  @Input({ required: true }) character!: Character;

  @ViewChild('startYear') startYear!: ElementRef<HTMLInputElement>;
  @ViewChild('startAge') startAge!: ElementRef<HTMLInputElement>;
  @ViewChild('birthYear') birthYear!: ElementRef<HTMLInputElement>;
  @ViewChild('archtype') archtype!: ElementRef<HTMLSelectElement>;

  @Output() archtypeChanged = new EventEmitter<Archtype>();
  @Output() characterChanged = new EventEmitter<Character>();

  _startingYear: number = 3076;
  _startingAge: number = 21;
  targetExperience: number = 5000;
  characterName: string = ''
  private _currentArchtype: Archtype | undefined = undefined;

  get startingYear(): number {
    return Math.max(this._startingYear, 2398+16);
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
    this._startingAge = Math.max(value, 15);

    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  get archtypes(): number[] {
    const vals = EnumMap(Archtype)
    return vals;
  }

  get yearOfBirth(): number {
    return this.startingYear-this.startingAge;
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
  }

  startYearChanged(e: Event) {
    this.startingYear = this.startYear.nativeElement.valueAsNumber;
    this.startYear.nativeElement.valueAsNumber = this.startingYear;

    this.ref.detectChanges();  
    this.ref.markForCheck();

    this.characterChanged.emit(this.character);
  }

  yearOfBirthChanged(e: Event) {
    this.yearOfBirth = this.birthYear.nativeElement.valueAsNumber;
    this.birthYear.nativeElement.valueAsNumber = this.yearOfBirth;

    this.ref.detectChanges();  
    this.ref.markForCheck();

    this.characterChanged.emit(this.character);
  }

  currentArchtypeChanged(e: Event) {
    this.ref.detectChanges();  
    this.ref.markForCheck();
    
    const val = Archtype[this.archtype.nativeElement.selectedIndex-1] as keyof typeof Archtype
    this.currentArchtype = Archtype[val];

    this.characterChanged.emit(this.character);
  }
}

