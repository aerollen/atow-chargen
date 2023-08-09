import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterComponent } from './character.component';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharacterComponent]
    });
    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //implement logic for how modifying birth year, start year, and starting age change each other
  it('Should not allow a min age of 16', () => {
    expect(component.maxBirthYear - component.yearOfBirth).toBe(16);
  });
});
