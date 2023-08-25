import { Component } from '@angular/core';
import { Archtype, EnumMap } from 'src/app/utils/common';

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.scss']
})
export class VitalsComponent {
  startingYear: number = 3076;
  startingAge: number = 21;
  targetExperience: number = 5000;
  characterName: string = ''
  private _currentArchtype: Archtype | undefined = undefined;

  get archtypes(): number[] {
    const vals = EnumMap(Archtype)
    return vals;
  }

  get yearOfBirth(): number {
    return this.startingYear-this.startingAge;
  }

  set yearOfBirth(value: number) {

  }

  get maxBirthYear(): number {
    return this.startingYear - 16;
  }

  get currentArchtype():  Archtype | undefined {
    return this._currentArchtype;
  }

  set currentArchtype(val: Archtype | undefined) {
    this._currentArchtype = val;
  }



  nameChanged(e: any) {

  }

  ageChanged(e: any) {
    // const dif = this.startingAge - this.startAge.nativeElement.valueAsNumber;
    // this.startingAge = Math.max(this.startingAge - dif, 16);
    // this.ref.detectChanges();  
    // this.ref.markForCheck();  
    // this.characterChanged.emit(this.character);
  }

  startYearChanged(e: any) {
    // const dif = this.startingYear - this.startYear.nativeElement.valueAsNumber;
    // this.startingYear = this.startYear.nativeElement.valueAsNumber;
    // this.startingAge = Math.max(this.startingAge - dif, 16);
    // this.ref.detectChanges();  
    // this.ref.markForCheck();  
    // this.characterChanged.emit(this.character);
  }

  yearOfBirthChanged(e: any) {
    // const newAge = this.startingYear - this.birthYear.nativeElement.valueAsNumber
    // this.startingAge = Math.max(newAge, 16);
    // this.ref.detectChanges();  
    // this.ref.markForCheck();  
    // this.characterChanged.emit(this.character);
  }

  currentArchtypeChanged(e: any) {
    // this.ref.detectChanges();  
    // this.ref.markForCheck();
    
    // const val = Archtype[this.archtype.nativeElement.selectedIndex-1] as keyof typeof Archtype
    // this.currentArchtype = Archtype[val];

    // this.characterChanged.emit(this.character);
  }
}
