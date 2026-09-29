import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterComponent } from './character.component';
import { AppModule } from '../../app.module';
import { Character, Option } from '../../character/character';

import { beforeEach, describe, expect, it } from 'vitest';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [CharacterComponent]
    });
    
    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    component.character = new Character({ Option: Option.Create });
  
    fixture.detectChanges(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
