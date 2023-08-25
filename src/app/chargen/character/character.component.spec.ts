import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterComponent } from './character.component';
import { AppModule } from 'src/app/app.module';
import { Character, Option as CharOpt } from 'src/app/character/character';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [CharacterComponent],
      providers:[{ provide: Character, useValue:  new Character({ Option: CharOpt.Create }) }]
    });
    
    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    component.character = TestBed.inject(Character);
  
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
