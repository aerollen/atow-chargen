import { Injectable } from '@angular/core';
import { EnumMap, Archtype as ArchtypeEnum } from '../utils/common';
import { Archtype } from './archtype';
import { AffiliationsService } from '../affiliation/affiliations.service';
import { BackgroundsService } from '../background/backgrounds.service';

@Injectable({
  providedIn: 'root'
})
export class ArchtypeService {
  Archtypes: Archtype[];

  constructor(affserv: AffiliationsService, bkgserv: BackgroundsService) { 
    this.Archtypes = EnumMap(ArchtypeEnum).map(type => new Archtype(type, {
      0: { Affiliations: affserv.Affiliations },
      1: { Backgrounds: bkgserv.Backgrounds[1] },
      2: { Backgrounds: bkgserv.Backgrounds[2] },
      3: { Backgrounds: bkgserv.Backgrounds[3] },
      4: { Backgrounds: bkgserv.Backgrounds[4] }
    }));
  }


}
