import { Component, ViewChild, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Character, Option } from './character/character';
import { CharacterComponent } from './chargen/character/character.component';
import { Stat, Experience, Statistic, Skill } from './utils/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  title = 'atow';

  character?: Character

  @ViewChild('char') char!:CharacterComponent;

  Start() {
    const hadChar:boolean = !!this.character;
    if(hadChar) 
      console.log(this.char.vitals.characterName);
    this.character = new Character({ Option: Option.Create });

  }

  Save() {

  }

  Load(e: any) {
    this.character = new Character({
      Option: Option.Load,
      File: e.target.files
    });
    this.char.character = this.character;
  }

  characterChanged(e: Character) {
    this.character = e;
  }
}
