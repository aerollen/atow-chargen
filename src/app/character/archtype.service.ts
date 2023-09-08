import { Injectable } from '@angular/core';
import { EnumMap, Archtype as ArchtypeEnum, Stage } from '../utils/common';
import { Archtype } from './archtype';
import { AffiliationsService } from '../affiliation/affiliations.service';
import { BackgroundsService } from '../background/backgrounds.service';
import { EducationService } from '../education/education.service';

@Injectable({
  providedIn: 'root'
})
export class ArchtypeService {
  Archtypes: Archtype[];

  constructor(
    private affserv: AffiliationsService, 
    private bkgserv: BackgroundsService, 
    private eduserv: EducationService) { 
    this.Archtypes = EnumMap(ArchtypeEnum).map(type => new Archtype(type, {
      0: { Affiliations: affserv.Affiliations },
      1: { Backgrounds: bkgserv.Backgrounds[1] },
      2: { Backgrounds: bkgserv.Backgrounds[2] },
      3: { Educations: eduserv.Educations },
      4: { Backgrounds: bkgserv.Backgrounds[4] }
    }));
  }
}