import { ChangeDetectorRef, Component, ElementRef, Output, ViewChild } from '@angular/core';
import { Character, Option } from './character/character';
import { CharacterComponent } from './chargen/character/character.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'atow';

  character?: Character

  @ViewChild('char') char!:CharacterComponent;

  constructor(private ref: ChangeDetectorRef) {

  }

  Start() {
    const hadChar:boolean = !!this.character;
    if(hadChar) 
      console.log(this.char.characterName);
    this.character = new Character({ Option: Option.Create });

    this.ref.detectChanges();  
    this.ref.markForCheck();
  }

  Save() {

  }

  Load(e: any) {
    this.character = new Character({
      Option: Option.Load,
      File: e.target.files
    });
    //this.char.nativeElement.character = this.character;
    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }

  characterChanged(e: Character) {
    this.character = e;
    this.ref.detectChanges();  
    this.ref.markForCheck();  
  }
}
