"use strict";
(self["webpackChunkatow"] = self["webpackChunkatow"] || []).push([["main"],{

/***/ 3484:
/*!********************************************!*\
  !*** ./src/app/affiliation/affiliation.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Affiliation: () => (/* binding */ Affiliation)
/* harmony export */ });
class Affiliation {
  constructor(founding, moduleInfo) {
    this.founding = founding;
    this.moduleInfo = moduleInfo;
    this.timeline = {};
    this.timeline[founding - 2398] = [{
      Kind: AffiliationEvent.Founded,
      ...moduleInfo
    }];
  }
  Update(when, update) {
    this.timeline[when - 2398] = [...(this.timeline[when - 2398] ?? []), {
      Kind: AffiliationEvent.Modified,
      ...update
    }];
    return this;
  }
  RemoveRegion(when, name, citation) {
    this.timeline[when - 2398] = [...(this.timeline[when - 2398] ?? []), {
      Kind: AffiliationEvent.RegionRemoved,
      Name: name,
      Citation: citation
    }];
    return this;
  }
  AddRegion(when, subaff) {
    this.timeline[when - 2398] = [...(this.timeline[when - 2398] ?? []), {
      Kind: AffiliationEvent.RegionAdded,
      Subaffiliation: subaff
    }];
    return this;
  }
  UpdateRegion(when, update, rename) {
    this.timeline[when - 2398] = [...(this.timeline[when - 2398] ?? []), {
      Kind: AffiliationEvent.RegionChanged,
      Subaffiliation: update,
      NewName: rename
    }];
    return this;
  }
  At(when) {
    const importantDates = Object.keys(this.timeline).filter(key => +key <= when).sort((a, b) => +a - +b).map(key => +key).filter(date => this.timeline[date]?.some(event => event.Kind === AffiliationEvent.Founded || event.Kind === AffiliationEvent.Dissolved)).reverse();
    const latest = importantDates.pop();
    if (latest === undefined) throw new Error(); //this means dates is empty and latest is undefined, which means there is no defined founding, which is bad.
    if (!this.timeline[latest]?.some(date => date.Kind === AffiliationEvent.Founded || date.Kind === AffiliationEvent.Modified)) {
      //this means that the most recent affiliation event is that it dissolved, which means if that date is before now (which it must be because above) then there is no affiliation to return
      return undefined;
    }
    //build the affiliation between 'latest' and 'when'
    const dates = Object.keys(this.timeline).filter(key => +key >= latest && +key <= when).sort((a, b) => +a - +b).map(key => +key);
    //this is the actual data, just unprocssed
    const activities = dates.flatMap(date => this.timeline[date]?.filter(event => event.Kind === AffiliationEvent.RegionAdded || event.Kind === AffiliationEvent.RegionChanged || event.Kind === AffiliationEvent.RegionRemoved || event.Kind === AffiliationEvent.Modified));
    const founding = [...dates].shift();
    if (founding === undefined) throw new Error();
    const start = this.timeline[founding]?.filter(date => date.Kind === AffiliationEvent.Founded)[0];
    const process = sofar => {
      const current = activities.shift();
      if (!current) return sofar;
      switch (current.Kind) {
        case AffiliationEvent.Founded:
          return process(sofar);
        case AffiliationEvent.Dissolved:
          return undefined;
        case AffiliationEvent.Modified:
          return process({
            Name: current.Name ?? sofar?.Name,
            Cost: current.Cost ?? sofar?.Cost,
            Experience: current.Experience ?? sofar?.Experience,
            PrimaryLanguage: current.PrimaryLanguage ?? sofar?.PrimaryLanguage,
            SecondaryLanguages: current.SecondaryLanguages ?? sofar?.SecondaryLanguages,
            Subaffiliations: sofar?.Subaffiliations ?? [],
            Citation: current.Citation ?? sofar?.Citation,
            ArchtypeScore: {
              ...sofar?.ArchtypeScore,
              ...current.ArchtypeScore
            },
            Protocol: current.Protocol ?? sofar?.Protocol
          });
        case AffiliationEvent.RegionAdded:
          return process({
            Name: sofar?.Name,
            Cost: sofar?.Cost,
            Experience: sofar?.Experience,
            PrimaryLanguage: sofar?.PrimaryLanguage,
            SecondaryLanguages: sofar?.SecondaryLanguages,
            Subaffiliations: [...(sofar?.Subaffiliations ?? []), current.Subaffiliation],
            Citation: current.Citation ?? sofar?.Citation,
            ArchtypeScore: {
              ...sofar?.ArchtypeScore,
              ...current.ArchtypeScore
            },
            Protocol: sofar?.Protocol
          });
        case AffiliationEvent.RegionRemoved:
          return process({
            Name: sofar?.Name,
            Cost: sofar?.Cost,
            Experience: sofar?.Experience,
            PrimaryLanguage: sofar?.PrimaryLanguage,
            SecondaryLanguages: sofar?.SecondaryLanguages,
            Subaffiliations: sofar?.Subaffiliations.filter(sub => sub.Name !== current.Name) ?? [],
            Citation: current.Citation ?? sofar?.Citation,
            ArchtypeScore: {
              ...sofar?.ArchtypeScore,
              ...current.ArchtypeScore
            },
            Protocol: sofar?.Protocol
          });
        case AffiliationEvent.RegionChanged:
          return process({
            Name: current.Name ?? sofar?.Name,
            Cost: current.Cost ?? sofar?.Cost,
            Experience: current.Experience ?? sofar?.Experience,
            PrimaryLanguage: sofar?.PrimaryLanguage,
            SecondaryLanguages: sofar?.SecondaryLanguages,
            Subaffiliations: [...[...(sofar?.Subaffiliations.filter(sub => sub.Name !== current.Subaffiliation?.Name) ?? [])], {
              ...current.Subaffiliation,
              Name: current.NewName ?? current.Subaffiliation?.Name
            }],
            Citation: current.Citation ?? sofar?.Citation,
            ArchtypeScore: {
              ...sofar?.ArchtypeScore,
              ...current.ArchtypeScore
            },
            Protocol: sofar?.Protocol
          });
      }
    };
    const ret = process({
      Name: start.Name,
      Cost: start.Cost,
      Experience: start.Experience,
      PrimaryLanguage: start.PrimaryLanguage,
      SecondaryLanguages: start.SecondaryLanguages,
      Subaffiliations: [],
      Citation: start.Citation,
      ArchtypeScore: start?.ArchtypeScore,
      Protocol: start.Protocol
    });
    return ret;
  }
}
var AffiliationEvent;
(function (AffiliationEvent) {
  AffiliationEvent[AffiliationEvent["Founded"] = 0] = "Founded";
  AffiliationEvent[AffiliationEvent["Dissolved"] = 1] = "Dissolved";
  AffiliationEvent[AffiliationEvent["RegionAdded"] = 2] = "RegionAdded";
  AffiliationEvent[AffiliationEvent["RegionRemoved"] = 3] = "RegionRemoved";
  AffiliationEvent[AffiliationEvent["RegionChanged"] = 4] = "RegionChanged";
  AffiliationEvent[AffiliationEvent["Modified"] = 5] = "Modified";
})(AffiliationEvent || (AffiliationEvent = {}));

/***/ }),

/***/ 5952:
/*!*****************************************************!*\
  !*** ./src/app/affiliation/affiliations.service.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AffiliationsService: () => (/* binding */ AffiliationsService)
/* harmony export */ });
/* harmony import */ var _affiliation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./affiliation */ 3484);
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/common */ 6555);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;



class AffiliationsService {
  constructor() {
    this.Affiliations = [];
    const CapellanPrimaryLanguage = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
      Subskill: 'Mandarin Chinese',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const CapellanSecondaryLanguages = ['Russian', 'Cantonese', 'Vietnamese', 'English'].map(lang => {
      return {
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: lang,
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
      };
    });
    const CapellanProtocol = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
      Subskill: 'Capellan',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const FedSunsPrimaryLanguage = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
      Subskill: 'TODO',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const FedSunsSecondaryLanguages = [].map(lang => {
      return {
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: lang,
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
      };
    });
    const FedSunsProtocol = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
      Subskill: 'FedSuns',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const DCProtocol = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
      Subskill: 'Combine',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const DCPrimaryLanguage = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
      Subskill: 'Japanese',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const DCSecondaryLanguages = ['English', 'Swedenese', 'Arabic'].map(lang => {
      return {
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: lang,
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
      };
    });
    const LyranPrimaryLanguage = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
      Subskill: 'TODO',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const LyranSecondaryLanguages = [].map(lang => {
      return {
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: lang,
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
      };
    });
    const LyranProtocol = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
      Subskill: 'Lyran',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const FWLPrimaryLanguage = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
      Subskill: 'TODO',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const FWLSecondaryLanguages = [].map(lang => {
      return {
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: lang,
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
      };
    });
    const FWLProtocol = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
      Subskill: 'FWL',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const RotSProtocol = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
      Subskill: 'Repub. o/t Sphere',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const CanopianPrimaryLanguage = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
      Subskill: 'TODO',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const CanopianSecondaryLanguages = [].map(lang => {
      return {
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: lang,
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
      };
    });
    const CanopianProtocol = {
      Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
      Subskill: 'Canopian',
      Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill
    };
    const capellan = new _affiliation__WEBPACK_IMPORTED_MODULE_0__.Affiliation(2398, {
      Name: 'Capellan Confideration',
      Cost: 150,
      PrimaryLanguage: CapellanPrimaryLanguage,
      SecondaryLanguages: CapellanSecondaryLanguages,
      Protocol: CapellanProtocol,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.ExceptionalAttribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 15
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'Andurien Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Patient,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 25
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }, {
        ...FWLProtocol,
        Quantity: 15
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'Capella Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 55
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 10
      }, {
        Or: ['Russian', 'English'].map(lang => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
            Subskill: lang
          };
        }),
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 20
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'Chesterson Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 45
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Introvert,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: 'Russian',
        Quantity: 15
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Chesterton History',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 20
      }, {
        ...CapellanProtocol,
        Quantity: 20
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'St. Ives Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: '*',
        Quantity: 10
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications).map(skill => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
            Subskill: skill
          };
        }),
        Quantity: 15
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 10
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 25
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Training,
        Quantity: 25
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'Sarna Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Capellan History',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 10
      }, {
        ...CapellanProtocol,
        Quantity: 5
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'Sian Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 85
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of Non-Capellans',
        Quantity: -125
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 40
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Capellan History',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 10
      }, {
        ...CapellanProtocol,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'Tikonov Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Introvert,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: 'Russian',
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Tikonov History',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 20
      }, {
        ...CapellanProtocol,
        Quantity: 20
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).RemoveRegion(2898, 'Andurien Commonality', {
      Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.BestGuess,
      Page: 0,
      Notes: ['This is a best guess from data I could figure on sarna.net']
    }).RemoveRegion(3028, 'Liao Commonality', {
      Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3052,
      Page: 158
    }).UpdateRegion(3028, {
      Name: 'St. Ives Commonality',
      Cost: 125,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Paranoia',
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 55
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 15
      }, {
        ...CapellanProtocol,
        Quantity: -15
      }, {
        ...FedSunsProtocol,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: '*',
        Quantity: 5
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3052,
        Page: 158
      }
    }, 'St. Ives Compact').RemoveRegion(3040, 'Chesterson Commonality', {
      Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.BestGuess,
      Page: 0,
      Notes: ['This is a best guess from data I could figure on sarna.net']
    });
    capellan.Update(3052, {
      Cost: 100,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.ExceptionalAttribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Paranoia',
        Quantity: -150
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 15
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3052,
        Page: 158
      }
    }).UpdateRegion(3052, {
      Name: 'Capella Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3052,
        Page: 158
      }
    }).UpdateRegion(3052, {
      Name: 'Sian Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of Non-Capellans',
        Quantity: -175
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Capellan History',
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 15
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3052,
        Page: 158
      }
    }).AddRegion(3057, {
      Name: 'Liao Commonality',
      Cost: 125,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Paranoia',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -50
      }, {
        Or: [...new Set([FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, LyranPrimaryLanguage, ...LyranSecondaryLanguages])],
        Quantity: 25
      }, {
        Or: [FedSunsProtocol, LyranProtocol],
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: '*',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 15
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3062,
        Page: 152
      }
    });
    capellan.Update(3062, {
      Cost: 125,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.ExceptionalAttribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Paranoia',
        Quantity: -150
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 15
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3062,
        Page: 152
      }
    }).RemoveRegion(3062, 'St. Ives Compact', {
      Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3062,
      Page: 152
    }).UpdateRegion(3062, {
      Name: 'Capella Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 55
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 10
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 5
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3062,
        Page: 152
      }
    }).UpdateRegion(3062, {
      Name: 'Sian Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 85
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of Non-Capellans',
        Quantity: -155
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Capellan History',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 10
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3062,
        Page: 152
      }
    }).AddRegion(3062, {
      Name: 'Victoria Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: '*',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 15
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3062,
        Page: 152
      }
    });
    capellan.Update(3076, {
      Cost: 150,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.ExceptionalAttribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Paranoia',
        Quantity: -100
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 10
      }, {
        ...CapellanProtocol,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 5
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 54
      }
    }).UpdateRegion(3076, {
      Name: 'Capella Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 15
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 5
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 54
      }
    }).UpdateRegion(3076, {
      Name: 'Liao Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -25
      }, {
        Or: [...new Set([FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, LyranPrimaryLanguage, ...LyranSecondaryLanguages])],
        Quantity: 15
      }, {
        Or: [FedSunsProtocol, LyranProtocol],
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: '*',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 15
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 54
      }
    }).UpdateRegion(3076, {
      Name: 'Sian Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of FedSuns',
        Quantity: -135
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Capellan History',
        Quantity: 10
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 54
      }
    }).AddRegion(3076, {
      Name: 'St. Ives Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 50
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 15
      }, {
        ...CapellanProtocol,
        Quantity: -15
      }, {
        ...FedSunsProtocol,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: '*',
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 54
      }
    }).UpdateRegion(3076, {
      Name: 'Victoria Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: '*',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 15
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 54
      }
    }).UpdateRegion(3085, {
      Name: 'Capella Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.FieldManual3085,
        Page: 233,
        Notes: ["Book uses name 'Capellan Commonality'"]
      }
    }).RemoveRegion(3085, 'Sarna Commonality', {
      Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.FieldManual3085,
      Page: 233
    }).UpdateRegion(3085, {
      Name: 'Liao Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: "Hatred of the Republic of the Sphere",
        Quantity: -50
      }, {
        Or: [...new Set([FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, LyranPrimaryLanguage, ...LyranSecondaryLanguages, FWLPrimaryLanguage, ...FWLSecondaryLanguages])],
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 20
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.FieldManual3085,
        Page: 233
      }
    }, 'Sarna Commonality').UpdateRegion(3085, {
      Name: 'Sian Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of FedSuns',
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of Republic of the Sphere',
        Quantity: -60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Capellan History',
        Quantity: 10
      }, {
        ...CapellanProtocol,
        Quantity: 15
      }, {
        Or: CapellanSecondaryLanguages,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.FieldManual3085,
        Page: 233
      }
    }).UpdateRegion(3085, {
      Name: 'St. Ives Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of FedSuns',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -10
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: '*',
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.FieldManual3085,
        Page: 233
      }
    }).AddRegion(3135, {
      Name: 'Chesterton Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 15
      }, {
        Or: FedSunsSecondaryLanguages,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }, {
        Or: [CapellanProtocol, RotSProtocol],
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3145,
        Page: 184,
        Notes: ["also see pg. 185"]
      }
    }).UpdateRegion(3135, {
      Name: 'Tikonov Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: 'Russian',
        Quantity: 15
      }, {
        Or: [CapellanProtocol, RotSProtocol],
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3145,
        Page: 184,
        Notes: ["also see pg. 185"]
      }
    }).UpdateRegion(3145, {
      Name: 'Capella Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 20
      }, {
        Or: ['Russian', 'English'].map(lang => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
            Subskill: lang
          };
        }),
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }, {
        Or: [CapellanProtocol, RotSProtocol],
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3145,
        Page: 184,
        Notes: ["Book uses name 'Capellan Commonality'"]
      }
    }).UpdateRegion(3145, {
      Name: 'Sarna Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of Republic of the Sphere',
        Quantity: -50
      }, {
        Or: [...new Set([FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, FWLPrimaryLanguage, ...FWLSecondaryLanguages])],
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 20
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3145,
        Page: 184
      }
    }).UpdateRegion(3145, {
      Name: 'Sian Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of FedSuns',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of Republic of the Sphere',
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 35
      }, {
        Or: [...new Set([...CapellanSecondaryLanguages, ...CanopianSecondaryLanguages])],
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Canopian History',
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Capellan History',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 10
      }, {
        ...CanopianProtocol,
        Quantity: 5
      }, {
        ...CapellanProtocol,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3145,
        Page: 184
      }
    }).UpdateRegion(3145, {
      Name: 'St. Ives Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Citizenship,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of Republic of the Sphere',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 10
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: '*',
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3145,
        Page: 184
      }
    }).UpdateRegion(3145, {
      Name: 'Victoria Commonality',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -50
      }, {
        Or: [CanopianPrimaryLanguage, ...CanopianSecondaryLanguages],
        Quantity: 15
      }, {
        Or: [...new Set([FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages, FWLPrimaryLanguage, ...FWLSecondaryLanguages, CapellanPrimaryLanguage, ...CapellanSecondaryLanguages])],
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation,
        Quantity: 10
      }, {
        ...CanopianProtocol,
        Quantity: 10
      }, {
        ...CapellanProtocol,
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Survival,
        Subskill: '*',
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport3145,
        Page: 184
      }
    });
    this.Affiliations.push(capellan);
    const draconis = new _affiliation__WEBPACK_IMPORTED_MODULE_0__.Affiliation(2398, {
      Name: 'Draconis Combine',
      Cost: 150,
      PrimaryLanguage: DCPrimaryLanguage,
      SecondaryLanguages: DCSecondaryLanguages,
      Protocol: DCProtocol,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of House Davion',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Xenophobia',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: 'Oral Tradition',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: 'Combine',
        Quantity: 25
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'Azami',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Xenophobia',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.ThickSkinned,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: 'Arabic',
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: 'Japanese',
        Quantity: -10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MeleeWeapons,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.AnimalHandling,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.AnimalHandling.Riding,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Survival,
        Subskill: '*',
        Quantity: 50
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    }).AddRegion(2398, {
      Name: 'Benjamin District',
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Hatred of house Davion',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Compulsion,
        Trigger: 'Xenophobia',
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Patient,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: 'Oral Tradition',
        Quantity: 15
      }, {
        Or: [FedSunsPrimaryLanguage, ...FedSunsSecondaryLanguages],
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: 'Combine',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SmallArms,
        Quantity: 10
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.EraReport2750,
        Page: 150
      }
    });
    this.Affiliations.push(draconis);
  }
  At(when) {
    return this.Affiliations.flatMap(aff => aff.At(when - 2398) ?? []);
  }
}
_class = AffiliationsService;
_class.ɵfac = function AffiliationsService_Factory(t) {
  return new (t || _class)();
};
_class.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: _class,
  factory: _class.ɵfac,
  providedIn: 'root'
});

/***/ }),

/***/ 3966:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;



const routes = [];
class AppRoutingModule {}
_class = AppRoutingModule;
_class.ɵfac = function AppRoutingModule_Factory(t) {
  return new (t || _class)();
};
_class.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
  type: _class
});
_class.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule.forRoot(routes), _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule]
  });
})();

/***/ }),

/***/ 6401:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _character_character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character/character */ 7174);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _chargen_character_character_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chargen/character/character.component */ 2631);
var _class;




const _c0 = ["char"];
function AppComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div")(1, "label", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "New");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "input", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function AppComponent_div_1_Template_input_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r3.Start());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
function AppComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div")(1, "label", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Save");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "input", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function AppComponent_div_2_Template_input_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r5.Save());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
function AppComponent_app_character_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-character", 9, 10);
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("character", ctx_r2.character);
  }
}
class AppComponent {
  constructor(ref) {
    this.ref = ref;
    this.title = 'atow';
  }
  Start() {
    const hadChar = !!this.character;
    if (hadChar) console.log(this.char.vitals.characterName);
    this.character = new _character_character__WEBPACK_IMPORTED_MODULE_0__.Character({
      Option: _character_character__WEBPACK_IMPORTED_MODULE_0__.Option.Create
    });
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  Save() {}
  Load(e) {
    this.character = new _character_character__WEBPACK_IMPORTED_MODULE_0__.Character({
      Option: _character_character__WEBPACK_IMPORTED_MODULE_0__.Option.Load,
      File: e.target.files
    });
    this.char.character = this.character;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  characterChanged(e) {
    this.character = e;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
}
_class = AppComponent;
_class.ɵfac = function AppComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-root"]],
  viewQuery: function AppComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.char = _t.first);
    }
  },
  decls: 8,
  vars: 3,
  consts: [[1, "underconstruction"], [4, "ngIf"], ["for", "oldchar"], ["type", "file", "id", "oldchar", "name", "oldchar", 3, "change"], [3, "character", 4, "ngIf"], ["for", "newchar"], ["type", "button", "value", "+", "id", "newchar", "name", "newchar", 3, "click"], ["for", "savchar"], ["type", "button", "value", "...", "id", "savchar", "name", "savchar", 3, "click"], [3, "character"], ["char", ""]],
  template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, AppComponent_div_1_Template, 4, 0, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, AppComponent_div_2_Template, 4, 0, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div")(4, "label", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Load");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "input", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function AppComponent_Template_input_change_6_listener($event) {
        return ctx.Load($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, AppComponent_app_character_7_Template, 2, 1, "app-character", 4);
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.character);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.character);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.character);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _chargen_character_character_component__WEBPACK_IMPORTED_MODULE_1__.CharacterComponent],
  styles: ["\n\n.column[_ngcontent-%COMP%] {\n  float: left;\n  padding: 10px;\n}\n\n\n\n.row[_ngcontent-%COMP%]:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n.underconstruction[_ngcontent-%COMP%] {\n  background-color: darkgray;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLDhEQUFBO0FBQ0E7RUFDRSxXQUFBO0VBQ0EsYUFBQTtBQUFGOztBQUdBLG1DQUFBO0FBQ0E7RUFDRSxXQUFBO0VBQ0EsY0FBQTtFQUNBLFdBQUE7QUFBRjs7QUFHQTtFQUNFLDBCQUFBO0FBQUYiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogQ3JlYXRlIHR3byB1bmVxdWFsIGNvbHVtbnMgdGhhdCBmbG9hdHMgbmV4dCB0byBlYWNoIG90aGVyICovXHJcbi5jb2x1bW4ge1xyXG4gIGZsb2F0OiBsZWZ0O1xyXG4gIHBhZGRpbmc6IDEwcHg7XHJcbn1cclxuXHJcbi8qIENsZWFyIGZsb2F0cyBhZnRlciB0aGUgY29sdW1ucyAqL1xyXG4ucm93OmFmdGVyIHtcclxuICBjb250ZW50OiBcIlwiO1xyXG4gIGRpc3BsYXk6IHRhYmxlO1xyXG4gIGNsZWFyOiBib3RoO1xyXG59XHJcblxyXG4udW5kZXJjb25zdHJ1Y3Rpb24ge1xyXG4gIGJhY2tncm91bmQtY29sb3I6IGRhcmtncmF5O1xyXG59XHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 8629:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 3966);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 6401);
/* harmony import */ var _chargen_character_character_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chargen/character/character.component */ 2631);
/* harmony import */ var _chargen_stages_stage0_stage0_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chargen/stages/stage0/stage0.component */ 5821);
/* harmony import */ var _chargen_stages_stage1_stage1_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chargen/stages/stage1/stage1.component */ 5983);
/* harmony import */ var _chargen_stages_stage2_stage2_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./chargen/stages/stage2/stage2.component */ 4108);
/* harmony import */ var _chargen_stages_stage3_stage3_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./chargen/stages/stage3/stage3.component */ 152);
/* harmony import */ var _chargen_stages_stage4_stage4_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./chargen/stages/stage4/stage4.component */ 11);
/* harmony import */ var _utils_stat_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/stat.pipe */ 6987);
/* harmony import */ var _utils_exp_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/exp.pipe */ 4908);
/* harmony import */ var _utils_archtype_pipe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/archtype.pipe */ 5782);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils/citation.pipe */ 419);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _utils_or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/or-exp/or-exp.component */ 2298);
/* harmony import */ var _chargen_stages_stage0_default_exp_default_exp_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./chargen/stages/stage0/default-exp/default-exp.component */ 4358);
/* harmony import */ var _chargen_stages_newaff_aff_aff_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./chargen/stages/newaff/aff/aff.component */ 9981);
/* harmony import */ var _chargen_stages_newaff_subaff_subaff_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./chargen/stages/newaff/subaff/subaff.component */ 4031);
/* harmony import */ var _utils_star_exp_star_exp_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./utils/star-exp/star-exp.component */ 5483);
/* harmony import */ var _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./utils/exp/exp.component */ 8742);
/* harmony import */ var _utils_pick_exp_pick_exp_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./utils/pick-exp/pick-exp.component */ 6062);
/* harmony import */ var _chargen_stages_newaff_newaff_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./chargen/stages/newaff/newaff.component */ 2961);
/* harmony import */ var _chargen_stages_random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./chargen/stages/random-life-event/random-life-event.component */ 6364);
/* harmony import */ var _utils_set_exp_set_exp_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./utils/set-exp/set-exp.component */ 7030);
/* harmony import */ var _chargen_character_vitals_vitals_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./chargen/character/vitals/vitals.component */ 4016);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;



























class AppModule {}
_class = AppModule;
_class.ɵfac = function AppModule_Factory(t) {
  return new (t || _class)();
};
_class.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_23__["ɵɵdefineNgModule"]({
  type: _class,
  bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
});
_class.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_23__["ɵɵdefineInjector"]({
  imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_24__.BrowserModule, _angular_common__WEBPACK_IMPORTED_MODULE_25__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_26__.FormsModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_23__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _chargen_character_character_component__WEBPACK_IMPORTED_MODULE_2__.CharacterComponent, _chargen_stages_stage0_stage0_component__WEBPACK_IMPORTED_MODULE_3__.Stage0Component, _chargen_stages_stage1_stage1_component__WEBPACK_IMPORTED_MODULE_4__.Stage1Component, _chargen_stages_stage2_stage2_component__WEBPACK_IMPORTED_MODULE_5__.Stage2Component, _chargen_stages_stage3_stage3_component__WEBPACK_IMPORTED_MODULE_6__.Stage3Component, _chargen_stages_stage4_stage4_component__WEBPACK_IMPORTED_MODULE_7__.Stage4Component, _utils_stat_pipe__WEBPACK_IMPORTED_MODULE_8__.StatPipe, _utils_exp_pipe__WEBPACK_IMPORTED_MODULE_9__.ExpPipe, _utils_archtype_pipe__WEBPACK_IMPORTED_MODULE_10__.ArchtypePipe, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_11__.CitationPipe, _utils_or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_12__.OrExpComponent, _chargen_stages_stage0_default_exp_default_exp_component__WEBPACK_IMPORTED_MODULE_13__.DefaultExpComponent, _chargen_stages_newaff_aff_aff_component__WEBPACK_IMPORTED_MODULE_14__.AffComponent, _chargen_stages_newaff_subaff_subaff_component__WEBPACK_IMPORTED_MODULE_15__.SubaffComponent, _utils_star_exp_star_exp_component__WEBPACK_IMPORTED_MODULE_16__.StarExpComponent, _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_17__.ExpComponent, _utils_pick_exp_pick_exp_component__WEBPACK_IMPORTED_MODULE_18__.PickExpComponent, _chargen_stages_newaff_newaff_component__WEBPACK_IMPORTED_MODULE_19__.NewaffComponent, _chargen_stages_random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_20__.RandomLifeEventComponent, _utils_set_exp_set_exp_component__WEBPACK_IMPORTED_MODULE_21__.SetExpComponent, _chargen_character_vitals_vitals_component__WEBPACK_IMPORTED_MODULE_22__.VitalsComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_24__.BrowserModule, _angular_common__WEBPACK_IMPORTED_MODULE_25__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_26__.FormsModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule]
  });
})();

/***/ }),

/***/ 6032:
/*!******************************************!*\
  !*** ./src/app/background/background.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Background: () => (/* binding */ Background)
/* harmony export */ });
class Background {
  constructor(when, moduleInfo) {
    this.when = when;
    this.moduleInfo = moduleInfo;
    this.timeline = {};
    const date = when - 2398;
    if (date > 0) {
      this.timeline[0] = [{
        Kind: BackgroundEvent.Disallow
      }];
    }
    this.timeline[date] = [{
      Kind: BackgroundEvent.Allowed,
      ...moduleInfo
    }];
  }
  enable(when, backgroundInfo = undefined) {
    this.timeline[when - 2398] = [{
      Kind: BackgroundEvent.Allowed,
      ...backgroundInfo
    }];
    return this;
  }
  disable(when) {
    this.timeline[when - 2398] = [{
      Kind: BackgroundEvent.Disallow
    }];
    return this;
  }
  update(when, backgroundInfo) {
    this.timeline[when - 2398] = [{
      Kind: BackgroundEvent.Modify,
      ...backgroundInfo
    }];
    return this;
  }
  At(when) {
    const importantDates = Object.keys(this.timeline).filter(key => +key <= when).sort((a, b) => +a - +b).map(key => +key).filter(date => this.timeline[date]?.some(event => event.Kind === BackgroundEvent.Allowed || event.Kind === BackgroundEvent.Disallow)).reverse();
    const latest = importantDates.pop();
    if (latest === undefined) throw new Error(); //this means dates is empty and latest is undefined, which means there is no defined founding, which is bad.
    if (!this.timeline[latest]?.some(date => date.Kind === BackgroundEvent.Allowed)) {
      //this means that the most recent background event is that it disallowed, which means if that date is before now (which it must be because above) then there is no background to return
      return undefined;
    }
    //build the background between 'latest' and 'when'
    const dates = Object.keys(this.timeline).filter(key => +key >= latest && +key <= when).sort((a, b) => +a - +b).map(key => +key);
    //this is the actual data, just unprocssed
    const events = dates.flatMap(date => this.timeline[date]?.filter(event => event.Kind === BackgroundEvent.Allowed || event.Kind === BackgroundEvent.Modify));
    const initial = [...dates].shift();
    if (initial === undefined) throw new Error();
    const start = this.timeline[initial]?.filter(date => date.Kind === BackgroundEvent.Allowed)[0];
    const process = sofar => {
      const current = events.shift();
      if (!current) return sofar;
      switch (current.Kind) {
        case BackgroundEvent.Allowed:
        case BackgroundEvent.Modify:
          return process({
            Name: current.Name ?? sofar.Name,
            Prereq: current.Prereq ?? sofar.Prereq,
            Cost: current.Cost ?? sofar.Cost,
            Experience: current.Experience ?? sofar.Experience,
            Duration: current.Duration ?? sofar.Duration,
            Citation: current.Citation ?? sofar.Citation,
            ArchtypeScore: {
              ...sofar?.ArchtypeScore,
              ...current.ArchtypeScore
            },
            Options: current.Options
          });
        case BackgroundEvent.Disallow:
          return undefined;
      }
    };
    const ret = process({
      Name: start.Name,
      Prereq: start.Prereq,
      Cost: start.Cost,
      Experience: start.Experience,
      Duration: start.Duration,
      Citation: start.Citation,
      ArchtypeScore: start.ArchtypeScore,
      Options: start.Options
    });
    return ret;
  }
}
var BackgroundEvent;
(function (BackgroundEvent) {
  BackgroundEvent[BackgroundEvent["Allowed"] = 0] = "Allowed";
  BackgroundEvent[BackgroundEvent["Disallow"] = 1] = "Disallow";
  BackgroundEvent[BackgroundEvent["Modify"] = 2] = "Modify";
})(BackgroundEvent || (BackgroundEvent = {}));

/***/ }),

/***/ 5961:
/*!***************************************************!*\
  !*** ./src/app/background/backgrounds.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BackgroundsService: () => (/* binding */ BackgroundsService)
/* harmony export */ });
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/common */ 6555);
/* harmony import */ var _background__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./background */ 6032);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;



class BackgroundsService {
  constructor() {
    this.Backgrounds = {
      1: [],
      2: [],
      4: []
    };
    // This is a bit of a beast but it builds all the possibilities for the three traits values summed to 5
    const nobilityPrereqs = [...Array(6).keys()].flatMap(title => [...Array(6).keys()].flatMap(wealth => [...Array(6).keys()].map(property => {
      return {
        [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Title]: title,
        [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth]: wealth,
        [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property]: property
      };
    }))).filter(sum => sum[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Title] + sum[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth] + sum[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property] === 5).map(total => {
      return {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Title,
          Op: '>=',
          Level: total[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Title]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
          Op: '>=',
          Level: total[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property,
          Op: '>=',
          Level: total[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property]
        }]
      };
    });
    const whiteCollarPrereqs = [...Array(4).keys()].flatMap(wealth => [...Array(4).keys()].map(property => {
      return {
        [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth]: wealth,
        [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property]: property
      };
    })).filter(sum => sum[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth] + sum[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property] === 3).map(total => {
      return {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
          Op: '>=',
          Level: total[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property,
          Op: '>=',
          Level: total[_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property]
        }]
      };
    });
    const flexiXPStage2 = quantity => {
      return {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att,
              Limit: 200
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait,
              Limit: 200
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill,
              Limit: 35
            };
          })]
        },
        Quantity: quantity
      };
    };
    this.Backgrounds[1].push(new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: "Back Woods",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
          Op: '>=',
          Level: 5
        }]
      },
      Cost: 290,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Equipped,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Fit,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate,
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Toughness,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: -5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation.Ground,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Running,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival,
        Subskill: '*',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Tracking.Wilds,
        Quantity: 10
      }, {
        Pick: {
          Count: 2,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          })]
        },
        Quantity: 25
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 65
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Blue Collar',
      Cost: 210,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: 45
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Dexterity,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: -10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: -10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: '*',
        Quantity: 10
      }, {
        Pick: {
          Count: 2,
          Options: [{
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
            Subskill: '*'
          }, {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
            Subskill: '*'
          }]
        },
        Quantity: 5
      }, {
        Pick: {
          Count: 4,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 10
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 65
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Farm',
      Cost: 275,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Dexterity,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.AnimalEmpathy,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Toughness,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: 'Agriculture',
        Quantity: 10
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.AnimalHandling).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling,
            Subskill: sub
          };
        }),
        Quantity: 15
      }, {
        Pick: {
          Count: 2,
          Options: [{
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
            Subskill: '*'
          }, {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
            Subskill: '*'
          }]
        },
        Quantity: 5
      }, {
        Pick: {
          Count: 4,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 10
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 65,
        Notes: ['Added subskill to AnimalHandling skill.']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Fugitives',
      Cost: 225,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.DarkSecret,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Introvert,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -100
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics).filter(trait => [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CombatSense, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GoodHearing, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GoodVision, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Patient, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ThickSkinned, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Toughness].includes(trait)).map(trait => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
            Trait: trait
          };
        }),
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acting,
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '*',
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Running,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '*',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations,
        Quantity: 5
      }, {
        Pick: {
          Count: 4,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 5
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 65,
        Notes: ['Continued on page 66.']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Nobility',
      Prereq: {
        And: [{
          IsClanner: false
        }, {
          Or: nobilityPrereqs
        }]
      },
      Cost: 215,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Equipped,
        Quantity: 125
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -200
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GlassJaw,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: 175
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: 150
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Appraisal,
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art,
        Subskill: '*',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: 10
      }, {
        Pick: {
          Count: 4,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 5
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 66
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Slave',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
          Op: '>=',
          Level: 4
        }]
      },
      Cost: 45,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Dexterity,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Equipped,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -200
      }, {
        Pick: {
          Count: 1,
          Options: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).filter(trait => [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude].includes(trait)).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          })
        },
        Quantity: 90
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: -5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: '*',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 15
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician).map(tech => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician,
            Subskill: tech
          };
        }),
        Quantity: 5
      }, {
        Pick: {
          Count: 4,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          })]
        },
        Quantity: 25
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 66
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Street',
      Cost: 250,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion,
        Trigger: 'Paranoia',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate,
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Toughness,
        Quantity: 200
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: -5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 10
      }, {
        Pick: {
          Count: 4,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 10
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 66,
        Notes: ['Changed Compulsion trigger from "Paranoid" to "Paranoia"']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'War Orphan',
      Cost: 170,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion,
        Trigger: 'Traumatic Memories',
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Introvert,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.SixthSense,
        Quantity: 150
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: -5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 10
      }, {
        Pick: {
          Count: 3,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          })]
        },
        Quantity: 25
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 66
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'White Collar',
      Cost: 170,
      Prereq: {
        Or: whiteCollarPrereqs
      },
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Equipped,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExtraIncome,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GlassJaw,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art,
        Subskill: '*',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: 5
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: 10
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician).map(tech => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician,
            Subskill: tech
          };
        }),
        Quantity: 5
      }, {
        Pick: {
          Count: 3,
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 5
      }],
      Duration: 10,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 66
      }
    }));
    this.Backgrounds[2].push(new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Adolescent Warefare',
      Prereq: {
        And: [{
          Not: {
            Stage: 1,
            Name: 'Nobility'
          }
        }, {
          Not: {
            Stage: 1,
            Name: 'Trueborn Crèche'
          }
        }]
      },
      Cost: 500,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: -30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CombatSense,
        Quantity: 80
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion,
        Trigger: 'Paranoia',
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.General,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: -10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Running,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 45
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival,
        Subskill: '*',
        Quantity: 45
      }, flexiXPStage2(130)],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 67,
        Notes: ['Changed Compulsion trigger from "Paranoid" to "Paranoia"', 'Changed MedTech skill to have no Subskill to General']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Back Woods',
      Cost: 500,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 70
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.AnimalEmpathy,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GoodHearing,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Introvert,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Climbing,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.General,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 45
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: -15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival,
        Subskill: '*',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Tracking.Wilds,
        Quantity: 30
      }, flexiXPStage2(125)],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 67,
        Notes: ['Changed MedTech skill to have no Subskill to General', 'Changes Survival subskill from Forest to any']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Farm',
      Cost: 400,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.AnimalEmpathy,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Administration,
        Quantity: 35
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.AnimalHandling).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling,
            Subskill: sub
          };
        }),
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: 'Agriculture',
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Driving.Ground,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
        Quantity: 30
      }, flexiXPStage2(115)],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 67,
        Notes: ['Added subtype to AnimalHandling skill.']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'High School',
      Cost: 400,
      Prereq: {
        And: [{
          IsClanner: false
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate,
          Op: '<=',
          Level: 0
        }]
      },
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Swimming,
        Quantity: 20
      }, flexiXPStage2(185)],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 68
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Mercenary Brat',
      Cost: 600,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.TechEmpathy,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: 'Soldier',
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Driving.Ground,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '*',
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.General,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '*',
        Quantity: 20
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics,
            Subskill: sub
          };
        }),
        Quantity: 10
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician,
            Subskill: sub
          };
        }),
        Quantity: 30
      }, flexiXPStage2(150)],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 68,
        Notes: ['Changed MedTech skill to have no Subskill to General']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Military School',
      Cost: 500,
      Prereq: {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Op: '>=',
        Level: 3
      },
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Fit,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Rank,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: 'Soldier',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: 'Military History',
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.General,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Running,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Strategy,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Swimming,
        Quantity: 30
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill,
              Limit: 35
            };
          })]
        },
        Quantity: 40
      }],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 68,
        Notes: ['Changed MedTech skill to have no Subskill to General']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Preparatory School',
      Cost: 500,
      Prereq: {
        And: [{
          Not: {
            Stage: 1,
            Name: 'Back Woods'
          }
        }, {
          Not: {
            Stage: 1,
            Name: 'Fugitive'
          }
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate,
          Op: '<=',
          Level: 0
        }]
      },
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: 60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExtraIncome,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Gregarious,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Archery,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '*',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.General,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: 40
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att,
              Limit: 200
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait,
              Limit: 80
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill,
              Limit: 35
            };
          })]
        },
        Quantity: 160
      }],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 68,
        Notes: ['Continued on page 69', 'Changed MedTech skill to have no Subskill to General']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Spacer Family',
      Cost: 490,
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.TDS,
          Op: '<=',
          Level: 0
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Dexterity,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations,
          Op: '>=',
          Level: 2
        }]
      },
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Dexterity,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Equipped,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GTolerance,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Introvert,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: "Ship's Crew",
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Communications.Conventional,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Spacecraft,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '*',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation.Space,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Spacecraft,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SensorOperations,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Aeronautics,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Electronics,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations,
        Quantity: 15
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill,
              Limit: 35
            };
          })]
        },
        Quantity: 100
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att,
              Limit: 200
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait,
              Limit: 200
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill,
              Limit: 35
            };
          })]
        },
        Quantity: 75
      }],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 69
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: 'Street',
      Cost: 400,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CombatSense,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: -20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acting,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Climbing,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Disguise,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.EscapeArtist,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interrogation,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.General,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Running,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Scrounge,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 40
      }, flexiXPStage2(60)],
      Duration: 6,
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 69,
        Notes: ['Changed MedTech skill to have no Subskill to General']
      }
    }));
    this.Backgrounds[4].push(new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: "Agitator",
      Cost: 900,
      Duration: 4,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Bloodmark,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Gregarious,
        Quantity: 80
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: -150
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acting,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Disguise,
        Quantity: 75
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Driving).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving,
            Subskill: sub
          };
        }),
        Quantity: 65
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership,
        Quantity: 60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
        Quantity: 80
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 70
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Prestidigitation).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation,
            Subskill: sub
          };
        }),
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics.Infantry,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Training,
        Quantity: 50
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att,
              Limit: 50
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 125
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 74,
        Notes: ['Added subskill option for Prestidigitation because none was listed.']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: "Civilian Job",
      Cost: 600,
      Duration: 6,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Administration,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: '*',
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 40
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Driving).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving,
            Subskill: sub
          };
        }),
        Quantity: 60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: 50
      }, {
        Pick: {
          Count: 4,
          Options: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })
        },
        Quantity: 20
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 85
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 74,
        Notes: ['Career subskill is originally restricted to Non-Military.', 'Changed four skills from choosen field to any four skills.']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: "Combat Correspondent",
      Cost: 700,
      Prereq: {
        And: [{
          IsClanner: false
        }, {
          Field: 'Journalist'
        }, {
          Not: {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
            Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CombatParalysis,
            Op: '<=',
            Level: 0
          }
        }]
      },
      Duration: 4,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExtraIncome,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art,
        Subskill: 'Writing',
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
        Subskill: 'Journalist',
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Communications.Conventional,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Investigation,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '*',
        Quantity: 30
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation,
            Subskill: sub
          };
        }),
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival,
        Subskill: '*',
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Electronics,
        Quantity: 35
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 90
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 75,
        Notes: ['Continued on page 76.', 'Renamed Technician subskill from Electrical to Electronics.']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2788, {
      Name: "Covert Operations",
      Cost: 1000,
      Prereq: {
        And: [{
          IsClanner: false
        }, {
          Or: [...['Police Academy', 'Intelligence Operative Training', 'Military Academy', 'Military Enlistment', 'Family Training'].map(edu => {
            return {
              Stage: 3,
              Name: edu
            };
          }), {
            And: [{
              Stage: 4,
              Name: 'Tour of Duty'
            }, {
              Or: [{
                Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
                Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
                Op: '>=',
                Exp: 150
              }, {
                Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
                Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership,
                Op: '>=',
                Exp: 150
              }]
            }]
          }]
        }, {
          Not: {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
            Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CombatParalysis,
            Op: '<=',
            Level: 0
          }
        }]
      },
      Duration: 6,
      Experience: [{
        Pick: {
          Count: 2,
          Options: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).filter(att => [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower, _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge].includes(att)).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          })
        },
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.AlternativeID,
        Quantity: 85
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.InForLife,
        Quantity: -110
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.SixthSense,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acting,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival,
        Subskill: '*',
        Quantity: 50
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 150
      }, ...[{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Dexterity,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Citizenship,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.DarkSecret,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Fit,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Climbing,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Demolitions,
        Quantity: 60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.EscapeArtist,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interrogation,
        Quantity: 60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Investigation,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Science,
        Subskill: 'Chemistry',
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 50
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics).map(tech => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics,
            Subskill: tech
          };
        }),
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons,
        Quantity: 45
      }].map(exp => {
        return {
          ...exp,
          If: {
            Affiliation: 'Capellan Confideration'
          }
        };
      }), ...[{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Equipped,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: -75
      }, {
        Or: ['House Kurita', 'Draconis Combine'].map(whom => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
            Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion,
            Trigger: `Loyalty to ${whom}`
          };
        }),
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Acrobatics.Gymnastics,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Climbing,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Cryptography,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interrogation,
        Quantity: 60
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Investigation,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 55
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '!',
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 35
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics).map(tech => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics,
            Subskill: tech
          };
        }),
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Training,
        Quantity: 30
      }].map(exp => {
        return {
          ...exp,
          If: {
            Affiliation: 'Draconis Combine'
          }
        };
      })],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 76
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: "Explorer",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.TDS,
          Op: '<=',
          Level: 0
        }, {
          Or: [{
            And: [{
              IsInner: true
            }, {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
              Op: '>=',
              Exp: 150
            }]
          }]
        }, {
          IsPerifphery: true
        }]
      },
      Cost: 900,
      Duration: 6,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GTolerance,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GoodHearing,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.VehicleLevel,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Introvert,
        Quantity: -40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Appraisal,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Climbing,
        Quantity: 25
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Communications).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications,
            Subskill: sub
          };
        }),
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Investigation,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '*',
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.General,
        Quantity: 15
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation,
            Subskill: sub
          };
        }),
        Quantity: 50
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting,
            Subskill: sub
          };
        }),
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SensorOperations,
        Quantity: 55
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival,
        Subskill: '*',
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '*',
        Quantity: 35
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tracking).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking,
            Subskill: sub
          };
        }),
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations,
        Quantity: 15
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 170
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 77,
        Notes: ['Changed MedTech skill to have no Subskill to General', 'Changed Zero-G Training skill to Zero-G Operations']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: "Gurilla Insurgent",
      Prereq: {
        IsClanner: false
      },
      Cost: 900,
      Duration: 6,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Bloodmark,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CombatSense,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Equipped,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion,
        Trigger: 'Hatred for Authority',
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Dependent,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Unlucky,
        Quantity: -35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 45
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Demolitions,
        Quantity: 65
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Disguise,
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.EscapeArtist,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 25
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Prestidigitation).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation,
            Subskill: sub
          };
        }),
        Quantity: 50
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.SecuritySystem).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem,
            Subskill: sub
          };
        }),
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SupportWeapons,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival,
        Subskill: '*',
        Quantity: 35
      }, ...[{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.DarkSecret,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Toughness,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Climbing,
        Quantity: 40
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Driving).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving,
            Subskill: sub
          };
        }),
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interrogation,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Swimming,
        Quantity: 45
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics.Infantry,
        Quantity: 50
      }].map(exp => {
        return {
          ...exp,
          If: {
            Not: {
              Affiliation: 'Free Rasalhague'
            }
          }
        };
      }), {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 180
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 77,
        Notes: ['Continued on page 78.', 'Added subskill option for Prestidigitation because none was listed.', 'Added subskill option for Security Systems because none was listed.']
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: "Merchant",
      Prereq: {
        Or: [{
          Field: 'Merchant'
        }, {
          And: [{
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
            Op: '>=',
            Exp: 50
          }, {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Administration,
            Op: '>=',
            Exp: 50
          }]
        }]
      },
      Cost: 900,
      Duration: 4,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
        Quantity: -75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acting,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Appraisal,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '!',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '*',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '*',
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol,
        Subskill: '*',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations,
        Quantity: 10
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 200
      }],
      Options: [{
        Name: 'Free Trader',
        Experience: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
          Quantity: 50
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
          Quantity: 50
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExtraIncome,
          Quantity: 50
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Gregarious,
          Quantity: 25
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Administration,
          Quantity: 25
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Appraisal,
          Quantity: 15
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership,
          Quantity: 15
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
          Quantity: 15
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
          Quantity: 15
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
          Quantity: 20
        }, {
          Pick: {
            Count: 5,
            Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
              return {
                Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
                Skill: skill
              };
            })]
          },
          Quantity: 20
        }],
        Citation: {
          Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
          Page: 78,
          Notes: ['Due to system limitations the five skills are just any skill for now.']
        }
      }, {
        Name: 'Merchant Master',
        Experience: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
          Quantity: 50
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
          Quantity: -125
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExtraIncome,
          Quantity: 75
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
          Quantity: 75
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Administration,
          Quantity: 15
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career,
          Subskill: 'Merchant',
          Quantity: 20
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications,
          Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Communications.Conventional,
          Quantity: 10
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
          Subskill: 'Antiques',
          Quantity: 10
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
          Subskill: '*',
          Quantity: 25
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
          Subskill: '*',
          Quantity: 25
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
          Quantity: 15
        }, {
          Pick: {
            Count: 6,
            Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
              return {
                Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
                Skill: skill
              };
            })]
          },
          Quantity: 35
        }],
        Citation: {
          Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
          Page: 78,
          Notes: ['Due to system limitations the six skills are just any skill for now.']
        }
      }, {
        Name: 'Deep Periphery Trader',
        Experience: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body,
          Quantity: -50
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower,
          Quantity: 75
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections,
          Quantity: 20
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy,
          Quantity: -100
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
          Quantity: 75
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GTolerance,
          Quantity: 75
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Administration,
          Quantity: 20
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
          Subskill: '*',
          Quantity: 25
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership,
          Quantity: 20
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
          Quantity: 25
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons,
          Quantity: 30
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms,
          Quantity: 25
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations,
          Quantity: 15
        }, {
          Pick: {
            Count: 5,
            Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
              return {
                Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
                Skill: skill
              };
            })]
          },
          Quantity: 25
        }],
        Citation: {
          Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
          Page: 78,
          Notes: ['Due to system limitations the six skills are just any skill for now.']
        }
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 78
      }
    }), new _background__WEBPACK_IMPORTED_MODULE_1__.Background(2398, {
      Name: "Ne'er-Do-Well",
      Prereq: {
        IsClanner: false
      },
      Cost: 700,
      Duration: 4,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge,
        Quantity: 75
      }, {
        Pick: {
          Count: 1,
          Options: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).filter(att => [_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge].includes(att)).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          })
        },
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExtraIncome,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation,
        Quantity: -25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acting,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Appraisal,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art,
        Subskill: 'Cooking',
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Disguise,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.EscapeArtist,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 40
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest,
        Subskill: '*',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
        Subskill: '*',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation,
        Quantity: 35
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Prestidigitation).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation,
            Subskill: sub
          };
        }),
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Running,
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival,
        Subskill: '*',
        Quantity: 35
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Swimming,
        Quantity: 10
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 145,
        If: {
          Not: {
            Stage: 4,
            Name: "Ne'er-Do-Well"
          }
        }
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
        Page: 78,
        Notes: ['Added subskill option for Prestidigitation because none was listed.']
      }
    }));
  }
  At(when, stage) {
    return this.Backgrounds[stage].flatMap(aff => aff.At(when - 2398) ?? []);
  }
}
_class = BackgroundsService;
_class.ɵfac = function BackgroundsService_Factory(t) {
  return new (t || _class)();
};
_class.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: _class,
  factory: _class.ɵfac,
  providedIn: 'root'
});

/***/ }),

/***/ 7174:
/*!****************************************!*\
  !*** ./src/app/character/character.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Character: () => (/* binding */ Character),
/* harmony export */   Option: () => (/* binding */ Option)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 2513);

class Character {
  constructor(args) {
    this.Name = '';
    this.Experience = new rxjs__WEBPACK_IMPORTED_MODULE_0__.Subject();
  }
}
var Option;
(function (Option) {
  Option[Option["Create"] = 0] = "Create";
  Option[Option["Load"] = 1] = "Load";
})(Option || (Option = {}));

/***/ }),

/***/ 2631:
/*!**********************************************************!*\
  !*** ./src/app/chargen/character/character.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CharacterComponent: () => (/* binding */ CharacterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/utils/common */ 6555);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 5400);
/* harmony import */ var _stages_stage3_stage3_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stages/stage3/stage3.component */ 152);
/* harmony import */ var _stages_stage4_stage4_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../stages/stage4/stage4.component */ 11);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _stages_stage0_stage0_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../stages/stage0/stage0.component */ 5821);
/* harmony import */ var _stages_stage1_stage1_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../stages/stage1/stage1.component */ 5983);
/* harmony import */ var _stages_stage2_stage2_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../stages/stage2/stage2.component */ 4108);
/* harmony import */ var _vitals_vitals_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./vitals/vitals.component */ 4016);
/* harmony import */ var _utils_exp_pipe__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/exp.pipe */ 4908);
var _class;














const _c0 = ["stageZero"];
const _c1 = ["stageOne"];
const _c2 = ["stageTwo"];
const _c3 = ["itemizedExp"];
const _c4 = ["vitals"];
function CharacterComponent_ng_container_10_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](2, "exp");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const exp_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](2, 1, exp_r8), " ");
  }
}
function CharacterComponent_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, CharacterComponent_ng_container_10_span_1_Template, 3, 3, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx_r2.Experience);
  }
}
function CharacterComponent_span_12_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "input", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function CharacterComponent_span_12_ng_container_1_Template_input_click_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r13);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r12.addRealLife($event, 3));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](2, "input", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function CharacterComponent_span_12_ng_container_1_Template_input_click_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r13);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r14.addRealLife($event, 4));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", "Add Stage 3")("disabled", ctx_r9.RealLife.length === 0 ? false : !(ctx_r9.LatestStage3Or4 == null ? null : ctx_r9.LatestStage3Or4.isComplete));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", "Add Stage 4")("disabled", ctx_r9.RealLife.length === 0 ? false : !(ctx_r9.LatestStage3Or4 == null ? null : ctx_r9.LatestStage3Or4.isComplete));
  }
}
function CharacterComponent_span_12_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "input", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function CharacterComponent_span_12_ng_container_2_Template_input_click_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r16);
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r15.removeRealLife($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", "Remove Latest");
  }
}
function CharacterComponent_span_12_ng_container_3_div_1_app_stage3_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "app-stage3", 20, 21);
  }
  if (rf & 2) {
    const rl_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](3);
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("startingYear", rl_r18.year)("endingYear", _r0.startingYearChanged)("archtype", _r0.currentArchtype)("hidden", !ctx_r19.progress[2])("affiliation", rl_r18.aff)("language", ctx_r19.CurrentLanguage);
  }
}
function CharacterComponent_span_12_ng_container_3_div_1_app_stage4_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "app-stage4", 20, 22);
  }
  if (rf & 2) {
    const rl_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](3);
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("startingYear", rl_r18.year)("endingYear", _r0.startingYearChanged)("archtype", _r0.currentArchtype)("hidden", !ctx_r20.progress[2])("affiliation", rl_r18.aff)("language", ctx_r20.CurrentLanguage);
  }
}
function CharacterComponent_span_12_ng_container_3_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, CharacterComponent_span_12_ng_container_3_div_1_app_stage3_1_Template, 2, 6, "app-stage3", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, CharacterComponent_span_12_ng_container_3_div_1_app_stage4_2_Template, 2, 6, "app-stage4", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const rl_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", rl_r18.stage === 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", rl_r18.stage === 4);
  }
}
function CharacterComponent_span_12_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, CharacterComponent_span_12_ng_container_3_div_1_Template, 3, 2, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx_r11.RealLife);
  }
}
function CharacterComponent_span_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, CharacterComponent_span_12_ng_container_1_Template, 3, 4, "ng-container", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, CharacterComponent_span_12_ng_container_2_Template, 2, 1, "ng-container", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](3, CharacterComponent_span_12_ng_container_3_Template, 2, 1, "ng-container", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ((tmp_0_0 = ctx_r3.LatestStage3Or4) !== null && tmp_0_0 !== undefined ? tmp_0_0 : ctx_r3.stageTwo).affYear < _r0.startingYear);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r3.RealLife.length !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r3.RealLife.length > 0);
  }
}
function CharacterComponent_app_stage2_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "app-stage2", 23, 24);
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("startingYear", ctx_r4.stageOne.affYearChanged)("archtype", _r0.currentArchtype)("hidden", !ctx_r4.progress[1])("affiliation", ctx_r4.stageOne.currentAffiliation)("language", ctx_r4.stageOne.language);
  }
}
function CharacterComponent_app_stage1_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "app-stage1", 25, 26);
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](3);
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("startingYear", _r0.birthYearChanged)("archtype", _r0.currentArchtype)("hidden", !ctx_r5.progress[0])("startingAffiliation", _r6.currentAffiliation)("language", ctx_r5.CurrentLanguage);
  }
}
class CharacterComponent {
  get progress() {
    return {
      0: this.stageZero?.isComplete ?? false,
      1: this.stageOne?.isComplete ?? false,
      2: this.stageTwo?.isComplete ?? false,
      3: this.stageThree?.length ?? 0 !== 0 ? this.stageThree.reduce((sofar, stage) => sofar && stage.isComplete, true) : false,
      4: this.stageFour?.length ?? 0 !== 0 ? this.stageFour.reduce((sofar, stage) => sofar && stage.isComplete, true) : false
    };
  }
  get LatestStage3Or4() {
    if (this.RealLife.length === 0) return undefined;
    switch (this.RealLife[0].stage) {
      case 3:
        return this.stageThree.last;
      case 4:
        return this.stageFour.last;
      default:
        return undefined;
    }
  }
  get isComplete() {
    return false;
  }
  constructor(ref) {
    this.ref = ref;
    this.characterChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_8__.EventEmitter();
    this.archtypeChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_8__.EventEmitter();
    this.subscriptions = [];
    this.CurrentLanguage = new rxjs__WEBPACK_IMPORTED_MODULE_9__.ReplaySubject();
    this.stage3subs = [];
    this.stage4subs = [];
    this.characterExp = [];
    this.RealLife = [];
  }
  get TotalExp() {
    const ret = [...this.Experience].reduce((a, b) => a + b.Quantity, 0);
    return ret;
  }
  //This is a bit of a monster, maybe it needs to be refactored
  get Experience() {
    // Maybe take another look at this and see if leveraging the Extract utility type would make sense here instead of doing everything by hand.
    const OrExperience = [];
    const PickExperience = [];
    const SetExperience = [];
    const IfExperience = [];
    const AttributeExperience = {
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Dexterity]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge]: 0
    };
    const SkillExperience = {
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Acrobatics.FreeFall]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Acrobatics.Gymnastics]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acting]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Administration]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.AnimalHandling.Herding]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.AnimalHandling.Riding]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.AnimalHandling.Training]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Appraisal]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Archery]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art]: {},
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Artillery]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career]: {},
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Climbing]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Communications.BlackBox]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Communications.Conventional]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Communications.HyperpuseGenerator]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Cryptography]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Demolitions]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Disguise]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Driving.Ground]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Driving.Rail]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Driving.Sea]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.EscapeArtist]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Forgery]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Aerospace]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Air]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Battlesuit]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Ground]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Mech]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.ProtoMech]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Sea]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Spacecraft]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery.Turret]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest]: {},
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interrogation]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Investigation]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language]: {},
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.General]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.MedTech.Veterinary]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation.Air]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation.Ground]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation.KFJump]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation.Sea]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Navigation.Space]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Aerospace]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Aircraft]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Battlesuit]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Ground]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Mech]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.ProtoMech]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Railcraft]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Seacraft]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.Spacecraft]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Piloting.VTOL]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Prestidigitation.PickPocket]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Prestidigitation.Quickdraw]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Prestidigitation.SleightOfHand]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol]: {},
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Running]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Science]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.SecuritySystem.Electrical]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.SecuritySystem.Mechanical]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SensorOperations]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise]: {},
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SupportWeapons]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Surgery.General]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Surgery.Veterinary]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival]: {},
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Swimming]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics.Air]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics.Infantry]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics.Land]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics.Sea]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tactics.Space]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Aeronautics]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Cybernetics]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Electronics]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Jets]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Mechanical]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Myomer]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Nuclear]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Technician.Weapons]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.ThrownWeapons.Blades]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.ThrownWeapons.Blunt]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.ThrownWeapons.Spear]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tracking.Urban]: {
          Quantity: 0
        },
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Tracking.Wilds]: {
          Quantity: 0
        }
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Training]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations]: {
        Quantity: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Strategy]: {
        Quantity: 0,
        Speciality: undefined
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Scrounge]: {
        Quantity: 0,
        Speciality: undefined
      }
    };
    const TraitExperience = {
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.AlternativeID]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Ambidextrous]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.AnimalEmpathy]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Attractive]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Citizenship]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Trueborn]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CombatSense]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Connections]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Strength]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Body]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Dexterity]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Reflexes]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Intelligence]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Willpower]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Charisma]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute.Edge]: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.FastLearner]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Fit]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GTolerance]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GoodHearing]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GoodVision]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Gregarious]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Implant]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Prosthetic]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude]: {
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acting]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Administration]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Appraisal]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Archery]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Artillery]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Climbing]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Computers]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Cryptography]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Demolitions]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Disguise]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.EscapeArtist]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Forgery]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interrogation]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Investigation]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Leadership]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MartialArts]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MeleeWeapons]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Negotiation]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Running]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Science]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SensorOperations]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SmallArms]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Stealth]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SupportWeapons]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Swimming]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Training]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ZeroGOperations]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Strategy]: 0,
        [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Scrounge]: 0
      },
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.PainResistance]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Patient]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Phenotype]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.PoisonResistance]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Property]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Rank]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.SixthSense]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.TechEmpathy]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ThickSkinned]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Title]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Bloodname]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Toughness]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.AnimalAntipathy]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Bloodmark]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CombatParalysis]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion]: {},
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.DarkSecret]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Enemy]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.GlassJaw]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Gremlins]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Handicap]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Illiterate]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Impatient]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.InForLife]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Introvert]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.LostLimb]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.PoorHearing]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.PoorVision]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.SlowLearner]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ThinSkinned]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.TDS]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Unattractive]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Unlucky]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Equipped]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExtraIncome]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Reputation]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Wealth]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.CustomVehicle]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.DesignQuirk]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.VehicleLevel]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Mutation]: 0,
      [src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Dependent]: 0
    };
    const processExp = exp => {
      if ('Or' in exp) {
        OrExperience.push(exp);
      } else if ('Pick' in exp) {
        PickExperience.push(exp);
      } else if ('Set' in exp) {
        SetExperience.push(exp);
      } else if ('If' in exp) {
        IfExperience.push(exp);
      } else {
        switch (exp.Kind) {
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute:
            AttributeExperience[exp.Attribute] += exp.Quantity;
            return;
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
            switch (exp.Skill) {
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics:
                const acrobatics = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][acrobatics].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling:
                const handleanimal = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][handleanimal].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications:
                const communications = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][communications].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving:
                const driving = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][driving].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery:
                const gunnery = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][gunnery].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech:
                const medtech = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][medtech].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation:
                const navigation = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][navigation].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting:
                const piloting = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][piloting].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation:
                const prestidigitation = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][prestidigitation].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem:
                const securitysystem = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][securitysystem].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery:
                const surgery = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][surgery].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics:
                const tactics = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][tactics].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician:
                const technician = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][technician].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons:
                const thrownweapons = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][thrownweapons].Quantity += exp.Quantity;
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking:
                const tracking = exp.Subskill;
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill][tracking].Quantity += exp.Quantity;
                }
                return;
              // Language, Career, Protocol, Streetwise, Survival, Art, Interest all need to fall through here.
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career:
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival:
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art:
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest:
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  if (exp.Subskill instanceof RegExp) throw new Error('A subskill pattern cannot be used here!');
                  if (exp.Subskill in SkillExperience[exp.Skill]) {
                    SkillExperience[exp.Skill][exp.Subskill].Quantity += exp.Quantity;
                  } else {
                    SkillExperience[exp.Skill][exp.Subskill] = {
                      Quantity: exp.Quantity
                    };
                  }
                }
                return;
              default:
                if (exp.Speciality) {
                  throw new Error('Not Implemented!');
                } else {
                  SkillExperience[exp.Skill].Quantity += exp.Quantity;
                }
                return;
            }
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait:
            switch (exp.Trait) {
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion:
                if (!('Trigger' in exp)) throw new Error('Compulsion must have a trigger!');
                if (exp.Trigger in TraitExperience[exp.Trait]) {
                  TraitExperience[exp.Trait][exp.Trigger] += exp.Quantity;
                } else {
                  TraitExperience[exp.Trait] = {
                    [exp.Trigger]: exp.Quantity,
                    ...TraitExperience[exp.Trait]
                  };
                }
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute:
                if (!('Attribute' in exp)) throw new Error('Exceptional Attribute must have an attribute assigned!');
                const attribute = exp.Attribute;
                TraitExperience[exp.Trait][attribute] += exp.Quantity;
                return;
              case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude:
                if (!('Skill' in exp)) throw new Error('Natural aptitude must have a skill assigned!');
                const skill = exp.Skill;
                TraitExperience[exp.Trait][skill] += exp.Quantity;
                return;
              default:
                TraitExperience[exp.Trait] += exp.Quantity;
                return;
            }
        }
      }
    };
    [...(this.stageZero?.experience ?? []), ...(this.stageOne?.experience ?? []), ...(this.stageTwo?.experience ?? []), ...(this.stageThree ?? []).map(component => component.experience).flatMap(exp => exp), ...(this.stageFour ?? []).map(component => component.experience).flatMap(exp => exp), ...this.affiliationExperience].forEach(processExp);
    const atts = (0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
      return {
        Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: att,
        Quantity: AttributeExperience[att]
      };
    });
    const skills = (0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).flatMap(skill => {
      switch (skill) {
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art:
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest:
          const subskill = SkillExperience[skill];
          return Object.keys(subskill).map(sub => {
            return {
              Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
              Skill: skill,
              Subskill: sub,
              Quantity: subskill[sub].Quantity
            };
          });
        default:
          return [{
            Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
            Skill: skill,
            Quantity: SkillExperience[skill].Quantity
          }];
      }
    });
    const traits = (0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).flatMap(trait => {
      switch (trait) {
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion:
          const triggers = TraitExperience[trait];
          return Object.keys(triggers).map(trigger => {
            return {
              Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait,
              Trigger: trigger,
              Quantity: triggers[trigger]
            };
          });
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute:
          const attributes = TraitExperience[trait];
          return Object.keys(attributes).map(att => {
            return {
              Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait,
              Attribute: att,
              Quantity: attributes[+att]
            };
          });
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude:
          const skills = TraitExperience[trait];
          return Object.keys(skills).map(skill => {
            return {
              Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
              Trait: trait,
              Skill: skill,
              Quantity: skills[+skill]
            };
          });
        default:
          return [{
            Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
            Trait: trait,
            Quantity: TraitExperience[trait]
          }];
      }
    });
    //Should this also include Set and If exp?
    return [...atts, ...skills, ...traits].map(exp => exp).filter(exp => 'Or' in exp || 'Pick' in exp ? false : exp.Quantity !== 0);
  }
  get affiliationExperience() {
    const affNames = {
      0: this.stageZero?.currentAffiliation?.Name,
      1: this.stageOne?.currentAffiliation.Name,
      2: this.stageTwo?.currentAffiliation.Name,
      3: undefined,
      4: undefined
    };
    //I sorta hate this but i just need something to work correctly for now
    if (affNames[2]) {
      if (affNames[2] !== affNames[1]) {
        return [...this.stageOne.affiliationExperience, ...this.stageTwo.affiliationExperience].map(exp => {
          return {
            ...exp,
            Quantity: Math.floor(exp.Quantity / 2)
          };
        });
      } else {
        return this.stageOne.affiliationExperience;
      }
    } else {
      if (affNames[1]) {
        if (affNames[1] !== affNames[0]) {
          return [...this.stageZero.affiliationExperience, ...this.stageOne.affiliationExperience].map(exp => {
            return {
              ...exp,
              Quantity: Math.floor(exp.Quantity / 2)
            };
          });
        } else {
          return this.stageZero.affiliationExperience;
        }
      } else {
        if (affNames[0]) {
          return this.stageZero.affiliationExperience;
        } else {
          return [];
        }
      }
    }
  }
  get Requirments() {
    const orReqs = [];
    const andReqs = [];
    const notReqs = [];
    const attributeRequirments = {};
    let skillRequirments = {};
    const traitRequirments = [];
    const processAttReq = (att, value) => {
      const current = attributeRequirments[att];
      if (!current) {
        attributeRequirments[att] = value;
        return;
      }
      if ('lower' in value) {
        if ('lower' in current) {
          attributeRequirments[att] = {
            ...current,
            'lower': Math.max(current.lower, value.lower)
          };
        } else {
          attributeRequirments[att] = {
            ...current,
            ...value
          };
        }
      } else {
        if ('upper' in current) {
          attributeRequirments[att] = {
            ...current,
            'upper': Math.min(current.upper, value.upper)
          };
        } else {
          attributeRequirments[att] = {
            ...current,
            ...value
          };
        }
      }
    };
    const processSkillReq = (skill, value, subskill) => {
      let current = skillRequirments[skill];
      if (current) {
        switch (skill) {
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest:
            if (subskill) {
              if (subskill in current) {
                current = current[subskill];
                if (!current) {
                  skillRequirments = {
                    ...skillRequirments,
                    [skill]: value
                  };
                  return;
                } else {
                  if ('lower' in value) {
                    if ('lower' in current && typeof current['lower'] === 'number') {
                      skillRequirments[skill] = {
                        ...current,
                        'lower': Math.max(current['lower'], value.lower)
                      };
                    } else {
                      skillRequirments[skill] = {
                        ...current,
                        ...value
                      };
                    }
                  } else {
                    if ('upper' in current && typeof current['upper'] === 'number') {
                      skillRequirments[skill] = {
                        ...current,
                        'upper': Math.min(current['upper'], value.upper)
                      };
                    } else {
                      skillRequirments[skill] = {
                        ...current,
                        ...value
                      };
                    }
                  }
                }
              } else {
                skillRequirments = {
                  ...skillRequirments,
                  [skill]: {
                    ...skillRequirments[skill],
                    [subskill]: value
                  }
                };
              }
            } else {
              throw new Error('This should not happen!');
            }
            return;
          default:
            if (!current) {
              skillRequirments = {
                ...skillRequirments,
                [skill]: value
              };
              return;
            }
            if ('lower' in value) {
              if ('lower' in current && typeof current.lower === 'number') {
                skillRequirments[skill] = {
                  ...current,
                  'lower': Math.max(current.lower, value.lower)
                };
              } else {
                skillRequirments[skill] = {
                  ...current,
                  ...value
                };
              }
            } else {
              if ('upper' in current && typeof current.upper === 'number') {
                skillRequirments[skill] = {
                  ...current,
                  'upper': Math.min(current.upper, value.upper)
                };
              } else {
                skillRequirments[skill] = {
                  ...current,
                  ...value
                };
              }
            }
            return;
        }
      } else {
        if (subskill) {
          skillRequirments = {
            ...skillRequirments,
            [skill]: {
              [subskill]: value
            }
          };
        } else {
          skillRequirments = {
            ...skillRequirments,
            [skill]: value
          };
        }
      }
    };
    const processReq = req => {
      if ('Not' in req) notReqs.push(req);
      if ('And' in req) andReqs.push(req);
      if ('Or' in req) orReqs.push(req);
      if (!('Kind' in req)) throw new Error('Kind may not be missing from a requirment!');
      if (!('Level' in req)) return; //This isnt an error its just not implemented yet
      switch (req.Kind) {
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute:
          switch (req.Op) {
            case '>':
              processAttReq(req.Attribute, {
                lower: req.Level + 1
              });
              return;
            case '>=':
              processAttReq(req.Attribute, {
                lower: req.Level
              });
              return;
            case '<':
              processAttReq(req.Attribute, {
                upper: req.Level - 1
              });
              return;
            case '<=':
              processAttReq(req.Attribute, {
                upper: req.Level
              });
              return;
            default:
              //does the = op even really mave much sense?  maybe it should be removed?
              return;
          }
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
          const subskill = 'Subskill' in req ? req.Subskill instanceof RegExp ? req.Subskill.source : req.Subskill : undefined;
          switch (req.Op) {
            case '>':
              processSkillReq(req.Skill, {
                lower: req.Level + 1
              }, subskill);
              return;
            case '>=':
              processSkillReq(req.Skill, {
                lower: req.Level
              }, subskill);
              return;
            case '<':
              processSkillReq(req.Skill, {
                upper: req.Level - 1
              }, subskill);
              return;
            case '<=':
              processSkillReq(req.Skill, {
                upper: req.Level
              }, subskill);
              return;
            default:
              //does the = op even really mave much sense?  maybe it should be removed?
              return;
          }
        default:
          throw new Error('How did this even happen?');
      }
    };
    [...(this.stageZero ? this.stageZero.requirments : []), ...(this.stageOne ? this.stageOne.requirments : []), ...(this.stageTwo ? this.stageTwo.requirments : []), ...this.stageThree?.map(component => component.Requirments).flatMap(req => req), ...this.stageFour?.map(component => component.Requirments).flatMap(req => req)].forEach(processReq);
    //return [...attributeRequirments, ...skillRequirments, ...traitRequirments];
    return [];
  }
  ngAfterViewInit() {
    let alreadySubbed = {
      1: false,
      2: false,
      3: false,
      4: false
    };
    this.subscriptions.push(this.stageThree.changes.subscribe(changes => {
      this.stage3subs.forEach(sub => sub.unsubscribe());
      this.stage3subs.length = 0;
      changes.forEach(change => {
        this.stage3subs.push(change.changed.subscribe(() => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }), change.complete.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }), change.affiliationChanged.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }), change.backgroundChanged.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }));
      });
    }), this.stageFour.changes.subscribe(changes => {
      this.stage4subs.forEach(sub => sub.unsubscribe());
      this.stage4subs.length = 0;
      changes.forEach(change => {
        this.stage4subs.push(change.changed.subscribe(() => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }), change.complete.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }), change.affiliationChanged.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }), change.backgroundChanged.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }));
      });
    }), this.stageZero.complete.subscribe(_ => {
      this.ref.detectChanges();
      this.ref.markForCheck();
      if (!alreadySubbed[1]) {
        this.subscriptions.push(this.stageOne.complete.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
          if (!alreadySubbed[2]) {
            this.subscriptions.push(this.stageTwo.complete.subscribe(_ => {
              this.ref.detectChanges();
              this.ref.markForCheck();
            }), this.stageTwo.changed.subscribe(() => {
              this.ref.detectChanges();
              this.ref.markForCheck();
            }), this.stageTwo.affiliationChanged.subscribe(_ => {
              this.ref.detectChanges();
              this.ref.markForCheck();
            }));
            alreadySubbed[2] = true;
          }
        }), this.stageOne.changed.subscribe(() => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }), this.stageOne.affiliationChanged.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }), this.stageOne.backgroundChanged.subscribe(_ => {
          this.ref.detectChanges();
          this.ref.markForCheck();
        }));
        alreadySubbed[1] = true;
      }
    }), this.stageZero.changed.subscribe(() => {
      this.ref.detectChanges();
      this.ref.markForCheck();
    }), this.stageZero.languageChanged.subscribe(lang => {
      this.CurrentLanguage.next(lang);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  ngOnDestroy() {
    [...this.subscriptions, ...this.stage3subs, ...this.stage4subs].forEach(sub => sub.unsubscribe());
  }
  ngOnInit() {
    this.subscriptions.push(this.character.Experience.subscribe({
      next: value => this.characterExp.push(value)
    }));
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  showHideItemizedExp(_) {
    this.itemizedExp.nativeElement.value = this.itemizedExp.nativeElement.value === 'on' ? 'off' : 'on';
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  addRealLife(e, stage) {
    this.RealLife.unshift({
      stage: stage,
      index: this.RealLife.length + 0,
      year: (this.LatestStage3Or4 ?? this.stageTwo).affYearChanged,
      aff: {
        ...(this.LatestStage3Or4 ?? this.stageTwo).currentAffiliation
      }
    });
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  removeRealLife(e) {
    this.RealLife.shift();
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
}
_class = CharacterComponent;
_class.ɵfac = function CharacterComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_8__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-character"]],
  viewQuery: function CharacterComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c1, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c2, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c3, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c4, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_stages_stage3_stage3_component__WEBPACK_IMPORTED_MODULE_1__.Stage3Component, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_stages_stage4_stage4_component__WEBPACK_IMPORTED_MODULE_2__.Stage4Component, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.stageZero = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.stageOne = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.stageTwo = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.itemizedExp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.vitals = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.stageThree = _t);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.stageFour = _t);
    }
  },
  inputs: {
    character: "character"
  },
  outputs: {
    characterChanged: "characterChanged",
    archtypeChanged: "archtypeChanged"
  },
  decls: 17,
  vars: 8,
  consts: [[1, "row"], [1, "leftside", "column"], [3, "character"], ["vitals", ""], ["for", "showExp"], ["type", "checkbox", "id", "showExp", "name", "showExp", "checked", "", 3, "change"], ["itemizedExp", ""], [4, "ngIf"], [1, "main", "column"], [3, "startingYear", "archtype", "hidden", "affiliation", "language", 4, "ngIf"], [3, "startingYear", "archtype", "hidden", "startingAffiliation", "language", 4, "ngIf"], [3, "startingYear", "archtype"], ["stageZero", ""], ["class", "wrapper itemized", 4, "ngFor", "ngForOf"], [1, "wrapper", "itemized"], ["type", "button", "title", "AddStage3", 3, "value", "disabled", "click"], ["type", "button", "title", "AddStage4", 3, "value", "disabled", "click"], ["type", "button", "title", "Remove", 3, "value", "click"], [4, "ngFor", "ngForOf"], [3, "startingYear", "endingYear", "archtype", "hidden", "affiliation", "language", 4, "ngIf"], [3, "startingYear", "endingYear", "archtype", "hidden", "affiliation", "language"], ["stageThree", ""], ["stageFour", ""], [3, "startingYear", "archtype", "hidden", "affiliation", "language"], ["stageTwo", ""], [3, "startingYear", "archtype", "hidden", "startingAffiliation", "language"], ["stageOne", ""]],
  template: function CharacterComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](2, "app-vitals", 2, 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "h4");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](6, "label", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](7, "show exp?");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](8, "input", 5, 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("change", function CharacterComponent_Template_input_change_8_listener($event) {
        return ctx.showHideItemizedExp($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](10, CharacterComponent_ng_container_10_Template, 2, 1, "ng-container", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](11, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](12, CharacterComponent_span_12_Template, 4, 3, "span", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](13, CharacterComponent_app_stage2_13_Template, 2, 5, "app-stage2", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](14, CharacterComponent_app_stage1_14_Template, 2, 5, "app-stage1", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](15, "app-stage0", 11, 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](3);
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](9);
      const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](16);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("character", ctx.character);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"]("Total Exp ", ctx.TotalExp, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _r1.value === "on");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.progress[2]);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _r6.currentAffiliation && ctx.stageOne);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _r6.currentAffiliation);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("startingYear", _r0.yearOfBirth)("archtype", _r0.currentArchtype);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _stages_stage0_stage0_component__WEBPACK_IMPORTED_MODULE_3__.Stage0Component, _stages_stage1_stage1_component__WEBPACK_IMPORTED_MODULE_4__.Stage1Component, _stages_stage2_stage2_component__WEBPACK_IMPORTED_MODULE_5__.Stage2Component, _stages_stage3_stage3_component__WEBPACK_IMPORTED_MODULE_1__.Stage3Component, _stages_stage4_stage4_component__WEBPACK_IMPORTED_MODULE_2__.Stage4Component, _vitals_vitals_component__WEBPACK_IMPORTED_MODULE_6__.VitalsComponent, _utils_exp_pipe__WEBPACK_IMPORTED_MODULE_7__.ExpPipe],
  styles: [".wrapper[_ngcontent-%COMP%] {\n  display: inline-block;\n  white-space: nowrap;\n  width: 100%;\n}\n.wrapper.itemized[_ngcontent-%COMP%] {\n  padding-left: 5px;\n  word-wrap: break-word;\n  white-space: pre-line !important;\n  text-indent: -5px;\n  text-align: left;\n}\n.wrapper[_ngcontent-%COMP%]:has(select)   select[_ngcontent-%COMP%] {\n  margin: 6.4px;\n  padding: 1px, 2px;\n  min-height: 21px;\n  max-width: 90%;\n  text-align: left;\n  justify-self: left;\n}\n.wrapper[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin: auto, auto;\n  float: right;\n  text-align: right;\n}\n.wrapper[_ngcontent-%COMP%]   select.num[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]   input.num[_ngcontent-%COMP%] {\n  max-height: 1.5rem;\n  width: 4rem;\n  min-width: 3rem;\n  max-width: 5rem;\n}\n.wrapper[_ngcontent-%COMP%]   select#name[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]   input#name[_ngcontent-%COMP%] {\n  text-align: right;\n  max-width: 90%;\n  box-sizing: content-box;\n}\n\n.leftside[_ngcontent-%COMP%] {\n  float: left;\n  width: 15vw;\n  margin: 0.5rem;\n  padding: 10px;\n  background-color: lightgray;\n}\n@media screen and (max-width: 1184px) {\n  .leftside[_ngcontent-%COMP%] {\n    width: calc(100% - 20px - 1rem) !important;\n  }\n}\n\n.main[_ngcontent-%COMP%] {\n  left: 15vm;\n  display: inline-block;\n}\n\n.opt[_ngcontent-%COMP%] {\n  text-align-last: right;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY2hhcmdlbi9jaGFyYWN0ZXIvY2hhcmFjdGVyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0kscUJBQUE7RUFDQSxtQkFBQTtFQUNBLFdBQUE7QUFBSjtBQUVJO0VBQ0ksaUJBQUE7RUFDQSxxQkFBQTtFQUNBLGdDQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtBQUFSO0FBSVE7RUFDSSxhQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FBRlo7QUFNSTs7RUFFSSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtBQUpSO0FBTVE7O0VBQ0ksa0JBQUE7RUFDQSxXQUFBO0VBQ0EsZUFBQTtFQUNBLGVBQUE7QUFIWjtBQU1ROztFQUNJLGlCQUFBO0VBQ0EsY0FBQTtFQUNBLHVCQUFBO0FBSFo7O0FBUUE7RUFJSSxXQUFBO0VBQ0EsV0FBQTtFQUNBLGNBQUE7RUFDQSxhQUFBO0VBQ0EsMkJBQUE7QUFSSjtBQUNJO0VBREo7SUFFUSwwQ0FBQTtFQUVOO0FBQ0Y7O0FBTUE7RUFDSSxVQUFBO0VBQ0EscUJBQUE7QUFISjs7QUFNQTtFQUNJLHNCQUFBO0FBSEoiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLndyYXBwZXIge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuICAgICYuaXRlbWl6ZWR7XHJcbiAgICAgICAgcGFkZGluZy1sZWZ0OiA1cHg7XHJcbiAgICAgICAgd29yZC13cmFwOiBicmVhay13b3JkO1xyXG4gICAgICAgIHdoaXRlLXNwYWNlOnByZS1saW5lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgdGV4dC1pbmRlbnQ6IC01cHg7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIH1cclxuXHJcbiAgICAmOmhhcyhzZWxlY3QpIHtcclxuICAgICAgICBzZWxlY3Qge1xyXG4gICAgICAgICAgICBtYXJnaW46IDYuNHB4O1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxcHgsIDJweDtcclxuICAgICAgICAgICAgbWluLWhlaWdodDogMjFweDtcclxuICAgICAgICAgICAgbWF4LXdpZHRoOiA5MCU7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgICAgICAgIGp1c3RpZnktc2VsZjogbGVmdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0LFxyXG4gICAgaW5wdXQge1xyXG4gICAgICAgIG1hcmdpbjogYXV0bywgYXV0bztcclxuICAgICAgICBmbG9hdDogcmlnaHQ7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7IFxyXG5cclxuICAgICAgICAmLm51bSB7XHJcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDEuNXJlbTtcclxuICAgICAgICAgICAgd2lkdGg6IDRyZW07XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogM3JlbTtcclxuICAgICAgICAgICAgbWF4LXdpZHRoOiA1cmVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAmI25hbWUge1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcclxuICAgICAgICAgICAgbWF4LXdpZHRoOjkwJTtcclxuICAgICAgICAgICAgYm94LXNpemluZzogY29udGVudC1ib3g7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4ubGVmdHNpZGUge1xyXG4gICAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogMTE4NHB4KSB7XHJcbiAgICAgICAgd2lkdGg6IGNhbGMoMTAwJSAtIDIwcHggLSAxcmVtKSAhaW1wb3J0YW50O1xyXG4gICAgfVxyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICB3aWR0aDogMTV2dztcclxuICAgIG1hcmdpbjogMC41cmVtO1xyXG4gICAgcGFkZGluZzogMTBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JheTtcclxufVxyXG5cclxuLm1haW4ge1xyXG4gICAgbGVmdDogMTV2bTtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufVxyXG5cclxuLm9wdCB7XHJcbiAgICB0ZXh0LWFsaWduLWxhc3Q6cmlnaHQ7XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 4016:
/*!**************************************************************!*\
  !*** ./src/app/chargen/character/vitals/vitals.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VitalsComponent: () => (/* binding */ VitalsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 5400);
/* harmony import */ var src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/utils/common */ 6555);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _utils_archtype_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/archtype.pipe */ 5782);
var _class;







const _c0 = ["startYear"];
const _c1 = ["startAge"];
const _c2 = ["birthYear"];
const _c3 = ["archtype"];
function VitalsComponent_option_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "option", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "archtype");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const archtype_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, archtype_r6));
  }
}
class VitalsComponent {
  get startingYear() {
    return Math.max(this._startingYear, 2398 + 16);
  }
  set startingYear(value) {
    if (value < 0) return;
    if (this._startingYear > value) {
      this.startingAge -= this.startingYear - value;
    } else {
      this.startingAge += value - this.startingYear;
    }
    this._startingYear = value;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  get startingAge() {
    return Math.max(16, this._startingAge);
  }
  set startingAge(value) {
    this._startingAge = Math.max(value, 16);
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  get archtypes() {
    const vals = (0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Archtype);
    return vals;
  }
  get yearOfBirth() {
    return this.startingYear - this.startingAge;
  }
  set yearOfBirth(value) {
    this.startingAge = this.startingYear - Math.max(value, 2398);
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  get maxBirthYear() {
    return this.startingYear - 16;
  }
  get currentArchtype() {
    return this._currentArchtype;
  }
  set currentArchtype(val) {
    this._currentArchtype = val;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  constructor(ref) {
    this.ref = ref;
    this.archtypeChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.characterChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.startingYearChanged = new rxjs__WEBPACK_IMPORTED_MODULE_3__.ReplaySubject();
    this.birthYearChanged = new rxjs__WEBPACK_IMPORTED_MODULE_3__.ReplaySubject();
    this._startingYear = 3076;
    this._startingAge = 21;
    this.targetExperience = 5000;
    this.characterName = '';
    this._currentArchtype = undefined;
  }
  ngOnInit() {
    this.startingYearChanged.next(this.startingYear);
    this.birthYearChanged.next(this.yearOfBirth);
  }
  nameChanged(e) {
    this.ref.detectChanges();
    this.ref.markForCheck();
    this.characterChanged.emit(this.character);
  }
  ageChanged(e) {
    this.startingAge = this.startAge.nativeElement.valueAsNumber;
    this.startAge.nativeElement.valueAsNumber = this.startingAge;
    this.ref.detectChanges();
    this.ref.markForCheck();
    this.characterChanged.emit(this.character);
    if (!isNaN(this.yearOfBirth)) this.birthYearChanged.next(this.yearOfBirth);
  }
  startYearChanged(e) {
    this.startingYear = this.startYear.nativeElement.valueAsNumber;
    this.startYear.nativeElement.valueAsNumber = this.startingYear;
    this.ref.detectChanges();
    this.ref.markForCheck();
    this.characterChanged.emit(this.character);
    if (!isNaN(this.startingYear)) this.startingYearChanged.next(this.startingYear);
  }
  yearOfBirthChanged(e) {
    this.yearOfBirth = this.birthYear.nativeElement.valueAsNumber;
    this.birthYear.nativeElement.valueAsNumber = this.yearOfBirth;
    this.ref.detectChanges();
    this.ref.markForCheck();
    this.characterChanged.emit(this.character);
    if (!isNaN(this.yearOfBirth)) this.birthYearChanged.next(this.yearOfBirth);
  }
  currentArchtypeChanged(e) {
    this.ref.detectChanges();
    this.ref.markForCheck();
    const val = src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Archtype[this.archtype.nativeElement.selectedIndex - 1];
    this.currentArchtype = src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Archtype[val];
    this.characterChanged.emit(this.character);
  }
}
_class = VitalsComponent;
_class.ɵfac = function VitalsComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-vitals"]],
  viewQuery: function VitalsComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c1, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c2, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c3, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.startYear = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.startAge = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.birthYear = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.archtype = _t.first);
    }
  },
  inputs: {
    character: "character"
  },
  outputs: {
    archtypeChanged: "archtypeChanged",
    characterChanged: "characterChanged",
    startingYearChanged: "startingYearChanged",
    birthYearChanged: "birthYearChanged"
  },
  decls: 33,
  vars: 12,
  consts: [[1, "wrapper"], ["for", "name"], ["id", "name", "type", "text", 3, "value", "change"], ["for", "startingYear"], ["id", "startingYear", "type", "number", "placeholder", "3076", 1, "num", 3, "min", "max", "valueAsNumber", "change"], ["startYear", ""], ["for", "startingAge"], ["id", "startingAge", "type", "number", "placeholder", "21", 1, "num", 3, "min", "valueAsNumber", "change"], ["startAge", ""], ["for", "targetExperience"], ["id", "targetExperience", "type", "number", "placeholder", "5000", 1, "num", 3, "min", "valueAsNumber"], ["for", "birthYear"], ["id", "birthYear", "type", "number", 1, "num", 3, "max", "min", "valueAsNumber", "change"], ["birthYear", "", "birth", ""], ["for", "archtype"], ["name", "archtype", "id", "archtype", 3, "change"], ["archtype", ""], ["hidden", "", "disabled", "", "selected", "", "value", ""], ["class", "opt", 4, "ngFor", "ngForOf"], [1, "opt"]],
  template: function VitalsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form")(1, "span", 0)(2, "label", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Name");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "input", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function VitalsComponent_Template_input_change_4_listener($event) {
        return ctx.nameChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 0)(6, "label", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Starting Year");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "input", 4, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function VitalsComponent_Template_input_change_8_listener($event) {
        return ctx.startYearChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "span", 0)(11, "label", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Starting Age");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "input", 7, 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function VitalsComponent_Template_input_change_13_listener($event) {
        return ctx.ageChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "span", 0)(16, "label", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "Target Experience");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](18, "input", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "span", 0)(20, "label", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, "Birth Year");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "input", 12, 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function VitalsComponent_Template_input_change_22_listener($event) {
        return ctx.yearOfBirthChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "span", 0)(26, "label", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](27, "Archtype");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "select", 15, 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function VitalsComponent_Template_select_change_28_listener($event) {
        return ctx.currentArchtypeChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "option", 17);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](31, " -- select an option -- ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](32, VitalsComponent_option_32_Template, 3, 3, "option", 18);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.characterName);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("min", 2398)("max", 3175)("valueAsNumber", ctx.startingYear);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("min", 16)("valueAsNumber", ctx.startingAge);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("min", 3000)("valueAsNumber", ctx.targetExperience);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("max", ctx.maxBirthYear)("min", 2382)("valueAsNumber", ctx.yearOfBirth);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.archtypes);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgForm, _utils_archtype_pipe__WEBPACK_IMPORTED_MODULE_1__.ArchtypePipe],
  styles: [".wrapper[_ngcontent-%COMP%] {\n  display: inline-block;\n  white-space: nowrap;\n  width: 100%;\n}\n.wrapper.itemized[_ngcontent-%COMP%] {\n  padding-left: 5px;\n  word-wrap: break-word;\n  white-space: pre-line !important;\n  text-indent: -5px;\n  text-align: left;\n}\n.wrapper[_ngcontent-%COMP%]:has(select)   select[_ngcontent-%COMP%] {\n  margin: 6.4px;\n  padding: 1px, 2px;\n  min-height: 21px;\n  max-width: 90%;\n  text-align: left;\n  justify-self: left;\n}\n.wrapper[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin: auto, auto;\n  float: right;\n  text-align: right;\n}\n.wrapper[_ngcontent-%COMP%]   select.num[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]   input.num[_ngcontent-%COMP%] {\n  max-height: 1.5rem;\n  width: 4rem;\n  min-width: 3rem;\n  max-width: 5rem;\n}\n.wrapper[_ngcontent-%COMP%]   select#name[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]   input#name[_ngcontent-%COMP%] {\n  text-align: right;\n  max-width: 90%;\n  box-sizing: content-box;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY2hhcmdlbi9jaGFyYWN0ZXIvdml0YWxzL3ZpdGFscy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLHFCQUFBO0VBQ0EsbUJBQUE7RUFDQSxXQUFBO0FBQ0o7QUFDSTtFQUNJLGlCQUFBO0VBQ0EscUJBQUE7RUFDQSxnQ0FBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUFDUjtBQUdRO0VBQ0ksYUFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtBQURaO0FBS0k7O0VBRUksa0JBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7QUFIUjtBQUtROztFQUNJLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7RUFDQSxlQUFBO0FBRlo7QUFLUTs7RUFDSSxpQkFBQTtFQUNBLGNBQUE7RUFDQSx1QkFBQTtBQUZaIiwic291cmNlc0NvbnRlbnQiOlsiLndyYXBwZXIge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuICAgICYuaXRlbWl6ZWR7XHJcbiAgICAgICAgcGFkZGluZy1sZWZ0OiA1cHg7XHJcbiAgICAgICAgd29yZC13cmFwOiBicmVhay13b3JkO1xyXG4gICAgICAgIHdoaXRlLXNwYWNlOnByZS1saW5lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgdGV4dC1pbmRlbnQ6IC01cHg7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIH1cclxuXHJcbiAgICAmOmhhcyhzZWxlY3QpIHtcclxuICAgICAgICBzZWxlY3Qge1xyXG4gICAgICAgICAgICBtYXJnaW46IDYuNHB4O1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxcHgsIDJweDtcclxuICAgICAgICAgICAgbWluLWhlaWdodDogMjFweDtcclxuICAgICAgICAgICAgbWF4LXdpZHRoOiA5MCU7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgICAgICAgIGp1c3RpZnktc2VsZjogbGVmdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0LFxyXG4gICAgaW5wdXQge1xyXG4gICAgICAgIG1hcmdpbjogYXV0bywgYXV0bztcclxuICAgICAgICBmbG9hdDogcmlnaHQ7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7IFxyXG5cclxuICAgICAgICAmLm51bSB7XHJcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDEuNXJlbTtcclxuICAgICAgICAgICAgd2lkdGg6IDRyZW07XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogM3JlbTtcclxuICAgICAgICAgICAgbWF4LXdpZHRoOiA1cmVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAmI25hbWUge1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcclxuICAgICAgICAgICAgbWF4LXdpZHRoOjkwJTtcclxuICAgICAgICAgICAgYm94LXNpemluZzogY29udGVudC1ib3g7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 9981:
/*!************************************************************!*\
  !*** ./src/app/chargen/stages/newaff/aff/aff.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AffComponent: () => (/* binding */ AffComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../utils/exp/exp.component */ 8742);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/citation.pipe */ 419);
var _class;






const _c0 = ["exp"];
const _c1 = ["affSel"];
function AffComponent_option_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "option", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const aff_r4 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngValue", ctx_r1.affiliations.indexOf(aff_r4));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](aff_r4.Name);
  }
}
function AffComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "citation");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r2.currentAffiliation.Citation), " ");
  }
}
const _c2 = function () {
  return [];
};
class AffComponent {
  get experience() {
    return [...this.exp.experience];
  }
  get requirments() {
    return [];
  }
  get isComplete() {
    return this.currentAffiliationIndex !== undefined && this.exp.isComplete;
  }
  get currentAffiliation() {
    return this.currentAffiliationIndex !== undefined ? this.affiliations[this.currentAffiliationIndex] : undefined;
  }
  get subaffiliations() {
    return this.currentAffiliation ? this.currentAffiliation.Subaffiliations : [];
  }
  get affSubTotal() {
    return this.currentAffiliation ? this.currentAffiliation.Experience.reduce((a, b) => a + b.Quantity, 0) : 0;
  }
  constructor(ref) {
    this.ref = ref;
    this.affiliationChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.choice = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.subscriptions = [];
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.exp.choice.subscribe(choice => {
      this.choice.emit(choice);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }), this.exp.completed.subscribe(() => {
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }
  ngOnDestroy() {
    [...this.subscriptions].forEach(sub => sub.unsubscribe());
  }
  currentAffiliationChanged(_) {
    this.affiliationChanged.emit(this.currentAffiliation);
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
}
_class = AffComponent;
_class.ɵfac = function AffComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-stage0-aff"]],
  viewQuery: function AffComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c1, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.exp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.affSel = _t.first);
    }
  },
  inputs: {
    affiliations: "affiliations"
  },
  outputs: {
    affiliationChanged: "affiliationChanged",
    choice: "choice"
  },
  decls: 16,
  vars: 10,
  consts: [["for", "aff"], ["name", "affiliations", "id", "aff", 3, "ngModel", "ngModelChange", "change"], ["affSel", ""], ["hidden", "", "disabled", "", "selected", "", "value", "", 3, "ngValue"], ["class", "opt", 3, "ngValue", 4, "ngFor", "ngForOf"], [4, "ngIf"], [3, "hidden"], [3, "values"], ["exp", ""], [1, "opt", 3, "ngValue"]],
  template: function AffComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span")(1, "form")(2, "label", 0)(3, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Affiliation");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "select", 1, 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function AffComponent_Template_select_ngModelChange_5_listener($event) {
        return ctx.currentAffiliationIndex = $event;
      })("change", function AffComponent_Template_select_change_5_listener($event) {
        return ctx.currentAffiliationChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "option", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " -- select an option -- ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, AffComponent_option_9_Template, 2, 2, "option", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](10, AffComponent_div_10_Template, 3, 3, "div", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 6)(12, "h4");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](14, "app-exp", 7, 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](6);
      let tmp_7_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("incomplete", _r0.selectedIndex === 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.currentAffiliationIndex);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngValue", undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.affiliations);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.currentAffiliation);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("hidden", !ctx.currentAffiliation);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("Subtotal: ", ctx.affSubTotal, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("values", (tmp_7_0 = ctx.currentAffiliation == null ? null : ctx.currentAffiliation.Experience) !== null && tmp_7_0 !== undefined ? tmp_7_0 : _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](9, _c2));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgForm, _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_0__.ExpComponent, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_1__.CitationPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 2961:
/*!***********************************************************!*\
  !*** ./src/app/chargen/stages/newaff/newaff.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NewaffComponent: () => (/* binding */ NewaffComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_affiliation_affiliations_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/affiliation/affiliations.service */ 5952);
/* harmony import */ var _aff_aff_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./aff/aff.component */ 9981);
/* harmony import */ var _subaff_subaff_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./subaff/subaff.component */ 4031);
var _class;





const _c0 = ["aff"];
const _c1 = ["subaff"];
const _c2 = function () {
  return [];
};
class NewaffComponent {
  get currentAffiliation() {
    return this.aff.currentAffiliation;
  }
  get isComplete() {
    const affcompleted = this.aff?.isComplete ?? false;
    const subaffcompleted = this.subaff?.isComplete ?? false;
    return affcompleted && subaffcompleted;
  }
  get experience() {
    return [...this.aff.experience, ...this.subaff.experience];
  }
  get requirments() {
    return [...this.aff.requirments, ...this.subaff.requirments];
  }
  get affiliations() {
    const gottenAffs = this.affliliationService.At(this.currentYear);
    const exAffs = (this.excludedAffiliations ? this.excludedAffiliations : []).map(exaff => exaff.Name);
    return gottenAffs.filter(aff => !exAffs.includes(aff.Name));
  }
  constructor(affliliationService, ref) {
    this.affliliationService = affliliationService;
    this.ref = ref;
    this.complete = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.changed = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.affiliationChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.subscriptions = [];
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.aff.choice.subscribe(_ => {
      this.checkForComplete();
    }), this.aff.affiliationChanged.subscribe(_ => {
      this.affiliationChanged.emit(this.currentAffiliation);
      this.checkForComplete();
    }), this.subaff.subaffiliationChanged.subscribe(_ => {
      this.affiliationChanged.emit(this.currentAffiliation);
      this.checkForComplete();
    }), this.subaff.choice.subscribe(_ => {
      this.checkForComplete();
    }));
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  checkForComplete() {
    this.ref.detectChanges();
    if (this.isComplete) {
      //this should probaly emit all the completed info
      this.complete.emit(this.experience);
    } else {
      this.changed.emit();
    }
    this.ref.markForCheck();
  }
}
_class = NewaffComponent;
_class.ɵfac = function NewaffComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_affiliation_affiliations_service__WEBPACK_IMPORTED_MODULE_0__.AffiliationsService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_3__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-newaff"]],
  viewQuery: function NewaffComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c1, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.aff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.subaff = _t.first);
    }
  },
  inputs: {
    excludedAffiliations: "excludedAffiliations",
    currentYear: "currentYear"
  },
  outputs: {
    complete: "complete",
    changed: "changed",
    affiliationChanged: "affiliationChanged"
  },
  decls: 5,
  vars: 3,
  consts: [[3, "affiliations"], ["aff", ""], [3, "subaffiliations"], ["subaff", ""]],
  template: function NewaffComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "app-stage0-aff", 0, 1)(3, "app-stage0-subaff", 2, 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](2);
      let tmp_1_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("affiliations", ctx.affiliations);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("subaffiliations", (tmp_1_0 = _r0.currentAffiliation == null ? null : _r0.currentAffiliation.Subaffiliations) !== null && tmp_1_0 !== undefined ? tmp_1_0 : _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](2, _c2));
    }
  },
  dependencies: [_aff_aff_component__WEBPACK_IMPORTED_MODULE_1__.AffComponent, _subaff_subaff_component__WEBPACK_IMPORTED_MODULE_2__.SubaffComponent],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 4031:
/*!******************************************************************!*\
  !*** ./src/app/chargen/stages/newaff/subaff/subaff.component.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SubaffComponent: () => (/* binding */ SubaffComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../utils/exp/exp.component */ 8742);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/citation.pipe */ 419);
var _class;






const _c0 = ["exp"];
function SubaffComponent_option_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "option", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const subaff_r3 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngValue", ctx_r0.subaffiliations.indexOf(subaff_r3));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](subaff_r3.Name);
  }
}
function SubaffComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "citation");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r1.currentSubaffiliation.Citation), " ");
  }
}
const _c1 = function () {
  return [];
};
class SubaffComponent {
  get experience() {
    return this.exp ? this.exp.experience : [];
  }
  get requirments() {
    return [];
  }
  get isComplete() {
    if ((this.subaffiliations?.length ?? 0) === 0) return false;
    if (this.currentSubaffiliationIndex === undefined) return false;
    return !!this.currentSubaffiliation && this.exp.isComplete;
  }
  get currentSubaffiliation() {
    return this.currentSubaffiliationIndex !== undefined ? this.subaffiliations[this.currentSubaffiliationIndex] : undefined;
  }
  get subaffSubTotal() {
    return this.currentSubaffiliation ? this.currentSubaffiliation.Experience.reduce((a, b) => a + b.Quantity, 0) : 0;
  }
  constructor(ref) {
    this.ref = ref;
    this.subaffiliationChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.choice = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.subscriptions = [];
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.exp.choice.subscribe(choice => {
      this.choice.emit(choice);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }), this.exp.completed.subscribe(() => {
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }
  ngOnDestroy() {
    [...this.subscriptions].forEach(sub => sub.unsubscribe());
  }
  currentSubaffiliationChanged(e) {
    this.subaffiliationChanged.emit(this.currentSubaffiliation);
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
}
_class = SubaffComponent;
_class.ɵfac = function SubaffComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-stage0-subaff"]],
  viewQuery: function SubaffComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.exp = _t.first);
    }
  },
  inputs: {
    subaffiliations: "subaffiliations"
  },
  outputs: {
    subaffiliationChanged: "subaffiliationChanged",
    choice: "choice"
  },
  decls: 16,
  vars: 11,
  consts: [[3, "hidden"], ["for", "subaff"], ["name", "subaffiliations", "id", "subaff", "required", "", 3, "ngModel", "ngModelChange", "change"], ["hidden", "", "disabled", "", "selected", "", "value", "", 3, "ngValue"], ["class", "opt", 3, "ngValue", 4, "ngFor", "ngForOf"], [4, "ngIf"], [3, "values"], ["exp", ""], [1, "opt", 3, "ngValue"]],
  template: function SubaffComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "span")(2, "form")(3, "label", 1)(4, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Subaffiliation");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "select", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function SubaffComponent_Template_select_ngModelChange_6_listener($event) {
        return ctx.currentSubaffiliationIndex = $event;
      })("change", function SubaffComponent_Template_select_change_6_listener($event) {
        return ctx.currentSubaffiliationChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "option", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " -- select an option -- ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, SubaffComponent_option_9_Template, 2, 2, "option", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](10, SubaffComponent_div_10_Template, 3, 3, "div", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 0)(12, "h4");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](14, "app-exp", 6, 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      let tmp_8_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("hidden", ctx.subaffiliations.length === 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("incomplete", ctx.currentSubaffiliationIndex === undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.currentSubaffiliationIndex);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngValue", undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.subaffiliations);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.currentSubaffiliation);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("hidden", !ctx.currentSubaffiliation);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("Subtotal: ", ctx.subaffSubTotal, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("values", (tmp_8_0 = ctx.currentSubaffiliation == null ? null : ctx.currentSubaffiliation.Experience) !== null && tmp_8_0 !== undefined ? tmp_8_0 : _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](10, _c1));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgForm, _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_0__.ExpComponent, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_1__.CitationPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 6364:
/*!*********************************************************************************!*\
  !*** ./src/app/chargen/stages/random-life-event/random-life-event.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RandomLifeEventComponent: () => (/* binding */ RandomLifeEventComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/utils/common */ 6555);
/* harmony import */ var src_app_utils_set_exp_set_exp_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/set-exp/set-exp.component */ 7030);
/* harmony import */ var src_app_utils_rng_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/utils/rng.service */ 9650);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/citation.pipe */ 419);
var _class;








function RandomLifeEventComponent_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" At least 1/", ctx_r0.outcome.Denominator, " rounded up must be spend on Attributes and/or Traits. ");
  }
}
function RandomLifeEventComponent_div_18_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div")(1, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "app-set-exp", 7, 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "app-set-exp", 7, 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Attribute/Trait allocation total: ", ctx_r4.round(ctx_r4.outcome.Experience[ctx_r4.stage], ctx_r4.outcome.Denominator), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("limit", ctx_r4.round(ctx_r4.outcome.Experience[ctx_r4.stage], ctx_r4.outcome.Denominator))("options", ctx_r4.traitAndAttStats)("enlist", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Free allocation total: ", ctx_r4.outcome.Experience[ctx_r4.stage] - ctx_r4.round(ctx_r4.outcome.Experience[ctx_r4.stage], ctx_r4.outcome.Denominator), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("limit", ctx_r4.outcome.Experience[ctx_r4.stage] - ctx_r4.round(ctx_r4.outcome.Experience[ctx_r4.stage], ctx_r4.outcome.Denominator))("options", ctx_r4.anyStats)("enlist", true);
  }
}
function RandomLifeEventComponent_div_18_ng_template_2_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "app-set-exp", 7, 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("limit", ctx_r9.outcome.Experience[ctx_r9.stage])("options", ctx_r9.anyStats)("enlist", true);
  }
}
function RandomLifeEventComponent_div_18_ng_template_2_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Because this outcome has zero exp you have nothing else to do here. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function RandomLifeEventComponent_div_18_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, RandomLifeEventComponent_div_18_ng_template_2_ng_container_2_Template, 4, 3, "ng-container", 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, RandomLifeEventComponent_div_18_ng_template_2_span_3_Template, 2, 0, "span", 0);
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Free allocation total: ", ctx_r6.outcome.Experience[ctx_r6.stage], "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r6.outcome.Experience[ctx_r6.stage] !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r6.outcome.Experience[ctx_r6.stage] === 0);
  }
}
function RandomLifeEventComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, RandomLifeEventComponent_div_18_div_1_Template, 11, 8, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, RandomLifeEventComponent_div_18_ng_template_2_Template, 4, 3, "ng-template", null, 6, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.outcome.Denominator)("ngIfElse", _r5);
  }
}
function RandomLifeEventComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " If your GM allows for rerolls and you are happy with the outcome check the box to being allocating experience.\n");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
class RandomLifeEventComponent {
  get isComplete() {
    const reduce = this.currentRoll !== 7 ? this.setExp.reduce((sofar, current) => sofar && current.isComplete, true) : true;
    return this.acceptance && reduce;
  }
  get outcome() {
    const effectiveRoll = Math.min(Math.max(this.currentRoll + this.modifiers, 2), 12);
    switch (effectiveRoll) {
      case 2:
        return {
          Severity: 'Catastrophic!',
          Experience: {
            1: -100,
            2: -200,
            3: -400,
            4: -500
          },
          Denominator: 2
        };
      case 3:
        return {
          Severity: 'Horrific!',
          Experience: {
            1: -75,
            2: -150,
            3: -300,
            4: -375
          },
          Denominator: 3
        };
      case 4:
        return {
          Severity: 'Terrible!',
          Experience: {
            1: -50,
            2: -100,
            3: -200,
            4: -250
          }
        };
      case 5:
        return {
          Severity: 'Bad',
          Experience: {
            1: -25,
            2: -50,
            3: -100,
            4: -125
          }
        };
      case 6:
        return {
          Severity: 'Not So Bad',
          Experience: {
            1: -10,
            2: -20,
            3: -50,
            4: -60
          }
        };
      case 7:
        return {
          Severity: 'Mundane',
          Experience: {
            1: 0,
            2: 0,
            3: 0,
            4: 0
          }
        };
      case 8:
        return {
          Severity: 'Medicore',
          Experience: {
            1: 10,
            2: 20,
            3: 50,
            4: 60
          }
        };
      case 9:
        return {
          Severity: 'Pretty Good',
          Experience: {
            1: 25,
            2: 50,
            3: 100,
            4: 125
          }
        };
      case 10:
        return {
          Severity: 'Great!',
          Experience: {
            1: 50,
            2: 100,
            3: 200,
            4: 250
          }
        };
      case 11:
        return {
          Severity: 'Awesome!',
          Experience: {
            1: 75,
            2: 150,
            3: 300,
            4: 375
          },
          Denominator: 3
        };
      case 12:
        return {
          Severity: 'Blessed!',
          Experience: {
            1: 100,
            2: 200,
            3: 400,
            4: 500
          },
          Denominator: 2
        };
    }
  }
  get experience() {
    return this.setExp ? this.setExp.filter(exp => exp.isComplete).map(exp => exp.experience).flatMap(exp => exp) : [];
  }
  constructor(rng, ref) {
    this.rng = rng;
    this.ref = ref;
    this.complete = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.changed = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.rerollCount = 0;
    this.acceptance = false;
    this.modifiers = 0;
    this.citation = {
      Book: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWarCompanion,
      Page: 77
    };
    this.traitAndAttStats = [...(0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
      return {
        Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: att
      };
    }), ...(0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Trait).map(trait => {
      return {
        Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
        Trait: trait
      };
    })];
    this.anyStats = [...this.traitAndAttStats, ...(0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
      return {
        Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
        Skill: skill
      };
    })];
    this.subscriptions = [];
    this.setSubs = [];
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.setExp.changes.subscribe(change => {
      this.setSubs.forEach(sub => sub.unsubscribe());
      change.forEach(set => {
        this.setSubs.push(set.choice.subscribe(_ => {
          this.changed.emit();
          if (this.isComplete) this.complete.emit(this.experience);
          this.ref.detectChanges();
          this.ref.markForCheck();
        }));
      });
    }));
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  ngOnDestroy() {
    [...this.subscriptions, ...this.setSubs].forEach(sub => sub.unsubscribe());
  }
  ngOnInit() {
    this.currentRoll = this.rng.Roll() + this.rng.Roll();
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  reroll() {
    this.currentRoll = this.rng.Roll() + this.rng.Roll();
    this.rerollCount = this.rerollCount + 1;
  }
  acceptRoll(_) {
    this.acceptance = !this.acceptance;
    if (this.isComplete) this.complete.emit(this.experience);
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  round(numerator, denominator) {
    return Math.ceil(numerator / denominator);
  }
}
_class = RandomLifeEventComponent;
_class.ɵfac = function RandomLifeEventComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_utils_rng_service__WEBPACK_IMPORTED_MODULE_2__.RngService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_4__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-random-life-event"]],
  viewQuery: function RandomLifeEventComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](src_app_utils_set_exp_set_exp_component__WEBPACK_IMPORTED_MODULE_1__.SetExpComponent, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.setExp = _t);
    }
  },
  inputs: {
    stage: "stage"
  },
  outputs: {
    complete: "complete",
    changed: "changed"
  },
  decls: 20,
  vars: 15,
  consts: [[4, "ngIf"], ["for", "accept"], ["type", "checkbox", "id", "accept", "name", "accept", "unchecked", "", 3, "value", "click"], ["accept", ""], ["type", "button", "value", "reroll", "title", "reroll", "id", "reroll", "name", "reroll", 3, "disabled", "click"], [4, "ngIf", "ngIfElse"], ["elseBlock", ""], [3, "limit", "options", "enlist"], ["setExp", ""]],
  template: function RandomLifeEventComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Random Life Event");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "h4");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "div");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, RandomLifeEventComponent_ng_container_8_Template, 2, 1, "ng-container", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "wbr");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](11, "citation");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "div")(13, "label", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "Accept this outcome?");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "input", 2, 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function RandomLifeEventComponent_Template_input_click_15_listener($event) {
        return ctx.acceptRoll($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "input", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function RandomLifeEventComponent_Template_input_click_17_listener() {
        return ctx.reroll();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, RandomLifeEventComponent_div_18_Template, 4, 2, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](19, RandomLifeEventComponent_div_19_Template, 2, 0, "div", 0);
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"]("The current roll is ", ctx.currentRoll, ". You have re-rolled ", ctx.rerollCount, " times.");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Outcome: ", ctx.outcome.Severity, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" At this stage you have ", ctx.outcome.Experience[ctx.stage] >= 0 ? "+" : "", "", ctx.outcome.Experience[ctx.stage], " EXP to allocate. ");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.outcome.Denominator);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("For table ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](11, 13, ctx.citation), "\n");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("incomplete", !ctx.acceptance);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.acceptance);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx.acceptance);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.acceptance);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.acceptance);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, src_app_utils_set_exp_set_exp_component__WEBPACK_IMPORTED_MODULE_1__.SetExpComponent, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_3__.CitationPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 4358:
/*!****************************************************************************!*\
  !*** ./src/app/chargen/stages/stage0/default-exp/default-exp.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultExpComponent: () => (/* binding */ DefaultExpComponent)
/* harmony export */ });
/* harmony import */ var src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/utils/common */ 6555);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _utils_exp_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/exp.pipe */ 4908);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../utils/citation.pipe */ 419);
var _class;





function DefaultExpComponent_li_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "exp");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const exp_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, exp_r1), " ");
  }
}
class DefaultExpComponent {
  constructor() {
    this.defaultExperienceCitation = {
      Book: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
      Page: 52
    };
    this.defaultExperience = [...(0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
      return {
        Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: att,
        Quantity: 100
      };
    }), {
      Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
      Skill: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language,
      Subskill: 'English',
      Quantity: 20
    }, {
      Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
      Skill: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Perception,
      Quantity: 10
    }];
    this.defaultRequirment = [...(0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
      return {
        Kind: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute,
        Attribute: att,
        Op: '>',
        Level: 0
      };
    })];
  }
}
_class = DefaultExpComponent;
_class.ɵfac = function DefaultExpComponent_Factory(t) {
  return new (t || _class)();
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-stage0-default-exp"]],
  decls: 5,
  vars: 4,
  consts: [[4, "ngFor", "ngForOf"]],
  template: function DefaultExpComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ul");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, DefaultExpComponent_li_1_Template, 3, 3, "li", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](4, "citation");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.defaultExperience);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("Additionally +20 XP towards the affiliations primary or secondary language. ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](4, 2, ctx.defaultExperienceCitation), "");
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _utils_exp_pipe__WEBPACK_IMPORTED_MODULE_1__.ExpPipe, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_2__.CitationPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 5821:
/*!***********************************************************!*\
  !*** ./src/app/chargen/stages/stage0/stage0.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stage0Component: () => (/* binding */ Stage0Component)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_affiliation_affiliations_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/affiliation/affiliations.service */ 5952);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _utils_or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/or-exp/or-exp.component */ 2298);
/* harmony import */ var _default_exp_default_exp_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./default-exp/default-exp.component */ 4358);
/* harmony import */ var _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../newaff/newaff.component */ 2961);
var _class;







const _c0 = ["default"];
const _c1 = ["aff"];
const _c2 = ["langsel"];
function Stage0Component_input_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "input", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function Stage0Component_input_3_Template_input_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r5);
      const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r4.toggleVisibility(!ctx_r4.visible));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx_r0.isComplete ? "hide" : "show");
  }
}
function Stage0Component_ul_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ul")(1, "li", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, " Language/");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "app-or-exp", 9, 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](4);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("incomplete", _r6.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("options", ctx_r2.languages)("quantity", 20)("showLabel", false);
  }
}
class Stage0Component {
  get currentAffiliation() {
    return this.aff?.currentAffiliation;
  }
  get isComplete() {
    return !!this.language && this.aff.isComplete;
  }
  get language() {
    return this._language;
  }
  set language(value) {
    this.ref.markForCheck();
    this._language = value;
    this.ref.detectChanges();
  }
  get languages() {
    return this.currentAffiliation ? [this.currentAffiliation.PrimaryLanguage, ...this.currentAffiliation.SecondaryLanguages] : [];
  }
  get experience() {
    return [...(this.language ? [this.language] : []), ...this.default.defaultExperience];
  }
  get affiliationExperience() {
    return this.aff.experience;
  }
  get requirments() {
    return [];
  }
  get affiliationRequirments() {
    return this.aff.requirments;
  }
  constructor(affliliationService, ref) {
    this.affliliationService = affliliationService;
    this.ref = ref;
    this.complete = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.changed = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.languageChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this._language = undefined;
    this.subscriptions = [];
    this.hasHideButton = false;
    this.visible = true;
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.aff.changed.subscribe(() => {
      this.checkForComplete();
    }), this.aff.complete.subscribe(_ => {
      this.checkForComplete();
    }), this.aff.affiliationChanged.subscribe(_ => {
      this.checkForComplete();
      this.langsel.choice.subscribe(changes => {
        this.language = changes.add[0];
        this.languageChanged.emit(this.language);
      });
    }));
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  checkForComplete() {
    this.ref.detectChanges();
    if (this.isComplete) {
      //this should probaly emit all the completed info
      this.complete.emit(this.experience);
      this.hasHideButton = true;
    } else {
      this.hasHideButton = false;
      this.changed.emit();
    }
    this.ref.markForCheck();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  toggleVisibility(newState) {
    this.visible = newState;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
}
_class = Stage0Component;
_class.ɵfac = function Stage0Component_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_affiliation_affiliations_service__WEBPACK_IMPORTED_MODULE_0__.AffiliationsService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_4__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-stage0"]],
  viewQuery: function Stage0Component_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_c1, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_c2, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.default = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.aff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.langsel = _t.first);
    }
  },
  inputs: {
    startingYear: "startingYear",
    archtype: "archtype"
  },
  outputs: {
    complete: "complete",
    changed: "changed",
    languageChanged: "languageChanged"
  },
  decls: 12,
  vars: 5,
  consts: [["for", "toggleVisibilityStage0"], ["type", "button", "title", "toggleVisibilityStage0", "id", "toggleVisibilityStage0", "name", "toggleVisibilityStage0", 3, "value", "click", 4, "ngIf"], [3, "hidden"], ["default", ""], [3, "incomplete", 4, "ngIf"], [3, "currentYear"], ["aff", ""], ["type", "button", "title", "toggleVisibilityStage0", "id", "toggleVisibilityStage0", "name", "toggleVisibilityStage0", 3, "value", "click"], [1, "lang"], [3, "options", "quantity", "showLabel"], ["langsel", ""]],
  template: function Stage0Component_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "h1")(1, "label", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Stage 0 - Introduction");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, Stage0Component_input_3_Template, 1, 1, "input", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 2)(5, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](7, "app-stage0-default-exp", null, 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, Stage0Component_ul_9_Template, 5, 5, "ul", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](10, "app-newaff", 5, 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.hasHideButton);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("hidden", !ctx.visible);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("We only want to show options for what affiliations a player can selected based on what they could have been born into in the year ", ctx.startingYear, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentAffiliation);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("currentYear", ctx.startingYear);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _utils_or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_1__.OrExpComponent, _default_exp_default_exp_component__WEBPACK_IMPORTED_MODULE_2__.DefaultExpComponent, _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_3__.NewaffComponent],
  styles: ["li[_ngcontent-%COMP%] {\n  padding: 1px, 2px;\n  min-height: 21px;\n}\nli[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  padding-left: 0px;\n}\nli[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  padding-left: 0px;\n  padding-right: 0px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY2hhcmdlbi9zdGFnZXMvc3RhZ2UwL3N0YWdlMC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0VBQ0EsZ0JBQUE7QUFDSjtBQUFJO0VBQ0ksaUJBQUE7QUFFUjtBQUFJO0VBQ0ksaUJBQUE7RUFDQSxrQkFBQTtBQUVSIiwic291cmNlc0NvbnRlbnQiOlsibGkge1xyXG4gICAgcGFkZGluZzogMXB4LCAycHg7XHJcbiAgICBtaW4taGVpZ2h0OiAyMXB4O1xyXG4gICAgc2VsZWN0IHtcclxuICAgICAgICBwYWRkaW5nLWxlZnQ6IDBweDtcclxuICAgIH1cclxuICAgIGlucHV0IHtcclxuICAgICAgICBwYWRkaW5nLWxlZnQ6IDBweDtcclxuICAgICAgICBwYWRkaW5nLXJpZ2h0OiAwcHg7XHJcbiAgICB9XHJcbiAgICAvLyAmLmxhbmd7XHJcbiAgICAvLyAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGdyYXk7XHJcbiAgICAvLyB9XHJcbn1cclxuXHJcbi8vIGxpLmFmZnMge1xyXG4vLyAgICAgJjpsYXN0LWNoaWxkOm5vdCg6b25seS1jaGlsZCl7XHJcbi8vICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGdyYXk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuXHJcbi8vIGxpLnN1YmFmZnMge1xyXG4vLyAgICAgJjpsYXN0LWNoaWxkOm5vdCg6b25seS1jaGlsZCl7XHJcbi8vICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGdyYXk7XHJcbi8vICAgICB9XHJcbi8vIH0iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 5983:
/*!***********************************************************!*\
  !*** ./src/app/chargen/stages/stage1/stage1.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stage1Component: () => (/* binding */ Stage1Component)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 5400);
/* harmony import */ var src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/utils/common */ 6555);
/* harmony import */ var src_app_background_backgrounds_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/background/backgrounds.service */ 5961);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/exp/exp.component */ 8742);
/* harmony import */ var _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../newaff/newaff.component */ 2961);
/* harmony import */ var _random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../random-life-event/random-life-event.component */ 6364);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/citation.pipe */ 419);
var _class;











const _c0 = ["exp"];
const _c1 = ["changeAff"];
const _c2 = ["newaff"];
const _c3 = ["rle"];
function Stage1Component_input_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function Stage1Component_input_4_Template_input_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r5.toggleVisibility(!ctx_r5.visible));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", ctx_r0.isComplete ? "hide" : "show")("hidden", !ctx_r0.isComplete);
  }
}
function Stage1Component_option_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const bkg_r7 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngValue", ctx_r1.backgrounds.indexOf(bkg_r7));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](bkg_r7.Name);
  }
}
function Stage1Component_ng_container_26_app_newaff_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "app-newaff", 18, 19);
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("excludedAffiliations", ctx_r9.exAff)("currentYear", ctx_r9.affYear);
  }
}
function Stage1Component_ng_container_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "h3")(2, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Change affiliation?");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "input", 15, 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("change", function Stage1Component_ng_container_26_Template_input_change_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r11.changeAffChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](8, "wbr");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](10, "citation");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](11, Stage1Component_ng_container_26_app_newaff_11_Template, 2, 2, "app-newaff", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", ctx_r4.changeAffState);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("This decision is optional. Characters affiliation change will happen at ", ctx_r4.affYear, " if elected to do so.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" For affiliation change rules ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](10, 4, ctx_r4.affChangeCitation), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r4.changeAffState === "on");
  }
}
class Stage1Component {
  get affYear() {
    return this.currentStartingYear + (this.currentBackground?.Duration ?? 0);
  }
  get currentAffiliation() {
    return this.newaff?.currentAffiliation ?? this.startingAffiliation;
  }
  get isComplete() {
    if (this.hidden) return false;
    const check = this.exp.isComplete && this.rle.isComplete;
    if (this.changeAffState === 'off') return check;
    return (this.newaff?.isComplete ?? false) && check;
  }
  get experience() {
    return [...this.exp.experience, ...this.rle.experience];
  }
  get affiliationExperience() {
    return this.changeAffState === 'off' ? this.startingAffiliation.Experience : this.newaff.experience;
  }
  get requirments() {
    return this.currentBackground?.Prereq ? [this.currentBackground.Prereq] : [];
  }
  get affiliationRequirments() {
    return this.changeAffState === 'off' ? [] : this.newaff.requirments;
  }
  get exAff() {
    return this.startingAffiliation ? [this.startingAffiliation] : [];
  }
  get backgrounds() {
    if (isNaN(this.currentStartingYear)) return [];
    if (this.currentStartingYear === undefined) return [];
    if (this.currentStartingYear in this._cache) return this._cache[this.currentStartingYear];else {
      return this._cache[this.currentStartingYear] = this.backgroundServices.At(this.currentStartingYear, 1);
    }
  }
  set fixedBackgroundExperience(values) {
    this.ref.markForCheck();
    this._fixedBkgExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => {
      if ('Or' in exp || 'Pick' in exp || 'Set' in exp || 'If' in exp) return exp;
      switch (exp.Kind) {
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
          switch (exp.Skill) {
            case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
              if (exp.Subskill === '!') {
                exp.Subskill = this.currentAffiliation.Protocol.Subskill;
              }
              return exp;
            case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
              if (exp.Subskill === '!' && !!this.currentLanguage) {
                exp.Subskill = this.currentLanguage.Subskill;
              }
              return exp;
            default:
              return exp;
          }
        default:
          return exp;
      }
    });
    this.ref.detectChanges();
  }
  get fixedBackgroundExperience() {
    if (this._fixedBkgExp.length === 0 && this.currentBackground) {
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    }
    return this._fixedBkgExp;
  }
  get currentBackground() {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }
  get subtotal() {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a + ('Pick' in b ? b.Pick.Count : 1) * b.Quantity, 0) : 0;
  }
  get currentBackgroundIndex() {
    return this._currentBackgroundIndex;
  }
  set currentBackgroundIndex(value) {
    this._currentBackgroundIndex = value;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  constructor(backgroundServices, ref) {
    this.backgroundServices = backgroundServices;
    this.ref = ref;
    this.hidden = false;
    this.backgroundChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.complete = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.changed = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.affiliationChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.affYearChanged = new rxjs__WEBPACK_IMPORTED_MODULE_7__.ReplaySubject();
    this.changeAffState = 'off';
    this.affChangeCitation = {
      Book: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
      Page: 53
    };
    this._cache = {};
    this._fixedBkgExp = [];
    this.subscriptions = [];
    this.newaffSubs = [];
    this.hasHideButton = false;
    this.visible = true;
  }
  ngOnInit() {
    this.subscriptions.push(this.startingYear.subscribe(year => {
      this.currentStartingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.exp.choice.subscribe(_ => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.exp.completed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.changed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.complete.subscribe(_ => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.language.subscribe(lang => {
      this.currentLanguage = lang;
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
      this.checkForComplete();
    }));
  }
  ngOnDestroy() {
    [...this.subscriptions, ...this.newaffSubs].forEach(sub => sub.unsubscribe());
  }
  toggleVisibility(newState) {
    this.visible = newState;
  }
  checkForComplete() {
    this.ref.detectChanges();
    if (this.isComplete) {
      //this should probaly emit all the completed info
      this.complete.emit(this.experience);
      this.affYearChanged.next(this.affYear);
      this.hasHideButton = true;
    } else {
      this.hasHideButton = false;
      this.changed.emit();
    }
    this.ref.markForCheck();
  }
  currentBackgroundChanged(_) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  changeAffChanged(_) {
    switch (this.changeAffState) {
      case 'off':
        this.changeAffState = 'on';
        break;
      case 'on':
      default:
        this.changeAffState = 'off';
        break;
    }
    this.ref.detectChanges();
    switch (this.changeAffState) {
      case 'on':
        this.newaffSubs.push(this.newaff.changed.subscribe(_ => {
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.complete.subscribe(() => {
          this.affiliationChanged.emit(this.newaff.currentAffiliation);
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.affiliationChanged.subscribe(_ => {
          this.checkForComplete();
        }));
        break;
      case 'off':
      default:
        this.newaffSubs.forEach(sub => sub.unsubscribe());
        break;
    }
    this.ref.markForCheck();
  }
}
_class = Stage1Component;
_class.ɵfac = function Stage1Component_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_background_backgrounds_service__WEBPACK_IMPORTED_MODULE_1__.BackgroundsService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_6__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-stage1"]],
  viewQuery: function Stage1Component_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c1, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c2, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c3, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.exp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.changeAff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.newaff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.rle = _t.first);
    }
  },
  inputs: {
    hidden: "hidden",
    startingYear: "startingYear",
    archtype: "archtype",
    startingAffiliation: "startingAffiliation",
    language: "language"
  },
  outputs: {
    backgroundChanged: "backgroundChanged",
    complete: "complete",
    changed: "changed",
    affiliationChanged: "affiliationChanged",
    affYearChanged: "affYearChanged"
  },
  decls: 27,
  vars: 16,
  consts: [[3, "hidden"], ["for", "toggleVisibilityStage1"], ["type", "button", "title", "toggleVisibilityStage1", "id", "toggleVisibilityStage1", "name", "toggleVisibilityStage1", 3, "value", "hidden", "click", 4, "ngIf"], ["for", "bkg"], ["title", "background", "name", "background", "id", "bkg", 3, "ngModel", "ngModelChange", "change"], ["hidden", "", "disabled", "", "selected", "", "value", "", 3, "ngValue"], ["class", "opt", 3, "ngValue", 4, "ngFor", "ngForOf"], [3, "values"], ["exp", ""], [3, "stage"], ["rle", ""], [4, "ngIf"], ["type", "button", "title", "toggleVisibilityStage1", "id", "toggleVisibilityStage1", "name", "toggleVisibilityStage1", 3, "value", "hidden", "click"], [1, "opt", 3, "ngValue"], ["for", "changeAff"], ["type", "checkbox", "id", "changeAff", "name", "changeAff", "unchecked", "", 3, "value", "change"], ["changeAff", ""], [3, "excludedAffiliations", "currentYear", 4, "ngIf"], [3, "excludedAffiliations", "currentYear"], ["newaff", ""]],
  template: function Stage1Component_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0)(1, "h1")(2, "label", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Stage 1 - Early Childhood");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](4, Stage1Component_input_4_Template, 1, 2, "input", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 0)(6, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7, "Select an early childhood background for your character.");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "span")(9, "form")(10, "label", 3)(11, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12, "Background");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "select", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function Stage1Component_Template_select_ngModelChange_13_listener($event) {
        return ctx.currentBackgroundIndex = $event;
      })("change", function Stage1Component_Template_select_change_13_listener($event) {
        return ctx.currentBackgroundChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "option", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, " -- select an option -- ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](16, Stage1Component_option_16_Template, 2, 2, "option", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](18);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](19, "citation");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "h4");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](21);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](22, "app-exp", 7, 8)(24, "app-random-life-event", 9, 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](26, Stage1Component_ng_container_26_Template, 12, 6, "ng-container", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", ctx.hidden);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.hasHideButton);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", !ctx.visible);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("incomplete", ctx.currentBackgroundIndex === undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.currentBackgroundIndex);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngValue", undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.backgrounds);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", !ctx.currentBackground);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](19, 14, ctx.currentBackground == null ? null : ctx.currentBackground.Citation), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("Subtotal: ", ctx.subtotal, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("values", ctx.fixedBackgroundExperience);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("stage", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.currentBackground);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgForm, _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_2__.ExpComponent, _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_3__.NewaffComponent, _random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_4__.RandomLifeEventComponent, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_5__.CitationPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 4108:
/*!***********************************************************!*\
  !*** ./src/app/chargen/stages/stage2/stage2.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stage2Component: () => (/* binding */ Stage2Component)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 5400);
/* harmony import */ var src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/utils/common */ 6555);
/* harmony import */ var src_app_background_backgrounds_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/background/backgrounds.service */ 5961);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/exp/exp.component */ 8742);
/* harmony import */ var _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../newaff/newaff.component */ 2961);
/* harmony import */ var _random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../random-life-event/random-life-event.component */ 6364);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/citation.pipe */ 419);
var _class;











const _c0 = ["exp"];
const _c1 = ["changeAff"];
const _c2 = ["newaff"];
const _c3 = ["rle"];
function Stage2Component_input_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function Stage2Component_input_4_Template_input_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r5.toggleVisibility(!ctx_r5.visible));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", ctx_r0.isComplete ? "hide" : "show");
  }
}
function Stage2Component_option_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const bkg_r7 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngValue", ctx_r1.backgrounds.indexOf(bkg_r7));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](bkg_r7.Name);
  }
}
function Stage2Component_ng_container_26_app_newaff_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "app-newaff", 18, 19);
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("excludedAffiliations", ctx_r9.exAff)("currentYear", ctx_r9.affYear);
  }
}
function Stage2Component_ng_container_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "h3")(2, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Change affiliation?");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "input", 15, 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("change", function Stage2Component_ng_container_26_Template_input_change_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r11.changeAffChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](8, "wbr");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](10, "citation");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](11, Stage2Component_ng_container_26_app_newaff_11_Template, 2, 2, "app-newaff", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", ctx_r4.changeAffState);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("This decision is optional. Characters affiliation change will happen at ", ctx_r4.affYear, " if elected to do so.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" For affiliation change rules ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](10, 4, ctx_r4.affChangeCitation), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r4.changeAffState === "on");
  }
}
class Stage2Component {
  get affYear() {
    return this.currentStartingYear + (this.currentBackground?.Duration ?? 0);
  }
  get currentAffiliation() {
    return this.newaff?.currentAffiliation ?? this.affiliation;
  }
  get isComplete() {
    if (this.hidden) return false;
    const check = this.exp.isComplete && this.rle.isComplete;
    if (this.changeAffState === 'off') return check;
    return (this.newaff?.isComplete ?? false) && check;
  }
  get experience() {
    return [...this.exp.experience, ...this.rle.experience];
  }
  get affiliationExperience() {
    return this.changeAffState === 'off' ? this.affiliation.Experience : this.newaff.experience;
  }
  get requirments() {
    return this.currentBackground?.Prereq ? [this.currentBackground.Prereq] : [];
  }
  get affiliationRequirments() {
    return this.changeAffState === 'off' ? [] : this.newaff.requirments;
  }
  get exAff() {
    return this.affiliation ? [this.affiliation] : [];
  }
  get backgrounds() {
    if (isNaN(this.currentStartingYear)) return [];
    if (this.currentStartingYear === undefined) return [];
    if (this.currentStartingYear in this._cache) return this._cache[this.currentStartingYear];else {
      return this._cache[this.currentStartingYear] = this.backgroundServices.At(this.currentStartingYear, 2);
    }
  }
  set fixedBackgroundExperience(values) {
    this.ref.markForCheck();
    this._fixedBkgExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => {
      if ('Or' in exp || 'Pick' in exp || 'Set' in exp || 'If' in exp) return exp;
      switch (exp.Kind) {
        case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
          switch (exp.Skill) {
            case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
            case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
              if (exp.Subskill === '!') {
                exp.Subskill = this.currentAffiliation.Protocol.Subskill;
              }
              return exp;
            case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
              if (exp.Subskill === '!' && !!this.currentLanguage) {
                exp.Subskill = this.currentLanguage.Subskill;
              }
              return exp;
            default:
              return exp;
          }
        default:
          return exp;
      }
    });
    this.ref.detectChanges();
  }
  get fixedBackgroundExperience() {
    if (this._fixedBkgExp.length === 0 && this.currentBackground) {
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    }
    return this._fixedBkgExp;
  }
  get currentBackground() {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }
  get subtotal() {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a + ('Pick' in b ? b.Pick.Count : 1) * b.Quantity, 0) : 0;
  }
  constructor(backgroundServices, ref) {
    this.backgroundServices = backgroundServices;
    this.ref = ref;
    this.hidden = false;
    this.backgroundChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.complete = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.changed = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.affiliationChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.affYearChanged = new rxjs__WEBPACK_IMPORTED_MODULE_7__.ReplaySubject();
    this.changeAffState = 'off';
    this.affChangeCitation = {
      Book: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
      Page: 53
    };
    this._cache = {};
    this._fixedBkgExp = [];
    this.subscriptions = [];
    this.newaffSubs = [];
    this.hasHideButton = false;
    this.visible = true;
  }
  ngOnInit() {
    this.subscriptions.push(this.language.subscribe(lang => {
      this.currentLanguage = lang;
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
      this.checkForComplete();
    }));
    this.subscriptions.push(this.startingYear.subscribe(year => {
      this.currentStartingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.exp.choice.subscribe(_ => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.exp.completed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.changed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.complete.subscribe(_ => {
      this.checkForComplete();
    }));
  }
  ngOnDestroy() {
    [...this.subscriptions, ...this.newaffSubs].forEach(sub => sub.unsubscribe());
  }
  toggleVisibility(newState) {
    this.visible = newState;
  }
  checkForComplete() {
    this.ref.detectChanges();
    if (this.isComplete) {
      //this should probaly emit all the completed info
      this.complete.emit(this.experience);
      this.affYearChanged.next(this.affYear);
      this.hasHideButton = true;
    } else {
      this.hasHideButton = false;
      this.changed.emit();
    }
    this.ref.markForCheck();
  }
  currentBackgroundChanged(_) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  changeAffChanged(_) {
    switch (this.changeAffState) {
      case 'off':
        this.changeAffState = 'on';
        break;
      case 'on':
      default:
        this.changeAffState = 'off';
        break;
    }
    this.ref.detectChanges();
    switch (this.changeAffState) {
      case 'on':
        this.newaffSubs.push(this.newaff.changed.subscribe(_ => {
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.complete.subscribe(() => {
          this.affiliationChanged.emit(this.newaff.currentAffiliation);
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.affiliationChanged.subscribe(_ => {
          this.checkForComplete();
        }));
        break;
      case 'off':
      default:
        this.newaffSubs.forEach(sub => sub.unsubscribe());
        break;
    }
    this.ref.markForCheck();
  }
}
_class = Stage2Component;
_class.ɵfac = function Stage2Component_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_background_backgrounds_service__WEBPACK_IMPORTED_MODULE_1__.BackgroundsService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_6__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-stage2"]],
  viewQuery: function Stage2Component_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c1, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c2, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c3, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.exp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.changeAff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.newaff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.rle = _t.first);
    }
  },
  inputs: {
    hidden: "hidden",
    startingYear: "startingYear",
    archtype: "archtype",
    affiliation: "affiliation",
    language: "language"
  },
  outputs: {
    backgroundChanged: "backgroundChanged",
    complete: "complete",
    changed: "changed",
    affiliationChanged: "affiliationChanged",
    affYearChanged: "affYearChanged"
  },
  decls: 27,
  vars: 16,
  consts: [[3, "hidden"], ["for", "toggleVisibilityStage2"], ["type", "button", "title", "toggleVisibilityStage2", "id", "toggleVisibilityStage2", "name", "toggleVisibilityStage2", 3, "value", "click", 4, "ngIf"], ["for", "bkg"], ["title", "background", "name", "background", "id", "bkg", 3, "ngModel", "ngModelChange", "change"], ["hidden", "", "disabled", "", "selected", "", "value", "", 3, "ngValue"], ["class", "opt", 3, "ngValue", 4, "ngFor", "ngForOf"], [3, "values"], ["exp", ""], [3, "stage"], ["rle", ""], [4, "ngIf"], ["type", "button", "title", "toggleVisibilityStage2", "id", "toggleVisibilityStage2", "name", "toggleVisibilityStage2", 3, "value", "click"], [1, "opt", 3, "ngValue"], ["for", "changeAff"], ["type", "checkbox", "id", "changeAff", "name", "changeAff", "unchecked", "", 3, "value", "change"], ["changeAff", ""], [3, "excludedAffiliations", "currentYear", 4, "ngIf"], [3, "excludedAffiliations", "currentYear"], ["newaff", ""]],
  template: function Stage2Component_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0)(1, "h1")(2, "label", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Stage 2 - Late Childhood");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](4, Stage2Component_input_4_Template, 1, 1, "input", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 0)(6, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7, "Select a late childhood background for your character.");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "span")(9, "form")(10, "label", 3)(11, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12, "Background");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "select", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function Stage2Component_Template_select_ngModelChange_13_listener($event) {
        return ctx.currentBackgroundIndex = $event;
      })("change", function Stage2Component_Template_select_change_13_listener($event) {
        return ctx.currentBackgroundChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "option", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, " -- select an option -- ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](16, Stage2Component_option_16_Template, 2, 2, "option", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](18);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](19, "citation");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "h4");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](21);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](22, "app-exp", 7, 8)(24, "app-random-life-event", 9, 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](26, Stage2Component_ng_container_26_Template, 12, 6, "ng-container", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", ctx.hidden);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.hasHideButton);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", !ctx.visible);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("incomplete", ctx.currentBackgroundIndex === undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.currentBackgroundIndex);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngValue", undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.backgrounds);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", !ctx.currentBackground);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](19, 14, ctx.currentBackground == null ? null : ctx.currentBackground.Citation), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("Subtotal: ", ctx.subtotal, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("values", ctx.fixedBackgroundExperience);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("stage", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.currentBackground);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgForm, _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_2__.ExpComponent, _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_3__.NewaffComponent, _random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_4__.RandomLifeEventComponent, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_5__.CitationPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 152:
/*!***********************************************************!*\
  !*** ./src/app/chargen/stages/stage3/stage3.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stage3Component: () => (/* binding */ Stage3Component)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/utils/common */ 6555);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 5400);
/* harmony import */ var src_app_education_education__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/education/education */ 9105);
/* harmony import */ var src_app_education_education_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/education/education.service */ 676);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/exp/exp.component */ 8742);
/* harmony import */ var _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../newaff/newaff.component */ 2961);
/* harmony import */ var _random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../random-life-event/random-life-event.component */ 6364);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/citation.pipe */ 419);
var _class;












const _c0 = ["exp"];
const _c1 = ["firstFieldExp"];
const _c2 = ["secondFieldExp"];
const _c3 = ["lastFieldExp"];
const _c4 = ["basic"];
const _c5 = ["nextEdu"];
const _c6 = ["lastEdu"];
const _c7 = ["changeAff"];
const _c8 = ["newaff"];
const _c9 = ["rle"];
function Stage3Component_input_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function Stage3Component_input_3_Template_input_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r6.toggleVisibility(!ctx_r6.visible));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", ctx_r0.isComplete ? "hide" : "show");
  }
}
function Stage3Component_option_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const bkg_r8 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r1.backgrounds.indexOf(bkg_r8))("disabled", ctx_r1.currentStartingYear + bkg_r8[ctx_r1.Basic].Duration > ctx_r1.currentEndingYear);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", bkg_r8.Name, " ");
  }
}
function Stage3Component_div_26_option_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const edu_r17 = ctx.$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r10.EducationFields[ctx_r10.Basic].indexOf(edu_r17));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](edu_r17.Name);
  }
}
function Stage3Component_div_26_option_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const next_r18 = ctx.$implicit;
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r13.eduLvl(next_r18))("disabled", ctx_r13.currentStartingYear + ctx_r13.currentBackground[ctx_r13.Basic].Duration + ctx_r13.currentBackground[next_r18].Duration > ctx_r13.currentEndingYear);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r13.eduLvl(next_r18), "");
  }
}
function Stage3Component_div_26_ng_container_37_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const edu_r23 = ctx.$implicit;
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r20.EducationFields[ctx_r20.Basic].indexOf(edu_r23));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](edu_r23.Name);
  }
}
function Stage3Component_div_26_ng_container_37_ng_container_13_option_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const next_r27 = ctx.$implicit;
    const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r25.eduLvl(next_r27))("disabled", ctx_r25.currentStartingYear + ctx_r25.currentBackground[ctx_r25.Basic].Duration + ctx_r25.currentBackground[next_r27].Duration > ctx_r25.currentEndingYear);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r25.eduLvl(next_r27), "");
  }
}
function Stage3Component_div_26_ng_container_37_ng_container_13_ng_container_18_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const edu_r31 = ctx.$implicit;
    const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r29.EducationFields[ctx_r29.Advanced].indexOf(edu_r31));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", edu_r31.Name, " ");
  }
}
function Stage3Component_div_26_ng_container_37_ng_container_13_ng_container_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div")(2, "select", 30, 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function Stage3Component_div_26_ng_container_37_ng_container_13_ng_container_18_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r33);
      const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r32.educationIndex[ctx_r32.Special] = $event);
    })("change", function Stage3Component_div_26_ng_container_37_ng_container_13_ng_container_18_Template_select_change_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r33);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      const _r24 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](12);
      const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r34.EduChanged($event, _r24.value, ctx_r34.Special));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](6, Stage3Component_div_26_ng_container_37_ng_container_13_ng_container_18_option_6_Template, 2, 2, "option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](11, "app-exp", 7, 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](3);
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", _r28.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("name", ctx_r26.eduLvl(ctx_r26.Advanced) + "-3")("ngModel", ctx_r26.educationIndex[ctx_r26.Special]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r26.EducationFields[ctx_r26.Advanced]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("This will take ", ctx_r26.currentBackground[ctx_r26.Advanced] == null ? null : ctx_r26.currentBackground[ctx_r26.Advanced].Duration, " year", (ctx_r26.currentBackground[ctx_r26.Advanced] == null ? null : ctx_r26.currentBackground[ctx_r26.Advanced].Duration) > 1 ? "s" : "", " to complete.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Subtotal: ", ctx_r26.fixedSpecExperience.length * 30, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("values", ctx_r26.fixedSpecExperience);
  }
}
const _c10 = function (a0) {
  return [a0];
};
function Stage3Component_div_26_ng_container_37_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "The the last field must be ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](5, "wbr");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6, ", or you can finish by selecting ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8, "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "span")(11, "select", 28, 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("change", function Stage3Component_div_26_ng_container_37_ng_container_13_Template_select_change_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r36);
      const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r35.update(ctx_r35.Special));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](15, Stage3Component_div_26_ng_container_37_ng_container_13_option_15_Template, 2, 3, "option", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "option", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](17, "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](18, Stage3Component_div_26_ng_container_37_ng_container_13_ng_container_18_Template, 13, 10, "ng-container", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r24 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](12);
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r22.eduLvl(ctx_r22.Advanced));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", _r24.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](7, _c10, ctx_r22.Advanced));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r24.value === ctx_r22.eduLvl(ctx_r22.Advanced));
  }
}
function Stage3Component_div_26_ng_container_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div")(2, "select", 25, 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function Stage3Component_div_26_ng_container_37_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r38);
      const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r37.educationIndex[ctx_r37.Advanced] = $event);
    })("change", function Stage3Component_div_26_ng_container_37_Template_select_change_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r38);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](31);
      const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r39.EduChanged($event, _r12.value, ctx_r39.Advanced));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](6, Stage3Component_div_26_ng_container_37_option_6_Template, 2, 2, "option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](11, "app-exp", 7, 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](13, Stage3Component_div_26_ng_container_37_ng_container_13_Template, 19, 9, "ng-container", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](3);
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](12);
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", _r19.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("name", ctx_r14.eduLvl(ctx_r14.Basic) + "-2")("ngModel", ctx_r14.educationIndex[ctx_r14.Advanced]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r14.excludeEduOpt(ctx_r14.EducationFields[ctx_r14.Basic], ctx_r14.currentBackground[ctx_r14.Basic].Options[ctx_r14.educationIndex[ctx_r14.Basic]]));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("This will take ", ctx_r14.currentBackground[ctx_r14.Basic] == null ? null : ctx_r14.currentBackground[ctx_r14.Basic].Duration, " year", (ctx_r14.currentBackground[ctx_r14.Basic] == null ? null : ctx_r14.currentBackground[ctx_r14.Basic].Duration) > 1 ? "s" : "", " to complete.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Subtotal: ", ctx_r14.fixedAdvExperience.length * 30, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("values", ctx_r14.fixedAdvExperience);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r21.isComplete && _r19.selectedIndex !== 0);
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const edu_r45 = ctx.$implicit;
    const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r42.EducationFields[ctx_r42.Advanced].indexOf(edu_r45));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](edu_r45.Name);
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "The last field can be either ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, " or ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](8, "wbr");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9, ", or you can finish by selecting ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11, "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](12, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r46.eduLvl(ctx_r46.Basic));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r46.eduLvl(ctx_r46.Special));
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "The the last field must be ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](4, "wbr");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, ", or you can finish by selecting ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7, "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r48.eduLvl(ctx_r48.Basic));
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_option_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const next_r53 = ctx.$implicit;
    const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r50.eduLvl(next_r53))("disabled", ctx_r50.currentStartingYear + ctx_r50.currentBackground[ctx_r50.Basic].Duration + ctx_r50.currentBackground[next_r53].Duration > ctx_r50.currentEndingYear);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r50.eduLvl(next_r53), "");
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_11_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const edu_r57 = ctx.$implicit;
    const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r55.EducationFields[ctx_r55.Basic].indexOf(edu_r57));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", edu_r57.Name, " ");
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r59 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div")(2, "select", 37, 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_11_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r59);
      const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r58.educationIndex[ctx_r58.asEduLvl(ctx_r58.Special)] = $event);
    })("change", function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_11_Template_select_change_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r59);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      const _r49 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](5);
      const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r60.EduChanged($event, _r49.value, ctx_r60.Special));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](6, Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_11_option_6_Template, 2, 2, "option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](11, "app-exp", 7, 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r54 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](3);
    const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", _r54.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("name", ctx_r51.eduLvl(ctx_r51.Basic) + "-3")("ngModel", ctx_r51.educationIndex[ctx_r51.asEduLvl(ctx_r51.Special)]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r51.excludeEduOpt(ctx_r51.EducationFields[ctx_r51.Basic], ctx_r51.currentBackground[ctx_r51.Basic].Options[ctx_r51.educationIndex[ctx_r51.Basic]]));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("This will take ", ctx_r51.currentBackground[ctx_r51.Basic] == null ? null : ctx_r51.currentBackground[ctx_r51.Basic].Duration, " year", (ctx_r51.currentBackground[ctx_r51.Basic] == null ? null : ctx_r51.currentBackground[ctx_r51.Basic].Duration) > 1 ? "s" : "", " to complete.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Subtotal: ", ctx_r51.fixedSpecExperience.length * 30, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("values", ctx_r51.fixedSpecExperience);
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_12_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const edu_r64 = ctx.$implicit;
    const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", ctx_r62.EducationFields[ctx_r62.Special].indexOf(edu_r64));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", edu_r64.Name, " ");
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r66 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div")(2, "select", 38, 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_12_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r66);
      const ctx_r65 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r65.educationIndex[ctx_r65.asEduLvl(ctx_r65.Special)] = $event);
    })("change", function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_12_Template_select_change_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r66);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      const _r49 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](5);
      const ctx_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r67.EduChanged($event, _r49.value, ctx_r67.Special));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](6, Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_12_option_6_Template, 2, 2, "option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](11, "app-exp", 7, 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r61 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](3);
    const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", _r61.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("name", ctx_r52.eduLvl(ctx_r52.Special) + "-3")("ngModel", ctx_r52.educationIndex[ctx_r52.asEduLvl(ctx_r52.Special)]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r52.EducationFields[ctx_r52.Special]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("This will take ", ctx_r52.currentBackground[ctx_r52.Special] == null ? null : ctx_r52.currentBackground[ctx_r52.Special].Duration, " year", (ctx_r52.currentBackground[ctx_r52.Special] == null ? null : ctx_r52.currentBackground[ctx_r52.Special].Duration) > 1 ? "s" : "", " to complete.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Subtotal: ", ctx_r52.fixedSpecExperience.length * 30, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("values", ctx_r52.fixedSpecExperience);
  }
}
const _c11 = function (a0, a1) {
  return [a0, a1];
};
function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r69 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](1, Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_1_Template, 13, 2, "ng-container", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](2, Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_template_2_Template, 9, 1, "ng-template", null, 35, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "select", 36, 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("change", function Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_Template_select_change_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r69);
      const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r68.update(ctx_r68.Special));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](8, Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_option_8_Template, 2, 3, "option", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "option", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10, "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](11, Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_11_Template, 13, 10, "ng-container", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](12, Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_ng_container_12_Template, 13, 10, "ng-container", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](3);
    const _r49 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](5);
    const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r44.currentBackground[ctx_r44.Special])("ngIfElse", _r47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r44.currentBackground[ctx_r44.Special] ? _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction2"](7, _c11, ctx_r44.Basic, ctx_r44.Special) : _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](10, _c10, ctx_r44.Basic));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r49.value === ctx_r44.eduLvl(ctx_r44.Basic));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r49.value === ctx_r44.eduLvl(ctx_r44.Special));
  }
}
function Stage3Component_div_26_ng_template_38_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r71 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div")(2, "select", 33, 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function Stage3Component_div_26_ng_template_38_ng_container_0_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r71);
      const ctx_r70 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r70.educationIndex[ctx_r70.asEduLvl(ctx_r70.Advanced)] = $event);
    })("change", function Stage3Component_div_26_ng_template_38_ng_container_0_Template_select_change_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r71);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](31);
      const ctx_r72 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r72.EduChanged($event, _r12.value, ctx_r72.Advanced));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](6, Stage3Component_div_26_ng_template_38_ng_container_0_option_6_Template, 2, 2, "option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](11, "app-exp", 7, 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](13, Stage3Component_div_26_ng_template_38_ng_container_0_ng_container_13_Template, 13, 12, "ng-container", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](3);
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](12);
    const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", _r41.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("name", ctx_r40.eduLvl(ctx_r40.Advanced) + "-2")("ngModel", ctx_r40.educationIndex[ctx_r40.asEduLvl(ctx_r40.Advanced)]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r40.EducationFields[ctx_r40.Advanced]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("This will take ", ctx_r40.currentBackground[ctx_r40.Advanced] == null ? null : ctx_r40.currentBackground[ctx_r40.Advanced].Duration, " year", (ctx_r40.currentBackground[ctx_r40.Advanced] == null ? null : ctx_r40.currentBackground[ctx_r40.Advanced].Duration) > 1 ? "s" : "", " to complete.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Subtotal: ", ctx_r40.fixedAdvExperience.length * 30, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("values", ctx_r40.fixedAdvExperience);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r43.isComplete && _r41.selectedIndex !== 0);
  }
}
function Stage3Component_div_26_ng_template_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](0, Stage3Component_div_26_ng_template_38_ng_container_0_Template, 14, 11, "ng-container", 9);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](31);
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r12.value === ctx_r16.eduLvl(ctx_r16.Advanced));
  }
}
function Stage3Component_div_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r74 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div")(1, "div")(2, "label", 14)(3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "select", 15, 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function Stage3Component_div_26_Template_select_ngModelChange_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r74);
      const ctx_r73 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r73.educationIndex[ctx_r73.Basic] = $event);
    })("change", function Stage3Component_div_26_Template_select_change_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r74);
      const ctx_r75 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r75.EduChanged($event, ctx_r75.eduLvl(ctx_r75.Basic), ctx_r75.Basic));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](9, Stage3Component_div_26_option_9_Template, 2, 2, "option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](12, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](14, "app-exp", 7, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "div", 2)(17, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](18, "The next field can be either ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](21, " or ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](22, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](24, "wbr");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](25, ", or you can finish by selecting ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](26, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](27, "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](28, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](29, "span")(30, "select", 19, 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("change", function Stage3Component_div_26_Template_select_change_30_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r74);
      const ctx_r76 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r76.update(ctx_r76.Advanced));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](32, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](33, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](34, Stage3Component_div_26_option_34_Template, 2, 3, "option", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](35, "option", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](36, "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](37, Stage3Component_div_26_ng_container_37_Template, 14, 11, "ng-container", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](38, Stage3Component_div_26_ng_template_38_Template, 1, 1, "ng-template", null, 23, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](6);
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](15);
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](31);
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](39);
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", _r9.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r3.eduLvl(ctx_r3.Basic));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("title", ctx_r3.eduLvl(ctx_r3.Basic) + "-1")("name", ctx_r3.eduLvl(ctx_r3.Basic) + "-1")("ngModel", ctx_r3.educationIndex[ctx_r3.Basic]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r3.EducationFields[ctx_r3.Basic]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("This will take ", ctx_r3.currentBackground[ctx_r3.Basic] == null ? null : ctx_r3.currentBackground[ctx_r3.Basic].Duration, " year", (ctx_r3.currentBackground[ctx_r3.Basic] == null ? null : ctx_r3.currentBackground[ctx_r3.Basic].Duration) > 1 ? "s" : "", " to complete.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Subtotal: ", ctx_r3.fixedBasicExperience.length * 30, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("values", ctx_r3.fixedBasicExperience);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("hidden", !_r11.isComplete || ctx_r3.educationIndex[ctx_r3.Basic] === undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r3.eduLvl(ctx_r3.Basic));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r3.eduLvl(ctx_r3.Advanced));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", _r12.selectedIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction2"](22, _c11, ctx_r3.Basic, ctx_r3.Advanced));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r12.value === ctx_r3.eduLvl(ctx_r3.Basic))("ngIfElse", _r15);
  }
}
function Stage3Component_ng_container_30_app_newaff_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "app-newaff", 43, 44);
  }
  if (rf & 2) {
    const ctx_r78 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("excludedAffiliations", ctx_r78.exAff)("currentYear", ctx_r78.affYear);
  }
}
function Stage3Component_ng_container_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r81 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "h3")(2, "label", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "Change affiliation?");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "input", 40, 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("change", function Stage3Component_ng_container_30_Template_input_change_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r81);
      const ctx_r80 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r80.changeAffChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](8, "wbr");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](10, "citation");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](11, Stage3Component_ng_container_30_app_newaff_11_Template, 2, 2, "app-newaff", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", ctx_r5.changeAffState);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("This decision is optional. Characters affiliation change will happen at ", ctx_r5.affYear, " if elected to do so.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" For affiliation change rules ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](10, 4, ctx_r5.affChangeCitation), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r5.changeAffState === "on");
  }
}
class Stage3Component {
  get EducationFields() {
    return {
      [src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic]: this.currentBackground?.[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic]?.Options ?? [],
      [src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced]: this.currentBackground?.[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced]?.Options ?? [],
      [src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special]: this.currentBackground?.[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special]?.Options ?? []
    };
  }
  get affYear() {
    return [src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic, ...(this.nextEdu ? [src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType[this.nextEdu.nativeElement.value]] : []), ...(this.lastEdu ? [src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType[this.lastEdu.nativeElement.value]] : [])].reduce((sofar, current) => sofar + (this.currentBackground?.[current]?.Duration ?? 0), this.currentStartingYear);
  }
  get isComplete() {
    const check = this.exp?.isComplete && this.rle?.isComplete && this.firstFieldExp?.isComplete && (this.nextEdu?.nativeElement.value !== 'Complete' ? this.secondFieldExp.isComplete : true);
    if (this.changeAffState === 'off') return check;
    return (this.newaff?.isComplete ?? false) && check;
  }
  get exAff() {
    return this.affiliation ? [this.affiliation] : [];
  }
  get experience() {
    return [...this.exp.experience, ...(this.firstFieldExp?.experience ?? []), ...(this.secondFieldExp?.experience ?? []), ...this.rle.experience];
  }
  get Requirments() {
    return [...(this.currentBackground?.Prereq ? [this.currentBackground.Prereq, ...(0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType).filter(edu => this.educationIndex[edu] !== undefined).map(edu => {
      return {
        index: this.educationIndex[edu],
        edu: edu
      };
    }).map(value => this.currentBackground[value.edu]?.Options[value.index].Prereq).filter(req => !!req).map(req => req)] : [])];
  }
  get currentBackground() {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }
  get currentAffiliation() {
    return this.newaff?.currentAffiliation ?? this.affiliation;
  }
  FixExp(exp) {
    if ('Or' in exp || 'Pick' in exp || 'Set' in exp || 'If' in exp) return exp;
    switch (exp.Kind) {
      case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
        switch (exp.Skill) {
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
            if (exp.Subskill === '!') {
              exp.Subskill = this.currentAffiliation.Protocol.Subskill;
            }
            return exp;
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
            if (exp.Subskill === '!' && !!this.currentLanguage) {
              exp.Subskill = this.currentLanguage.Subskill;
            }
            return exp;
          default:
            return exp;
        }
      default:
        return exp;
    }
  }
  set fixedBackgroundExperience(values) {
    this.ref.markForCheck();
    this._fixedBkgExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => this.FixExp(exp));
    this.ref.detectChanges();
  }
  get fixedBackgroundExperience() {
    if (this._fixedBkgExp.length === 0 && this.currentBackground) {
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    }
    return this._fixedBkgExp;
  }
  set fixedBasicExperience(values) {
    this.ref.markForCheck();
    this._fixedBasicExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => this.FixExp(exp));
    this.ref.detectChanges();
  }
  get fixedBasicExperience() {
    if (this._fixedBasicExp.length === 0 && this.currentBackground && src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic in this.currentBackground && this.currentBackground[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic] && this.currentBackground[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic].Options && this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic] !== undefined && this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic] >= 0) {
      this.fixedBasicExperience = this.currentBackground[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic].Options[this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic]].Skills.map(skill => {
        return {
          ...skill,
          Quantity: 30
        };
      }) ?? [];
    }
    return this._fixedBasicExp;
  }
  set fixedAdvExperience(values) {
    this.ref.markForCheck();
    this._fixedAdvExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => this.FixExp(exp));
    this.ref.detectChanges();
  }
  get fixedAdvExperience() {
    const eduType = src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType[this.nextEdu.nativeElement.value];
    if (this._fixedAdvExp.length === 0 && this.currentBackground && eduType in this.currentBackground && this.currentBackground[eduType] !== undefined && this.currentBackground[eduType].Options && this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced] !== undefined && this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced] >= 0) {
      this.fixedAdvExperience = this.currentBackground[eduType].Options[this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced]].Skills.map(skill => {
        return {
          ...skill,
          Quantity: 30
        };
      }) ?? [];
    }
    return this._fixedAdvExp;
  }
  set fixedSpecExperience(values) {
    this.ref.markForCheck();
    this._fixedSpecExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => this.FixExp(exp));
    this.ref.detectChanges();
  }
  get fixedSpecExperience() {
    const eduType = src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType[this.lastEdu.nativeElement.value];
    if (this._fixedSpecExp.length === 0 && this.currentBackground && eduType in this.currentBackground && this.currentBackground[eduType] !== undefined && this.currentBackground[eduType].Options && this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special] !== undefined && this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special] >= 0) {
      this.fixedSpecExperience = this.currentBackground[eduType].Options[this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special]].Skills.map(skill => {
        return {
          ...skill,
          Quantity: 30
        };
      }) ?? [];
    }
    return this._fixedSpecExp;
  }
  get backgrounds() {
    if (isNaN(this.currentStartingYear)) return [];
    if (this.currentStartingYear === undefined) return [];
    if (this.currentStartingYear in this._cache) return this._cache[this.currentStartingYear];else {
      return this._cache[this.currentStartingYear] = this.educationService.At(this.currentStartingYear);
    }
  }
  get subtotal() {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a + ('Pick' in b ? b.Pick.Count : 1) * b.Quantity, 0) : 0;
  }
  get EducationLevels() {
    if (!this.currentBackground) return [];
    return (0,src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType).filter(edu => edu in this.currentBackground);
  }
  constructor(educationService, ref) {
    this.educationService = educationService;
    this.ref = ref;
    this.backgroundChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_7__.EventEmitter();
    this.complete = new _angular_core__WEBPACK_IMPORTED_MODULE_7__.EventEmitter();
    this.changed = new _angular_core__WEBPACK_IMPORTED_MODULE_7__.EventEmitter();
    this.affiliationChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_7__.EventEmitter();
    this.affYearChanged = new rxjs__WEBPACK_IMPORTED_MODULE_8__.ReplaySubject();
    this.Basic = src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic;
    this.Advanced = src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced;
    this.Special = src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special;
    this.EduCitation = {
      Book: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
      Page: 70
    };
    this.affChangeCitation = {
      Book: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
      Page: 53
    };
    this.Stage = 3;
    this._fixedBkgExp = [];
    this._fixedBasicExp = [];
    this._fixedAdvExp = [];
    this._fixedSpecExp = [];
    this._cache = {};
    this.subscriptions = [];
    this.newaffSubs = [];
    this.educationIndex = {};
    this.changeAffState = 'off';
    this.hasHideButton = false;
    this.visible = true;
  }
  ngOnInit() {
    this.subscriptions.push(this.language.subscribe(lang => {
      this.currentLanguage = lang;
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
      this.checkForComplete();
    }));
    this.subscriptions.push(this.endingYear.subscribe(year => {
      this.currentEndingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
    this.subscriptions.push(this.startingYear.subscribe(year => {
      this.currentStartingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.exp.choice.subscribe(_ => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.exp.completed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.changed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.complete.subscribe(_ => {
      this.checkForComplete();
    }));
  }
  ngOnDestroy() {
    [...this.subscriptions, ...this.newaffSubs].forEach(sub => sub.unsubscribe());
  }
  toggleVisibility(newState) {
    this.visible = newState;
  }
  checkForComplete() {
    this.ref.detectChanges();
    if (this.isComplete) {
      //this should probaly emit all the completed info
      this.complete.emit(this.experience);
      this.affYearChanged.next(this.affYear);
      this.hasHideButton = true;
    } else {
      this.hasHideButton = false;
      this.changed.emit();
    }
    this.ref.markForCheck();
  }
  currentBackgroundChanged(_) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    [this.lastEdu, this.nextEdu, this.basic].filter(edu => edu).forEach(edu => edu.nativeElement.selectedIndex === 0);
    this.update(src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic);
  }
  EduChanged(_, selected, level) {
    const eduType = src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType[selected];
    this.backgroundChanged.emit(this.currentBackground);
    const newexp = this.currentBackground[eduType].Options[this.educationIndex[level]].Skills.map(skill => {
      return {
        ...skill,
        Quantity: 30
      };
    });
    switch (level) {
      case src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic:
        this.fixedBasicExperience = newexp;
        break;
      case src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced:
        this.fixedAdvExperience = newexp;
        break;
      case src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special:
        this.fixedSpecExperience = newexp;
        break;
    }
    this.checkForComplete();
  }
  changeAffChanged(_) {
    switch (this.changeAffState) {
      case 'off':
        this.changeAffState = 'on';
        break;
      case 'on':
      default:
        this.changeAffState = 'off';
        break;
    }
    this.ref.detectChanges();
    switch (this.changeAffState) {
      case 'on':
        this.newaffSubs.push(this.newaff.changed.subscribe(_ => {
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.complete.subscribe(() => {
          this.affiliationChanged.emit(this.newaff.currentAffiliation);
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.affiliationChanged.subscribe(_ => {
          this.checkForComplete();
        }));
        break;
      case 'off':
      default:
        this.newaffSubs.forEach(sub => sub.unsubscribe());
        break;
    }
    this.ref.markForCheck();
  }
  eduLvl(lvl) {
    return src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType[lvl].toString();
  }
  asEduLvl(lvl) {
    return lvl;
  }
  excludeEduOpt(fields, toExclude) {
    return fields.filter(field => field.Name !== toExclude?.Name ?? '');
  }
  update(host) {
    const spec = () => {
      this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special] = undefined;
      this.fixedSpecExperience = [];
    };
    const adv = () => {
      this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced] = undefined;
      this.fixedAdvExperience = [];
      spec();
    };
    const basic = () => {
      this.educationIndex[src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic] = undefined;
      this.fixedBasicExperience = [];
      adv();
    };
    this.ref.markForCheck();
    switch (host) {
      case src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Special:
        spec();
        break;
      case src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Advanced:
        adv();
        break;
      case src_app_education_education__WEBPACK_IMPORTED_MODULE_1__.EducationType.Basic:
        basic();
        break;
    }
    this.ref.detectChanges();
  }
}
_class = Stage3Component;
_class.ɵfac = function Stage3Component_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_education_education_service__WEBPACK_IMPORTED_MODULE_2__.EducationService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-stage3"]],
  viewQuery: function Stage3Component_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c1, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c2, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c3, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c4, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c5, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c6, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c7, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c8, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c9, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.exp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.firstFieldExp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.secondFieldExp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.lastFieldExp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.basic = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.nextEdu = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.lastEdu = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.changeAff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.newaff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.rle = _t.first);
    }
  },
  inputs: {
    startingYear: "startingYear",
    endingYear: "endingYear",
    archtype: "archtype",
    affiliation: "affiliation",
    language: "language"
  },
  outputs: {
    backgroundChanged: "backgroundChanged",
    complete: "complete",
    changed: "changed",
    affiliationChanged: "affiliationChanged",
    affYearChanged: "affYearChanged"
  },
  decls: 31,
  vars: 20,
  consts: [["for", "toggleVisibilityStage3"], ["type", "button", "title", "toggleVisibilityStage3", "id", "toggleVisibilityStage3", "name", "toggleVisibilityStage3", 3, "value", "click", 4, "ngIf"], [3, "hidden"], ["for", "bkg"], ["title", "background", "name", "background", "id", "bkg", 3, "ngModel", "ngModelChange", "change"], ["hidden", "", "selected", "", "value", "", 3, "ngValue"], ["class", "opt", 3, "ngValue", "disabled", 4, "ngFor", "ngForOf"], [3, "values"], ["exp", ""], [4, "ngIf"], [3, "stage"], ["rle", ""], ["type", "button", "title", "toggleVisibilityStage3", "id", "toggleVisibilityStage3", "name", "toggleVisibilityStage3", 3, "value", "click"], [1, "opt", 3, "ngValue", "disabled"], ["for", "lvl-1"], ["id", "lvl-1", 3, "title", "name", "ngModel", "ngModelChange", "change"], ["basic", ""], ["class", "opt", 3, "ngValue", 4, "ngFor", "ngForOf"], ["firstFieldExp", ""], ["title", "nextEdu", "name", "nextEdu", "id", "nextEdu", 3, "change"], ["nextEdu", ""], [3, "ngValue"], [4, "ngIf", "ngIfElse"], ["ifAdv", ""], [1, "opt", 3, "ngValue"], ["title", "Basic-2", "id", "lvl-basic-2", 3, "name", "ngModel", "ngModelChange", "change"], ["adv1", ""], ["secondFieldExp", ""], ["title", "lastEdu-1", "name", "lastEdu-1", "id", "lastEdu-1", 3, "change"], ["lastEdu", ""], ["title", "Last-Adv-3", "id", "Last-lvl-3", 3, "name", "ngModel", "ngModelChange", "change"], ["last1", ""], ["lastFieldExp", ""], ["title", "Advanced-2", "id", "lvl-adv-2", 3, "name", "ngModel", "ngModelChange", "change"], ["adv2", ""], ["elseBlock", ""], ["title", "lastEdu-2", "name", "lastEdu-2", "id", "lastEdu-2", 3, "change"], ["title", "basic-3", "id", "lvl-3-basic", 3, "name", "ngModel", "ngModelChange", "change"], ["title", "spec-3", "id", "lvl-3", 3, "name", "ngModel", "ngModelChange", "change"], ["for", "changeAff"], ["type", "checkbox", "id", "changeAff", "name", "changeAff", "unchecked", "", 3, "value", "change"], ["changeAff", ""], [3, "excludedAffiliations", "currentYear", 4, "ngIf"], [3, "excludedAffiliations", "currentYear"], ["newaff", ""]],
  template: function Stage3Component_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "h1")(1, "label", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "Stage 3 - Higher Education");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](3, Stage3Component_input_3_Template, 1, 1, "input", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "div", 2)(5, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6, "Select an education background for your character.");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "span")(8, "form")(9, "label", 3)(10, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11, "Background");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](12, "select", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function Stage3Component_Template_select_ngModelChange_12_listener($event) {
        return ctx.currentBackgroundIndex = $event;
      })("change", function Stage3Component_Template_select_change_12_listener($event) {
        return ctx.currentBackgroundChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "option", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14, " -- select an option -- ");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](15, Stage3Component_option_15_Template, 2, 3, "option", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](17);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](18, "citation");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "h4");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](20);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](21, "app-exp", 7, 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](23, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](24);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](25, "citation");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](26, Stage3Component_div_26_Template, 40, 25, "div", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](27, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](28, "app-random-life-event", 10, 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](30, Stage3Component_ng_container_30_Template, 12, 6, "ng-container", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.hasHideButton);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("hidden", !ctx.visible);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("incomplete", ctx.currentBackgroundIndex === undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.currentBackgroundIndex);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngValue", undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.backgrounds);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("hidden", !ctx.currentBackground);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx.currentBackground ? _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](18, 16, ctx.currentBackground.Citation) : "", " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Subtotal: ", ctx.subtotal, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("values", ctx.fixedBackgroundExperience);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Now select the fields for each level of education. For rules ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](25, 18, ctx.EduCitation), "");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.currentBackground);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("hidden", !ctx.currentBackground);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("stage", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.currentBackground);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgForm, _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_3__.ExpComponent, _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_4__.NewaffComponent, _random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_5__.RandomLifeEventComponent, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_6__.CitationPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 11:
/*!***********************************************************!*\
  !*** ./src/app/chargen/stages/stage4/stage4.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stage4Component: () => (/* binding */ Stage4Component)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/utils/common */ 6555);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 5400);
/* harmony import */ var src_app_background_backgrounds_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/background/backgrounds.service */ 5961);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/exp/exp.component */ 8742);
/* harmony import */ var _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../newaff/newaff.component */ 2961);
/* harmony import */ var _random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../random-life-event/random-life-event.component */ 6364);
/* harmony import */ var _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/citation.pipe */ 419);
var _class;











const _c0 = ["exp"];
const _c1 = ["optionalexp"];
const _c2 = ["changeAff"];
const _c3 = ["newaff"];
const _c4 = ["rle"];
function Stage4Component_input_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function Stage4Component_input_3_Template_input_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r6.toggleVisibility(!ctx_r6.visible));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", ctx_r0.isComplete ? "hide" : "show");
  }
}
function Stage4Component_option_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const bkg_r8 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngValue", ctx_r1.backgrounds.indexOf(bkg_r8))("disabled", ctx_r1.currentStartingYear + bkg_r8.Duration > ctx_r1.currentEndingYear);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](bkg_r8.Name);
  }
}
function Stage4Component_ng_container_23_option_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "option", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const opt_r12 = ctx.$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngValue", ctx_r10.currentBackground == null ? null : ctx_r10.currentBackground.Options == null ? null : ctx_r10.currentBackground.Options.indexOf(opt_r12));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](opt_r12.Name);
  }
}
function Stage4Component_ng_container_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "span")(2, "form")(3, "label", 14)(4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, "Option");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "select", 15, 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function Stage4Component_ng_container_23_Template_select_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r14);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r13.currentBackgroundOptionIndex = $event);
    })("change", function Stage4Component_ng_container_23_Template_select_change_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r14);
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r15.currentBackgroundOptionChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9, " -- select an option -- ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](10, Stage4Component_ng_container_23_option_10_Template, 2, 2, "option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "div")(12, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](14, "app-exp", 7, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("incomplete", ctx_r3.currentBackgroundOptionIndex === undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx_r3.currentBackgroundOptionIndex);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx_r3.currentBackground == null ? null : ctx_r3.currentBackground.Options);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate2"]("", ctx_r3.currengBackgroundOption == null ? null : ctx_r3.currengBackgroundOption.Name, " Subtotal: ", ctx_r3.optionSubtotal, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("values", ctx_r3.fixedOptionExperience);
  }
}
function Stage4Component_ng_container_27_app_newaff_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "app-newaff", 24, 25);
  }
  if (rf & 2) {
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("excludedAffiliations", ctx_r17.exAff)("currentYear", ctx_r17.affYear);
  }
}
function Stage4Component_ng_container_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "h3")(2, "label", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Change affiliation?");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "input", 21, 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("change", function Stage4Component_ng_container_27_Template_input_change_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r20);
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r19.changeAffChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](8, "wbr");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](10, "citation");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](11, Stage4Component_ng_container_27_app_newaff_11_Template, 2, 2, "app-newaff", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", ctx_r5.changeAffState);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("This decision is optional. Characters affiliation change will happen at ", ctx_r5.affYear, " if elected to do so.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" For affiliation change rules ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](10, 4, ctx_r5.affChangeCitation), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r5.changeAffState === "on");
  }
}
const _c5 = function () {
  return [];
};
class Stage4Component {
  get isComplete() {
    const check = this.exp.isComplete && this.rle.isComplete;
    if (this.currentBackground && (this.currentBackground.Options?.length ?? 0) > 0) {
      if (!this.optionalexp.isComplete) return false;
    }
    if (this.changeAffState === 'off') return check;
    return (this.newaff?.isComplete ?? false) && check;
  }
  get exAff() {
    return this.affiliation ? [this.affiliation] : [];
  }
  get affYear() {
    return this.currentStartingYear + (this.currentBackground?.Duration ?? 0);
  }
  get experience() {
    return [...this.exp.experience, ...this.rle.experience, ...(this.currentBackgroundOptionIndex !== undefined ? this.optionalexp.experience : [])];
  }
  get Requirments() {
    return [];
  }
  get currentBackground() {
    return this.currentBackgroundIndex !== undefined ? this.backgrounds[this.currentBackgroundIndex] : undefined;
  }
  get currengBackgroundOption() {
    if (!this.currentBackground) return undefined;
    return this.currentBackgroundOptionIndex !== undefined ? this.currentBackground.Options?.[this.currentBackgroundOptionIndex] : undefined;
  }
  get backgrounds() {
    if (isNaN(this.currentStartingYear)) return [];
    if (this.currentStartingYear === undefined) return [];
    if (this.currentStartingYear in this._cache) return this._cache[this.currentStartingYear];else {
      return this._cache[this.currentStartingYear] = this.backgroundService.At(this.currentStartingYear, 4);
    }
  }
  get currentAffiliation() {
    return this.newaff?.currentAffiliation ?? this.affiliation;
  }
  FixExp(exp) {
    if ('Or' in exp || 'Pick' in exp || 'Set' in exp || 'If' in exp) return exp;
    switch (exp.Kind) {
      case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
        switch (exp.Skill) {
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
            if (exp.Subskill === '!') {
              exp.Subskill = this.currentAffiliation.Protocol.Subskill;
            }
            return exp;
          case src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
            if (exp.Subskill === '!' && !!this.currentLanguage) {
              exp.Subskill = this.currentLanguage.Subskill;
            }
            return exp;
          default:
            return exp;
        }
      default:
        return exp;
    }
  }
  get subtotal() {
    return this.currentBackground ? this.currentBackground.Experience.reduce((a, b) => a + ('Pick' in b ? b.Pick.Count : 1) * b.Quantity, 0) : 0;
  }
  get optionSubtotal() {
    return this.currengBackgroundOption ? this.currengBackgroundOption.Experience.reduce((a, b) => a + ('Pick' in b ? b.Pick.Count : 1) * b.Quantity, 0) : 0;
  }
  set fixedOptionExperience(values) {
    this.ref.markForCheck();
    this._fixedOptExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => this.FixExp(exp));
    this.ref.detectChanges();
  }
  get fixedOptionExperience() {
    if (this._fixedOptExp.length === 0 && this.currentBackground && (this.currentBackground?.Options ?? []).length > 0 && this.currengBackgroundOption) {
      this.fixedOptionExperience = this.currengBackgroundOption?.Experience ?? [];
    }
    return this._fixedOptExp;
  }
  set fixedBackgroundExperience(values) {
    this.ref.markForCheck();
    this._fixedBkgExp = values.map(exp => JSON.parse(JSON.stringify(exp))).map(exp => this.FixExp(exp));
    this.ref.detectChanges();
  }
  get fixedBackgroundExperience() {
    if (this._fixedBkgExp.length === 0 && this.currentBackground) {
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    }
    return this._fixedBkgExp;
  }
  constructor(backgroundService, ref) {
    this.backgroundService = backgroundService;
    this.ref = ref;
    this.backgroundChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.complete = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.changed = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.affiliationChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.affYearChanged = new rxjs__WEBPACK_IMPORTED_MODULE_7__.ReplaySubject();
    this.changeAffState = 'off';
    this.affChangeCitation = {
      Book: src_app_utils_common__WEBPACK_IMPORTED_MODULE_0__.Book.ATimeOfWar,
      Page: 53
    };
    this._cache = {};
    this._fixedOptExp = [];
    this._fixedBkgExp = [];
    this.subscriptions = [];
    this.newaffSubs = [];
    this.hasHideButton = false;
    this.visible = true;
  }
  toggleVisibility(newState) {
    this.visible = newState;
  }
  currentBackgroundChanged(_) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
    this.checkForComplete();
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  currentBackgroundOptionChanged(_) {
    this.backgroundChanged.emit(this.currentBackground);
    this.fixedOptionExperience = this.currengBackgroundOption?.Experience ?? [];
    this.checkForComplete();
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  checkForComplete() {
    this.ref.detectChanges();
    if (this.isComplete) {
      //this should probaly emit all the completed info
      this.complete.emit(this.experience);
      this.affYearChanged.next(this.affYear);
      this.hasHideButton = true;
    } else {
      this.hasHideButton = false;
      this.changed.emit();
    }
    this.ref.markForCheck();
  }
  ngOnInit() {
    this.subscriptions.push(this.language.subscribe(lang => {
      this.currentLanguage = lang;
      this.fixedBackgroundExperience = this.currentBackground?.Experience ?? [];
      this.checkForComplete();
    }));
    this.subscriptions.push(this.endingYear.subscribe(year => {
      this.currentEndingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
    this.subscriptions.push(this.startingYear.subscribe(year => {
      this.currentStartingYear = year;
      this.affYearChanged.next(this.affYear);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }));
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.exp.choice.subscribe(_ => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.exp.completed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.changed.subscribe(() => {
      this.checkForComplete();
    }));
    this.subscriptions.push(this.rle.complete.subscribe(_ => {
      this.checkForComplete();
    }));
  }
  ngOnDestroy() {
    [...this.subscriptions, ...this.newaffSubs].forEach(sub => sub.unsubscribe());
  }
  changeAffChanged(_) {
    switch (this.changeAffState) {
      case 'off':
        this.changeAffState = 'on';
        break;
      case 'on':
      default:
        this.changeAffState = 'off';
        break;
    }
    this.ref.detectChanges();
    switch (this.changeAffState) {
      case 'on':
        this.newaffSubs.push(this.newaff.changed.subscribe(_ => {
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.complete.subscribe(() => {
          this.affiliationChanged.emit(this.newaff.currentAffiliation);
          this.checkForComplete();
        }));
        this.newaffSubs.push(this.newaff.affiliationChanged.subscribe(_ => {
          this.checkForComplete();
        }));
        break;
      case 'off':
      default:
        this.newaffSubs.forEach(sub => sub.unsubscribe());
        break;
    }
    this.ref.markForCheck();
  }
}
_class = Stage4Component;
_class.ɵfac = function Stage4Component_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_background_backgrounds_service__WEBPACK_IMPORTED_MODULE_1__.BackgroundsService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_6__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-stage4"]],
  viewQuery: function Stage4Component_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c1, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c2, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c3, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c4, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.exp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.optionalexp = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.changeAff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.newaff = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.rle = _t.first);
    }
  },
  inputs: {
    startingYear: "startingYear",
    endingYear: "endingYear",
    archtype: "archtype",
    affiliation: "affiliation",
    language: "language"
  },
  outputs: {
    backgroundChanged: "backgroundChanged",
    complete: "complete",
    changed: "changed",
    affiliationChanged: "affiliationChanged",
    affYearChanged: "affYearChanged"
  },
  decls: 28,
  vars: 18,
  consts: [["for", "toggleVisibilityStage4"], ["type", "button", "title", "toggleVisibilityStage4", "id", "toggleVisibilityStage4", "name", "toggleVisibilityStage4", 3, "value", "click", 4, "ngIf"], [3, "hidden"], ["for", "bkg"], ["title", "background", "name", "background", "id", "bkg", 3, "ngModel", "ngModelChange", "change"], ["hidden", "", "disabled", "", "selected", "", "value", "", 3, "ngValue"], ["class", "opt", 3, "ngValue", "disabled", 4, "ngFor", "ngForOf"], [3, "values"], ["exp", ""], [4, "ngIf"], [3, "stage"], ["rle", ""], ["type", "button", "title", "toggleVisibilityStage4", "id", "toggleVisibilityStage4", "name", "toggleVisibilityStage4", 3, "value", "click"], [1, "opt", 3, "ngValue", "disabled"], ["for", "bkgopt"], ["title", "background Option", "name", "background option", "id", "bkgopt", 3, "ngModel", "ngModelChange", "change"], ["opt", ""], ["class", "opt", 3, "ngValue", 4, "ngFor", "ngForOf"], ["optionalexp", ""], [1, "opt", 3, "ngValue"], ["for", "changeAff"], ["type", "checkbox", "id", "changeAff", "name", "changeAff", "unchecked", "", 3, "value", "change"], ["changeAff", ""], [3, "excludedAffiliations", "currentYear", 4, "ngIf"], [3, "excludedAffiliations", "currentYear"], ["newaff", ""]],
  template: function Stage4Component_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "h1")(1, "label", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "Stage 4 - Higher Education");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](3, Stage4Component_input_3_Template, 1, 1, "input", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "div", 2)(5, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Select a background for your character.");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "span")(8, "form")(9, "label", 3)(10, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11, "Background");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "select", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function Stage4Component_Template_select_ngModelChange_12_listener($event) {
        return ctx.currentBackgroundIndex = $event;
      })("change", function Stage4Component_Template_select_change_12_listener($event) {
        return ctx.currentBackgroundChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "option", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](14, " -- select an option -- ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](15, Stage4Component_option_15_Template, 2, 3, "option", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](18, "citation");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](19, "h4");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](20);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](21, "app-exp", 7, 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](23, Stage4Component_ng_container_23_Template, 16, 8, "ng-container", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](25, "app-random-life-event", 10, 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](27, Stage4Component_ng_container_27_Template, 12, 6, "ng-container", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      let tmp_10_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.hasHideButton);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", !ctx.visible);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("incomplete", ctx.currentBackgroundIndex === undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.currentBackgroundIndex);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngValue", undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.backgrounds);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", !ctx.currentBackground);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ctx.currentBackground ? _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](18, 15, ctx.currentBackground.Citation) : "", " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("Subtotal: ", ctx.subtotal, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("values", ctx.fixedBackgroundExperience);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ((tmp_10_0 = ctx.currentBackground == null ? null : ctx.currentBackground.Options) !== null && tmp_10_0 !== undefined ? tmp_10_0 : _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](17, _c5)).length > 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("hidden", !ctx.currentBackground);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("stage", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.currentBackground);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgForm, _utils_exp_exp_component__WEBPACK_IMPORTED_MODULE_2__.ExpComponent, _newaff_newaff_component__WEBPACK_IMPORTED_MODULE_3__.NewaffComponent, _random_life_event_random_life_event_component__WEBPACK_IMPORTED_MODULE_4__.RandomLifeEventComponent, _utils_citation_pipe__WEBPACK_IMPORTED_MODULE_5__.CitationPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 676:
/*!************************************************!*\
  !*** ./src/app/education/education.service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EducationService: () => (/* binding */ EducationService)
/* harmony export */ });
/* harmony import */ var _education__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./education */ 9105);
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/common */ 6555);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _field_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./field.service */ 8695);
var _class;




class EducationService {
  constructor(fieldService) {
    this.fieldService = fieldService;
    this.Educations = [];
    const asOpts = names => {
      return names.map(name => {
        return {
          Name: name
        };
      });
    };
    const uniExtraReq = {
      Not: {
        Or: [{
          Stage: 2,
          Name: 'Preparatory School'
        }, {
          Stage: 1,
          Name: 'Nobility'
        }, {
          Stage: 1,
          Name: 'White Collar'
        }]
      }
    };
    const milAcadReq = {
      Not: {
        Or: [{
          Stage: 2,
          Name: 'Preparatory School'
        }, {
          Stage: 2,
          Name: 'Military School'
        }]
      }
    };
    this.Educations.push(new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'Technical College',
      Cost: 600,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped,
        Quantity: 150
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: '*',
        Quantity: 30
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 200
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 1,
        Options: asOpts(['Communications', 'Pilot - Aerospace (Civilian)', 'Pilot - Aircraft (Civilian)', 'Pilot - DropShip', 'Pilot - Exoskeleton', 'Technician - Civilian'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 2,
        Options: asOpts(['Cartographer', 'Engineer', 'Merchant Marine', 'Pilot - IndustrialMech', 'Pilot - JumpShip', 'Technician - Aerospace', "Technician - 'Mech", 'Technician - Vehicle'])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 72
      }
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'Trade School',
      Cost: 560,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 50
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).filter(att => att !== _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence).map(att => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
            Attribute: att
          };
        }),
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped,
        Quantity: 100
      }, {
        Pick: {
          Count: 3,
          Options: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })
        },
        Quantity: 20
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 200
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 1,
        Options: asOpts(['General Studies', 'Merchant'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 2,
        Options: asOpts(['Analysis', 'Anthropologist', 'Archaeologist', 'Cartographer', 'Communications', 'HPG Technician', 'Journalist', 'Manager', "Medical Assistant", 'Merchant Marine'])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 72
      }
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'University',
      Cost: 710,
      Prereq: {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Op: '>=',
        Level: 4
      },
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 150
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 75,
        If: uniExtraReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: -100,
        If: uniExtraReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 200
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 200,
        If: uniExtraReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -100,
        If: uniExtraReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -200
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -200,
        If: uniExtraReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: '*',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!',
        Quantity: 20
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 220
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 1,
        Options: asOpts(['Cartographer', 'Communications', 'General Studies', 'Manager', 'Scientist', 'Technician - Civilian'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 2,
        Options: asOpts(['Analysis', 'Anthropologist', 'Archaeologist', 'Detective', 'Engineer', 'HPG Technician', 'Planetary Surveyor', "Medical Assistant", 'Politician', 'Technician - Aerospace', 'Technician - Vehicle'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Special]: {
        Duration: 2,
        Options: asOpts(['Doctor', 'Lawyer', 'Military Scientist', "Technician - 'Mech", "Technician - Military"])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 72,
        Notes: ['Additional exp found in Prereq section is not currently applied.']
      } //TODO fix this
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2695, {
      Name: 'Solaris Internship',
      Cost: 700,
      Prereq: {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Op: '>=',
        Level: 2
      },
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
        Quantity: 150
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: 50
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).filter(att => ![_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge].includes(att)).map(att => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
            Attribute: att
          };
        }),
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Enemy,
        Quantity: -50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: 100
      }, {
        Or: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.VehicleLevel
        }],
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting,
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Solaris Games',
        Quantity: 30
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Streetwise,
        Subskill: 'Solaris',
        Quantity: 25
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 100
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 2,
        Options: asOpts(['Communications', 'Manager', 'Technician - Military'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 2,
        Options: asOpts(['Cavalry', 'Journalist', 'MechWarrior', 'Pilot - Battle Armor', 'Politician', "Technician - 'Mech"])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 72,
        Notes: ['Changed Streetwise skill to have Subskill of Solaris from any.', 'Changes introduction date based on data from sarna.net.']
      } //TODO fix this
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'Police Academy',
      Cost: 680,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Driving,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Driving.Ground,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!',
        Quantity: 25
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Streetwise,
        Subskill: '!',
        Quantity: 30
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 140
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 0.5,
        Options: asOpts(['Police Officer'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 1,
        Options: asOpts(['Analysis', 'Communications', 'Detective', 'Intelligence', "Technician - Military"])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Special]: {
        Duration: 2,
        Options: asOpts(['Covert Operations', 'Police Tactical Officer', 'Special Forces', 'Technician - Aerospace', 'Technician - Vehicle'])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 72,
        Notes: ['Changed Driving skill to have Subskill of Ground from none given.']
      }
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'Intelligence Operative Training',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 5
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
          Op: '>=',
          Level: 2
        }]
      },
      Cost: 760,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 150
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).filter(att => ![_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower].includes(att)).map(att => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
            Attribute: att
          };
        }),
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.AlternativeID,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 200
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.InForLife,
        Quantity: -300
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Rank,
        Quantity: 250
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers,
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!',
        Quantity: 20
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 150
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 1,
        Options: asOpts(['Basic Training'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 1,
        Options: asOpts(['Analysis', 'Covert Operations', 'Detective', 'Intelligence', "Police Officer", 'Scout'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Special]: {
        Duration: 2,
        Options: asOpts(['Police Tactical Officer', 'Special Forces'])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 72,
        Notes: ['Continued on page 73.']
      }
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'Military Academy',
      Cost: 830,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 100,
        If: milAcadReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: -100,
        If: milAcadReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 200,
        If: milAcadReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: -100,
        If: milAcadReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: -100,
        If: milAcadReq
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Strength,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Body,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
        Quantity: 125
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Rank,
        Quantity: 200
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Leadership,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Swimming,
        Quantity: 10
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 100
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 1,
        Options: asOpts(['Basic Training', 'Basic Training - Naval'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 1,
        Options: asOpts(['Analysis', 'Cavalry', 'Infantry', 'Marine', "MechWarrior", 'Pilot - Aerospace (Combat)', 'Pilot - Aircraft (Combat)', 'Pilot - Dropship', 'Scientist', 'Scout', "Ship's Crew"])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Special]: {
        Duration: 2,
        Options: asOpts(['Doctor', "Infantry - Anti 'Mech", 'Military Scientist', 'Pilot - Battle Armor', 'Pilot - Jumpship', 'Special Forces'])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 73
      }
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'Military Enlistment',
      Cost: 720,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Strength,
        Quantity: 125
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Body,
        Quantity: 125
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
        Quantity: -100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Rank,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Swimming,
        Quantity: 10
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 200
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 0.5,
        Options: asOpts(['Basic Training', 'Basic Training - Naval'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 1,
        Options: asOpts(['Cavalry', 'Infantry', 'Marine', 'Medical Assistant', 'Police Officer', 'Scout', "Ship's Crew", 'Technician - Military'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Special]: {
        Duration: 2,
        Options: asOpts(['Police Tactical Officer', "Infantry - Anti 'Mech", 'Special Forces', 'Technician - Aerospace', "Technican - 'Mech", 'Technician - Vehicle'])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 73
      }
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'Family Training',
      Prereq: {
        Or: [{
          Stage: 2,
          Name: 'Preparatory School'
        }, {
          Stage: 2,
          Name: 'Military School'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
          Op: '>=',
          Level: 1
        }]
      },
      Cost: 570,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Strength,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Body,
        Quantity: 75
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Rank,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Driving,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Driving.Ground,
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Homeworld History',
        Quantity: 20
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!',
        Quantity: 15
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Survival,
        Subskill: '*',
        Quantity: 20
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 100
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 0.5,
        Options: asOpts(['Basic Training', 'Basic Training - Naval'])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: {
        Duration: 1,
        Options: asOpts(['Cavalry', 'Infantry', 'Marine', 'MechWarrior', 'Pilot - Aerospace (Combat)', 'Pilot - Aircraft (Combat)', 'Pilot - Dropship', 'Scout', "Ship's Crew"])
      },
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Special]: {
        Duration: 2,
        Options: asOpts(["Infantry - Anti 'Mech", 'Special Forces', 'Pilot - Jumpship'])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 73,
        Notes: ['Changed Driving skill to have Subskill of Ground from none given.', 'Changed Survival skill to have Subskill of any from none given.']
      }
    }), new _education__WEBPACK_IMPORTED_MODULE_0__.Education(2398, {
      Name: 'Officer Candidate School',
      Prereq: {
        And: [{
          Or: ['Police Academy', 'Intelligence Operative Training', 'Military Academy', 'Military Enlistment', 'Family Training'].map(edu => {
            return {
              Stage: 3,
              Name: edu
            };
          })
        }, {
          Field: {
            Level: _education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic
          }
        }, {
          Field: {
            Level: _education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced
          }
        }]
      },
      Cost: 550,
      Experience: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Edge,
        Quantity: -200
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Connections,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Equipped,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Rank,
        Quantity: 250
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Reputation,
        Quantity: 50
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
        Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Wealth,
        Quantity: 100
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Leadership,
        Quantity: 10
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!',
        Quantity: 25
      }, {
        Set: {
          Options: [...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute).map(att => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: att
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait).map(trait => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
              Trait: trait
            };
          }), ...(0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill).map(skill => {
            return {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
              Skill: skill
            };
          })]
        },
        Quantity: 115
      }],
      [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: {
        Duration: 0.5,
        Options: asOpts(['Officer Training'])
      },
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 73,
        Notes: ['Changed Driving skill to have Subskill of Ground from none given.', 'Changed Survival skill to have Subskill of any from none given.']
      }
    }));
  }
  At(when) {
    //We want to make sure we use the most current version of the Fields
    const fields = this.fieldService.At(when);
    const edui = this.Educations.flatMap(edu => edu.At(when - 2398) ?? []);
    return edui.map(edu => {
      const names = {
        [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Basic]: [],
        [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Advanced]: [],
        [_education__WEBPACK_IMPORTED_MODULE_0__.EducationType.Special]: []
      };
      const partial = {
        ...edu
      };
      const types = {};
      (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_education__WEBPACK_IMPORTED_MODULE_0__.EducationType).forEach(type => {
        if (type in edu && edu[type] !== undefined) {
          const temp = edu[type];
          names[type] = (edu[type]?.Options ?? []).flatMap(_edu => _edu.Name);
          if (temp) {
            types[type] = {
              Duration: temp.Duration,
              Options: fields.filter(field => names[type].includes(field.Name))
            };
          }
        }
        ;
      });
      return {
        ...partial,
        ...types
      };
    });
  }
}
_class = EducationService;
_class.ɵfac = function EducationService_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_field_service__WEBPACK_IMPORTED_MODULE_2__.FieldService));
};
_class.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
  token: _class,
  factory: _class.ɵfac,
  providedIn: 'root'
});

/***/ }),

/***/ 9105:
/*!****************************************!*\
  !*** ./src/app/education/education.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Education: () => (/* binding */ Education),
/* harmony export */   EducationType: () => (/* binding */ EducationType)
/* harmony export */ });
class Education {
  constructor(when, info) {
    this.when = when;
    this.info = info;
    this.timeline = {};
    const date = when - 2398;
    if (date > 0) {
      this.timeline[0] = [{
        Kind: EducationEvent.Disallow
      }];
    }
    this.timeline[date] = [{
      Kind: EducationEvent.Allowed,
      ...info
    }];
  }
  RemoveField(when, type, name, citation) {
    this.timeline[when - 2398] = [...(this.timeline[when - 2398] ?? []), {
      Kind: EducationEvent.FieldRemoved,
      [type]: {
        Options: [{
          Name: name
        }]
      },
      Citation: citation
    }];
    return this;
  }
  AddField(when, type, field, citation) {
    this.timeline[when - 2398] = [...(this.timeline[when - 2398] ?? []), {
      Kind: EducationEvent.FieldAdded,
      [type]: {
        Options: [field]
      },
      Citation: citation
    }];
    return this;
  }
  At(when) {
    const importantDates = Object.keys(this.timeline).filter(key => +key <= when).sort((a, b) => +a - +b).map(key => +key).filter(date => this.timeline[date]?.some(event => event.Kind === EducationEvent.Allowed || event.Kind === EducationEvent.Disallow)).reverse();
    const latest = importantDates.pop();
    if (latest === undefined) throw new Error(); //this means dates is empty and latest is undefined, which means there is no defined founding, which is bad.
    if (!this.timeline[latest]?.some(date => date.Kind === EducationEvent.Allowed)) {
      //this means that the most recent education event is that it disallowed, which means if that date is before now (which it must be because above) then there is no field to return
      return undefined;
    }
    //build the education between 'latest' and 'when'
    const dates = Object.keys(this.timeline).filter(key => +key >= latest && +key <= when).sort((a, b) => +a - +b).map(key => +key);
    //this is the actual data, just unprocssed
    const events = dates.flatMap(date => this.timeline[date]?.filter(event => event.Kind === EducationEvent.Allowed || event.Kind === EducationEvent.Modify));
    const initial = [...dates].shift();
    if (initial === undefined) throw new Error();
    const start = this.timeline[initial]?.filter(date => date.Kind === EducationEvent.Allowed)[0];
    const remove = (sofar, values) => {
      if (!sofar) return undefined;
      if (values.length === 0) return sofar;
      const names = values.map(value => value.Name);
      return {
        Duration: sofar.Duration,
        Options: sofar.Options.filter(field => !names.includes(field.Name))
      };
    };
    const add = (sofar, values) => {
      if (!sofar) return undefined;
      if (values.length === 0) return sofar;
      return {
        Duration: sofar.Duration,
        Options: [...sofar.Options, ...values]
      };
    };
    const process = sofar => {
      const current = events.shift();
      if (!current) return sofar;
      switch (current.Kind) {
        case EducationEvent.Allowed:
        case EducationEvent.Modify:
          return process({
            Name: current.Name ?? sofar.Name,
            Prereq: current.Prereq ?? sofar.Prereq,
            Cost: current.Cost ?? sofar.Cost,
            Experience: current.Experience ?? sofar.Experience,
            Citation: current.Citation ?? sofar.Citation,
            [EducationType.Basic]: sofar[EducationType.Basic],
            [EducationType.Advanced]: sofar[EducationType.Advanced],
            [EducationType.Special]: sofar[EducationType.Special]
          });
        case EducationEvent.Disallow:
          return undefined;
        case EducationEvent.FieldAdded:
          return process({
            Name: sofar.Name,
            Prereq: sofar.Prereq,
            Cost: sofar.Cost,
            Experience: sofar.Experience,
            Citation: sofar.Citation,
            [EducationType.Basic]: add(sofar[EducationType.Basic], EducationType.Basic in current ? current[EducationType.Basic]?.Options ?? [] : []),
            [EducationType.Advanced]: add(sofar[EducationType.Advanced], EducationType.Advanced in current ? current[EducationType.Advanced]?.Options ?? [] : []),
            [EducationType.Special]: add(sofar[EducationType.Special], EducationType.Special in current ? current[EducationType.Special]?.Options ?? [] : [])
          });
        case EducationEvent.FieldRemoved:
          return process({
            Name: sofar.Name,
            Prereq: sofar.Prereq,
            Cost: sofar.Cost,
            Experience: sofar.Experience,
            Citation: sofar.Citation,
            [EducationType.Basic]: remove(sofar[EducationType.Basic], EducationType.Basic in current ? current[EducationType.Basic]?.Options ?? [] : []),
            [EducationType.Advanced]: remove(sofar[EducationType.Advanced], EducationType.Advanced in current ? current[EducationType.Advanced]?.Options ?? [] : []),
            [EducationType.Special]: remove(sofar[EducationType.Special], EducationType.Special in current ? current[EducationType.Special]?.Options ?? [] : [])
          });
      }
    };
    const ret = process({
      Name: start.Name,
      Prereq: start.Prereq,
      Cost: start.Cost,
      Experience: start.Experience,
      Citation: start.Citation,
      [EducationType.Basic]: start[EducationType.Basic],
      [EducationType.Advanced]: start[EducationType.Advanced],
      [EducationType.Special]: start[EducationType.Special]
    });
    return ret;
  }
}
var EducationType;
(function (EducationType) {
  EducationType[EducationType["Basic"] = 0] = "Basic";
  EducationType[EducationType["Advanced"] = 1] = "Advanced";
  EducationType[EducationType["Special"] = 2] = "Special";
})(EducationType || (EducationType = {}));
var EducationEvent;
(function (EducationEvent) {
  EducationEvent[EducationEvent["Allowed"] = 0] = "Allowed";
  EducationEvent[EducationEvent["Disallow"] = 1] = "Disallow";
  EducationEvent[EducationEvent["Modify"] = 2] = "Modify";
  EducationEvent[EducationEvent["FieldAdded"] = 3] = "FieldAdded";
  EducationEvent[EducationEvent["FieldRemoved"] = 4] = "FieldRemoved";
})(EducationEvent || (EducationEvent = {}));

/***/ }),

/***/ 8695:
/*!********************************************!*\
  !*** ./src/app/education/field.service.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FieldService: () => (/* binding */ FieldService)
/* harmony export */ });
/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./field */ 7467);
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/common */ 6555);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;



class FieldService {
  constructor() {
    this.Fields = [];
    this.Fields.push(new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Anthropology',
      Prereq: {
        And: [{
          Field: 'General Studies'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Anthropologist'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: /History of $1/
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Investigation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '*'
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Archaeologist',
      Prereq: {
        And: [{
          Field: 'General Studies'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Archaeologist'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Appraisal
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Geology'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: /History of $1/
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Ground
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Cartographer',
      Prereq: {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Op: '>=',
        Level: 4
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Cartographer'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Air
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Ground
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Communications',
      Prereq: {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Op: '>=',
        Level: 4
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Communications'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Doctor',
      Prereq: {
        And: [{
          Or: ['Medical Assistant', 'Scientist'].map(req => {
            return {
              Field: req
            };
          })
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 5
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Administration
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Doctor'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.MedTech.General
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Surgery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Surgery.General
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82,
        Notes: ['Added subskill General for MedTech as none was provided.', 'Added subskill General for Surgery as none was provided.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Engineer',
      Prereq: {
        And: [{
          Or: ['Civilian', 'Military'].map(req => {
            return {
              Field: `Technician - ${req}`
            };
          })
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Appraisal
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Engineer'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Nuclear
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician).filter(sub => sub !== _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Nuclear).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
            Subskill: sub
          };
        })
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82,
        Notes: ['Removed subskill Nuclear for Technician so it is not duplicated.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'General Studies',
      Prereq: {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Op: '>=',
        Level: 3
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!'
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82,
        Notes: ['Ignored part that reads "at least one other Skill related to those shown below" because is was unclear.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'HPG Technician',
      Prereq: {
        And: [{
          Or: [...['ComStar', 'Word of Blake'].map(aff => {
            return {
              Affiliation: aff
            };
          }), {
            IsClanner: true
          }]
        }, {
          Field: 'Communications'
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Administration
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.BlackBox
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Cryptography
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Journalist',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Art,
        Subskill: 'Writing'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Journalist'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Investigation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Lawyer',
      Prereq: {
        And: [{
          Field: 'General Studies'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 5
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Administration
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Lawyer'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Law'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '*'
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Manager',
      Prereq: {
        And: [{
          Field: 'General Studies'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Administration
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Management'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Leadership
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Training
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82,
        Notes: ['Reduced Intelligence requirment to 3 from 5.', 'Reduced Charisma requirment to 3 from 5.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Medical Assistant',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'MedTech'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Pharmacology'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.MedTech.General
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82,
        Notes: ['Added subskill General for MedTech as none was provided.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Merchant',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Administration
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Appraisal
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Merchant'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Streetwise,
        Subskill: '*'
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82,
        Notes: ['Added subskill General for MedTech as none was provided.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Merchant Marine',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.TDS,
          Op: '=',
          Level: 0
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Merchant Marine'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Aeronautics
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician).filter(sub => sub !== _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Aeronautics).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ZeroGOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82,
        Notes: ['Removed subskill Aeronautics for Technician so it is not duplicated.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Pilot - Aerospace (Civilian)',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Aerospace Pilot'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Air
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Space
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Aerospace
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 82,
        Notes: ['Removed subskill Aeronautics for Technician so it is not duplicated.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Pilot - Aircraft (Civilian)',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Aircraft Pilot'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Air
      }, {
        Or: [_utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Aircraft, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.VTOL].map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Pilot - DropShip',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.TDS,
          Op: '=',
          Level: 0
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'DropShip Pilot'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Space
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Spacecraft
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ZeroGOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Pilot - Exoskeleton',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Strength,
          Op: '>=',
          Level: 5
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Body,
          Op: '>=',
          Level: 5
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Battlesuit
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, ...[_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Electronics, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Mechanical, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Myomer].map(sub => {
        return {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
          Subskill: sub
        };
      })],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Pilot - IndustrialMech',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Mech
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, ...[_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Electronics, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Mechanical, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Myomer].map(sub => {
        return {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
          Subskill: sub
        };
      })],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Pilot - JumpShip',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 5
        }, {
          Field: 'Pilot - DropShip'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.TDS,
          Op: '=',
          Level: 0
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Administration
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.KFJump
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Space
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Planetary Surveyor',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 6
        }, {
          Field: 'Scientist'
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Appraisal
      }, {
        Or: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Driving,
          Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Driving.Ground
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Driving,
          Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Driving.Sea
        }]
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Ground
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Survival,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tracking,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tracking.Wilds
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83,
        Notes: ['Excluded subskill Rail for Driving skill choice.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Politician',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Charisma,
          Op: '>=',
          Level: 4
        }, {
          Field: 'Manager'
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Politician'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Leadership
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!'
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Scientist',
      Prereq: {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
        Op: '>=',
        Level: 4
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Politician'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Leadership
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Negotiation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!'
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Technician - Aerospace',
      Prereq: {
        And: [{
          Or: ['Civilian', 'Military'].map(req => {
            return {
              Field: `Technician - ${req}`
            };
          })
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, ...[_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Aeronautics, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Nuclear, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Jets].map(sub => {
        return {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
          Subskill: sub
        };
      }), {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ZeroGOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: 'Technician - Civilian',
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Appraisal
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Technician'
      }, ...[_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Electronics, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Mechanical, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Nuclear].map(sub => {
        return {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
          Subskill: sub
        };
      }), {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ZeroGOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Technician - 'Mech",
      Prereq: {
        And: [{
          Or: ['Civilian', 'Military'].map(req => {
            return {
              Field: `Technician - ${req}`
            };
          })
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Electronics, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Jets, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Mechanical, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Myomer, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Nuclear].map(sub => {
        return {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
          Subskill: sub
        };
      }),
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Technician - Vehicle",
      Prereq: {
        And: [{
          Or: ['Civilian', 'Military'].map(req => {
            return {
              Field: `Technician - ${req}`
            };
          })
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, ...[_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Electronics, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Mechanical, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Nuclear].map(sub => {
        return {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
          Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
          Subskill: sub
        };
      })],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Analysis",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 4
        }, {
          Or: [{
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
            Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
            Op: '>=',
            Level: 4
          }, {
            And: [{
              Field: 'Police Officer'
            }, {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
              Op: '>=',
              Level: 3
            }]
          }]
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Cryptography
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Strategy
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
            Subskill: sub
          };
        })
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Covert Operations",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 4
        }, {
          Or: [{
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
            Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
            Op: '>=',
            Level: 4
          }, {
            And: [{
              Field: 'Police Officer'
            }, {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
              Op: '>=',
              Level: 3
            }]
          }]
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.EscapeArtist
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Strategy
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Streetwise,
        Subskill: '!'
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Tracking).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tracking,
            Subskill: sub
          };
        })
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Detective",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 4
        }, {
          Or: [{
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
            Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
            Op: '>=',
            Level: 4
          }, {
            And: [{
              Field: 'Police Officer'
            }, {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
              Op: '>=',
              Level: 3
            }]
          }]
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Detective'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interrogation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Investigation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.SecuritySystem).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SecuritySystem,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Streetwise,
        Subskill: '!'
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83,
        Notes: ['Added subskill options for Security System as none was provided.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Intelligence",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 4
        }, {
          Or: [{
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
            Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
            Op: '>=',
            Level: 4
          }, {
            And: [{
              Field: 'Police Officer'
            }, {
              Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
              Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
              Op: '>=',
              Level: 3
            }]
          }]
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Cryptography
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Investigation
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: '*'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Police Officer",
      Prereq: {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
        Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
        Op: '>=',
        Level: 3
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acting
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Police'
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Driving).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Driving,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.MedTech.General
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SmallArms
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Streetwise,
        Subskill: '!'
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83,
        Notes: ['Added subskill General for MedTech as none was provided.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Police Tactical Officer",
      Prereq: {
        And: [{
          Field: 'Police Officer'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Climbing
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Demolitions
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Running
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SupportWeapons
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics.Infantry
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ThrownWeapons
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tracking,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tracking.Urban
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 83
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Basic Training",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Rank,
          Op: '>',
          Level: 0
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Soldier'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.MedTech.General
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Ground
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SmallArms
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84,
        Notes: ['Added subskill General for MedTech as none was provided.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Basic Training - Naval",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Rank,
          Op: '>',
          Level: 0
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.TDS,
          Op: '<=',
          Level: 0
        }]
      },
      Skills: [{
        Or: ['Pilot', "Ship's Crew"].map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MedTech,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.MedTech.General
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Space
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SmallArms
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ZeroGOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84,
        Notes: ['Added subskill General for MedTech as none was provided.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Cavalry",
      Prereq: {
        And: [{
          Or: [{
            Field: 'Basic Training'
          }, {
            Stage: 3,
            Name: 'Solaris Internship'
          }]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Artillery
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Driving).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Driving,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Gunnery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Gunnery.Ground
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics.Land
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Mechanical
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84,
        Notes: ['Added subskill General for MedTech as none was provided.', 'Changed Gunnery subskill from "Any Vehicle" to Ground.', 'Removed Tactics subskill option of Sea.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Infantry",
      Prereq: {
        Field: 'Basic Training'
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acrobatics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Acrobatics.FreeFall
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Artillery
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Climbing
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SupportWeapons
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics.Infantry
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Infantry - Anti 'Mech",
      Prereq: {
        And: [{
          Field: 'Infantry'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 5
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acrobatics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Acrobatics.Gymnastics
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Demolitions
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Perception
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SecuritySystem,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.SecuritySystem.Electrical
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Mechanical
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Myomer
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Marine",
      Prereq: {
        And: [{
          Field: 'Basic Training - Naval'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.TDS,
          Op: '<=',
          Level: 0
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acrobatics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Acrobatics.FreeFall
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Demolitions
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Gunnery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Gunnery.Spacecraft
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.SecuritySystem).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SecuritySystem,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ZeroGOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2439, {
      Name: "MechWarrior",
      Prereq: {
        And: [{
          Or: [{
            Field: 'Basic Training'
          }, {
            Stage: 3,
            Name: 'Solaris Internship'
          }]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 4
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Gunnery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Gunnery.Mech
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Mech
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics.Land
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician).filter(sub => ![_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Aeronautics, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Cybernetics].includes(sub)).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
            Subskill: sub
          };
        })
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84,
        Notes: ['Removed Technican subskill options of Aeronautics and Cybernetics.', 'Changes introduction date based on data from sarna.net.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Military Scientist",
      Prereq: {
        And: [{
          Field: 'Analysis'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 5
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: 'Military Scientist'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Cryptography
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Interest,
        Subskill: 'Military History'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Strategy
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
            Subskill: sub
          };
        })
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Officer",
      Prereq: {
        And: [{
          Or: [{
            Field: 'Basic Training'
          }, {
            Field: 'Basic Training - Naval'
          }]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Rank,
          Op: '>=',
          Level: 1
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Administration
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Leadership
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MeleeWeapons
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Training
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Pilot - Aerospace (Combat)",
      Prereq: {
        And: [{
          Or: [{
            Field: 'Basic Training'
          }, {
            Field: 'Basic Training - Naval'
          }]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.TDS,
          Op: '<=',
          Level: 0
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Gunnery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Gunnery.Aerospace
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Air
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Space
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Aerospace
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics.Space
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ZeroGOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84,
        Notes: ['Add requirement to not have TDS trait.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Pilot - Aircraft (Combat)",
      Prereq: {
        And: [{
          Or: [{
            Field: 'Basic Training'
          }, {
            Field: 'Basic Training - Naval'
          }]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Gunnery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Gunnery.Air
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Air
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting).filter(sub => [_utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Aircraft, _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.VTOL].includes(sub)).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics.Air
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2720, {
      Name: "Pilot - Battle Armor",
      Prereq: {
        And: [{
          Or: [{
            Field: 'Infantry'
          }, {
            Stage: 3,
            Name: 'Solaris Internship'
          }]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Strength,
          Op: '>=',
          Level: 6
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Body,
          Op: '>=',
          Level: 5
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Climbing
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Gunnery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Gunnery.Battlesuit
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.MartialArts
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Piloting,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Piloting.Battlesuit
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SensorOperations
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics.Land
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84,
        Notes: ['Changes introduction date based on data from sarna.net.']
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Pilot - Warship",
      Prereq: {
        And: [{
          Field: 'Pilot - DropShip'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 6
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.TDS,
          Op: '<=',
          Level: 0
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Leadership
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.KFJump
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Navigation,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Navigation.Space
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Protocol,
        Subskill: '!'
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Strategy
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tactics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Tactics.Space
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Scout",
      Prereq: {
        And: [{
          Field: 'Basic Training'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.Illiterate,
          Op: '<=',
          Level: 0
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Communications,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Communications.Conventional
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Disguise
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Language,
        Subskill: '*'
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.SecuritySystem).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SecuritySystem,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Stealth
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Streetwise,
        Subskill: '*'
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Tracking).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tracking,
            Subskill: sub
          };
        })
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Ship's Crew",
      Prereq: {
        And: [{
          Field: 'Basic Training - Naval'
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Trait,
          Trait: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Trait.TDS,
          Op: '<=',
          Level: 0
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: "Ship's Crew"
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Computers
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Gunnery,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Gunnery.Spacecraft
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
            Subskill: sub
          };
        })
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.ZeroGOperations
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Special Forces",
      Prereq: {
        And: [{
          Or: [{
            Field: 'Infantry'
          }, {
            Field: 'MechWarrior'
          }, {
            Field: 'Scout'
          }]
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Body,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Reflexes,
          Op: '>=',
          Level: 4
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Willpower,
          Op: '>=',
          Level: 5
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Acrobatics,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Acrobatics.FreeFall
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Demolitions
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.SmallArms
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Stealth
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Survival,
        Subskill: '*'
      }, {
        Or: (0,_utils_common__WEBPACK_IMPORTED_MODULE_1__.EnumMap)(_utils_common__WEBPACK_IMPORTED_MODULE_1__.Tracking).map(sub => {
          return {
            Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
            Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Tracking,
            Subskill: sub
          };
        })
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }), new _field__WEBPACK_IMPORTED_MODULE_0__.Field(2398, {
      Name: "Technician - Military",
      Prereq: {
        And: [{
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Intelligence,
          Op: '>=',
          Level: 3
        }, {
          Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Attribute,
          Attribute: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Attribute.Dexterity,
          Op: '>=',
          Level: 3
        }]
      },
      Skills: [{
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Appraisal
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Career,
        Subskill: "Technician"
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Electronics
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Mechanical
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Nuclear
      }, {
        Kind: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Statistic.Skill,
        Skill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Skill.Technician,
        Subskill: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Technician.Weapons
      }],
      Citation: {
        Book: _utils_common__WEBPACK_IMPORTED_MODULE_1__.Book.ATimeOfWar,
        Page: 84
      }
    }));
  }
  At(when) {
    return this.Fields.flatMap(field => field.At(when - 2398) ?? []);
  }
}
_class = FieldService;
_class.ɵfac = function FieldService_Factory(t) {
  return new (t || _class)();
};
_class.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: _class,
  factory: _class.ɵfac,
  providedIn: 'root'
});

/***/ }),

/***/ 7467:
/*!************************************!*\
  !*** ./src/app/education/field.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Field: () => (/* binding */ Field)
/* harmony export */ });
class Field {
  constructor(when, field) {
    this.when = when;
    this.field = field;
    this.timeline = {};
    const date = when - 2398;
    if (date > 0) {
      this.timeline[0] = [{
        Kind: FieldEvent.Disallow
      }];
    }
    this.timeline[date] = [{
      Kind: FieldEvent.Allowed,
      ...field
    }];
  }
  At(when) {
    const importantDates = Object.keys(this.timeline).filter(key => +key <= when).sort((a, b) => +a - +b).map(key => +key).filter(date => this.timeline[date]?.some(event => event.Kind === FieldEvent.Allowed || event.Kind === FieldEvent.Disallow)).reverse();
    const latest = importantDates.pop();
    if (latest === undefined) throw new Error(); //this means dates is empty and latest is undefined, which means there is no defined founding, which is bad.
    if (!this.timeline[latest]?.some(date => date.Kind === FieldEvent.Allowed)) {
      //this means that the most recent field event is that it disallowed, which means if that date is before now (which it must be because above) then there is no field to return
      return undefined;
    }
    //build the field between 'latest' and 'when'
    const dates = Object.keys(this.timeline).filter(key => +key >= latest && +key <= when).sort((a, b) => +a - +b).map(key => +key);
    //this is the actual data, just unprocssed
    const events = dates.flatMap(date => this.timeline[date]?.filter(event => event.Kind === FieldEvent.Allowed || event.Kind === FieldEvent.Modify));
    const initial = [...dates].shift();
    if (initial === undefined) throw new Error();
    const start = this.timeline[initial]?.filter(date => date.Kind === FieldEvent.Allowed)[0];
    const process = sofar => {
      const current = events.shift();
      if (!current) return sofar;
      switch (current.Kind) {
        case FieldEvent.Allowed:
        case FieldEvent.Modify:
          return process({
            Name: current.Name ?? sofar.Name,
            Prereq: current.Prereq ?? sofar.Prereq,
            Skills: current.Skills ?? sofar.Skills,
            Citation: current.Citation ?? sofar.Citation
          });
        case FieldEvent.Disallow:
          return undefined;
      }
    };
    const ret = process({
      Name: start.Name,
      Prereq: start.Prereq,
      Skills: start.Skills,
      Citation: start.Citation
    });
    return ret;
  }
}
var FieldEvent;
(function (FieldEvent) {
  FieldEvent[FieldEvent["Allowed"] = 0] = "Allowed";
  FieldEvent[FieldEvent["Disallow"] = 1] = "Disallow";
  FieldEvent[FieldEvent["Modify"] = 2] = "Modify";
})(FieldEvent || (FieldEvent = {}));

/***/ }),

/***/ 5782:
/*!****************************************!*\
  !*** ./src/app/utils/archtype.pipe.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArchtypePipe: () => (/* binding */ ArchtypePipe)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ 6555);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;


class ArchtypePipe {
  transform(value) {
    const ret = _common__WEBPACK_IMPORTED_MODULE_0__.Archtype[value].replace(/([A-Z]+)/g, ' $1').trim();
    return ret;
  }
}
_class = ArchtypePipe;
_class.ɵfac = function ArchtypePipe_Factory(t) {
  return new (t || _class)();
};
_class.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({
  name: "archtype",
  type: _class,
  pure: true
});

/***/ }),

/***/ 419:
/*!****************************************!*\
  !*** ./src/app/utils/citation.pipe.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CitationPipe: () => (/* binding */ CitationPipe)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ 6555);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;


class CitationPipe {
  transform(value) {
    if (!value) {
      return 'No Citation given!';
    } else {
      const book = _common__WEBPACK_IMPORTED_MODULE_0__.Book[value.Book].replace(/([A-Z])/g, ' $1').replace(/([0-9]+)/g, '-$1').trim();
      return `See ${book}, pg: ${value.Page}`;
    }
  }
}
_class = CitationPipe;
_class.ɵfac = function CitationPipe_Factory(t) {
  return new (t || _class)();
};
_class.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({
  name: "citation",
  type: _class,
  pure: true
});

/***/ }),

/***/ 6555:
/*!*********************************!*\
  !*** ./src/app/utils/common.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Acrobatics: () => (/* binding */ Acrobatics),
/* harmony export */   AnimalHandling: () => (/* binding */ AnimalHandling),
/* harmony export */   Archtype: () => (/* binding */ Archtype),
/* harmony export */   Attribute: () => (/* binding */ Attribute),
/* harmony export */   Book: () => (/* binding */ Book),
/* harmony export */   Communications: () => (/* binding */ Communications),
/* harmony export */   CreatureSkill: () => (/* binding */ CreatureSkill),
/* harmony export */   CreatureTrait: () => (/* binding */ CreatureTrait),
/* harmony export */   Driving: () => (/* binding */ Driving),
/* harmony export */   EnumMap: () => (/* binding */ EnumMap),
/* harmony export */   Gunnery: () => (/* binding */ Gunnery),
/* harmony export */   MedTech: () => (/* binding */ MedTech),
/* harmony export */   Navigation: () => (/* binding */ Navigation),
/* harmony export */   Piloting: () => (/* binding */ Piloting),
/* harmony export */   PlantSkill: () => (/* binding */ PlantSkill),
/* harmony export */   PlantTrait: () => (/* binding */ PlantTrait),
/* harmony export */   Prestidigitation: () => (/* binding */ Prestidigitation),
/* harmony export */   SecuritySystem: () => (/* binding */ SecuritySystem),
/* harmony export */   Skill: () => (/* binding */ Skill),
/* harmony export */   Statistic: () => (/* binding */ Statistic),
/* harmony export */   Surgery: () => (/* binding */ Surgery),
/* harmony export */   Tactics: () => (/* binding */ Tactics),
/* harmony export */   Technician: () => (/* binding */ Technician),
/* harmony export */   ThrownWeapons: () => (/* binding */ ThrownWeapons),
/* harmony export */   Tracking: () => (/* binding */ Tracking),
/* harmony export */   Trait: () => (/* binding */ Trait),
/* harmony export */   clamp: () => (/* binding */ clamp)
/* harmony export */ });
function EnumMap(values) {
  return [...Array(1 + Math.max(...Object.values(values).map(v => +v).filter(v => +v))).keys()];
}
function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
var Statistic;
(function (Statistic) {
  Statistic[Statistic["Attribute"] = 0] = "Attribute";
  Statistic[Statistic["Trait"] = 1] = "Trait";
  Statistic[Statistic["Skill"] = 2] = "Skill";
})(Statistic || (Statistic = {}));
var Attribute;
(function (Attribute) {
  Attribute[Attribute["Strength"] = 0] = "Strength";
  Attribute[Attribute["Body"] = 1] = "Body";
  Attribute[Attribute["Dexterity"] = 2] = "Dexterity";
  Attribute[Attribute["Reflexes"] = 3] = "Reflexes";
  Attribute[Attribute["Intelligence"] = 4] = "Intelligence";
  Attribute[Attribute["Willpower"] = 5] = "Willpower";
  Attribute[Attribute["Charisma"] = 6] = "Charisma";
  Attribute[Attribute["Edge"] = 7] = "Edge";
})(Attribute || (Attribute = {}));
var Trait;
(function (Trait) {
  Trait[Trait["AlternativeID"] = 0] = "AlternativeID";
  Trait[Trait["Ambidextrous"] = 1] = "Ambidextrous";
  Trait[Trait["AnimalEmpathy"] = 2] = "AnimalEmpathy";
  Trait[Trait["Attractive"] = 3] = "Attractive";
  Trait[Trait["Citizenship"] = 4] = "Citizenship";
  Trait[Trait["Trueborn"] = 5] = "Trueborn";
  Trait[Trait["CombatSense"] = 6] = "CombatSense";
  Trait[Trait["Connections"] = 7] = "Connections";
  Trait[Trait["ExceptionalAttribute"] = 8] = "ExceptionalAttribute";
  Trait[Trait["FastLearner"] = 9] = "FastLearner";
  Trait[Trait["Fit"] = 10] = "Fit";
  Trait[Trait["GTolerance"] = 11] = "GTolerance";
  Trait[Trait["GoodHearing"] = 12] = "GoodHearing";
  Trait[Trait["GoodVision"] = 13] = "GoodVision";
  Trait[Trait["Gregarious"] = 14] = "Gregarious";
  Trait[Trait["Implant"] = 15] = "Implant";
  Trait[Trait["Prosthetic"] = 16] = "Prosthetic";
  Trait[Trait["NaturalAptitude"] = 17] = "NaturalAptitude";
  Trait[Trait["PainResistance"] = 18] = "PainResistance";
  Trait[Trait["Patient"] = 19] = "Patient";
  Trait[Trait["Phenotype"] = 20] = "Phenotype";
  Trait[Trait["PoisonResistance"] = 21] = "PoisonResistance";
  Trait[Trait["Property"] = 22] = "Property";
  Trait[Trait["Rank"] = 23] = "Rank";
  Trait[Trait["SixthSense"] = 24] = "SixthSense";
  Trait[Trait["TechEmpathy"] = 25] = "TechEmpathy";
  Trait[Trait["ThickSkinned"] = 26] = "ThickSkinned";
  Trait[Trait["Title"] = 27] = "Title";
  Trait[Trait["Bloodname"] = 28] = "Bloodname";
  Trait[Trait["Toughness"] = 29] = "Toughness";
  Trait[Trait["AnimalAntipathy"] = 30] = "AnimalAntipathy";
  Trait[Trait["Bloodmark"] = 31] = "Bloodmark";
  Trait[Trait["CombatParalysis"] = 32] = "CombatParalysis";
  Trait[Trait["Compulsion"] = 33] = "Compulsion";
  Trait[Trait["DarkSecret"] = 34] = "DarkSecret";
  Trait[Trait["Enemy"] = 35] = "Enemy";
  Trait[Trait["GlassJaw"] = 36] = "GlassJaw";
  Trait[Trait["Gremlins"] = 37] = "Gremlins";
  Trait[Trait["Handicap"] = 38] = "Handicap";
  Trait[Trait["Illiterate"] = 39] = "Illiterate";
  Trait[Trait["Impatient"] = 40] = "Impatient";
  Trait[Trait["InForLife"] = 41] = "InForLife";
  Trait[Trait["Introvert"] = 42] = "Introvert";
  Trait[Trait["LostLimb"] = 43] = "LostLimb";
  Trait[Trait["PoorHearing"] = 44] = "PoorHearing";
  Trait[Trait["PoorVision"] = 45] = "PoorVision";
  Trait[Trait["SlowLearner"] = 46] = "SlowLearner";
  Trait[Trait["ThinSkinned"] = 47] = "ThinSkinned";
  Trait[Trait["TDS"] = 48] = "TDS";
  Trait[Trait["Unattractive"] = 49] = "Unattractive";
  Trait[Trait["Unlucky"] = 50] = "Unlucky";
  Trait[Trait["Equipped"] = 51] = "Equipped";
  Trait[Trait["ExtraIncome"] = 52] = "ExtraIncome";
  Trait[Trait["Reputation"] = 53] = "Reputation";
  Trait[Trait["Wealth"] = 54] = "Wealth";
  Trait[Trait["CustomVehicle"] = 55] = "CustomVehicle";
  Trait[Trait["DesignQuirk"] = 56] = "DesignQuirk";
  Trait[Trait["VehicleLevel"] = 57] = "VehicleLevel";
  Trait[Trait["Mutation"] = 58] = "Mutation";
  Trait[Trait["Dependent"] = 59] = "Dependent";
})(Trait || (Trait = {}));
var Skill;
(function (Skill) {
  Skill[Skill["Acrobatics"] = 0] = "Acrobatics";
  Skill[Skill["Acting"] = 1] = "Acting";
  Skill[Skill["Administration"] = 2] = "Administration";
  Skill[Skill["AnimalHandling"] = 3] = "AnimalHandling";
  Skill[Skill["Appraisal"] = 4] = "Appraisal";
  Skill[Skill["Archery"] = 5] = "Archery";
  Skill[Skill["Art"] = 6] = "Art";
  Skill[Skill["Artillery"] = 7] = "Artillery";
  Skill[Skill["Career"] = 8] = "Career";
  Skill[Skill["Climbing"] = 9] = "Climbing";
  Skill[Skill["Communications"] = 10] = "Communications";
  Skill[Skill["Computers"] = 11] = "Computers";
  Skill[Skill["Cryptography"] = 12] = "Cryptography";
  Skill[Skill["Demolitions"] = 13] = "Demolitions";
  Skill[Skill["Disguise"] = 14] = "Disguise";
  Skill[Skill["Driving"] = 15] = "Driving";
  Skill[Skill["EscapeArtist"] = 16] = "EscapeArtist";
  Skill[Skill["Forgery"] = 17] = "Forgery";
  Skill[Skill["Gunnery"] = 18] = "Gunnery";
  Skill[Skill["Interest"] = 19] = "Interest";
  Skill[Skill["Interrogation"] = 20] = "Interrogation";
  Skill[Skill["Investigation"] = 21] = "Investigation";
  Skill[Skill["Language"] = 22] = "Language";
  Skill[Skill["Leadership"] = 23] = "Leadership";
  Skill[Skill["MartialArts"] = 24] = "MartialArts";
  Skill[Skill["MedTech"] = 25] = "MedTech";
  Skill[Skill["MeleeWeapons"] = 26] = "MeleeWeapons";
  Skill[Skill["Navigation"] = 27] = "Navigation";
  Skill[Skill["Negotiation"] = 28] = "Negotiation";
  Skill[Skill["Perception"] = 29] = "Perception";
  Skill[Skill["Piloting"] = 30] = "Piloting";
  Skill[Skill["Prestidigitation"] = 31] = "Prestidigitation";
  Skill[Skill["Protocol"] = 32] = "Protocol";
  Skill[Skill["Running"] = 33] = "Running";
  Skill[Skill["Science"] = 34] = "Science";
  Skill[Skill["SecuritySystem"] = 35] = "SecuritySystem";
  Skill[Skill["SensorOperations"] = 36] = "SensorOperations";
  Skill[Skill["SmallArms"] = 37] = "SmallArms";
  Skill[Skill["Stealth"] = 38] = "Stealth";
  Skill[Skill["Streetwise"] = 39] = "Streetwise";
  Skill[Skill["SupportWeapons"] = 40] = "SupportWeapons";
  Skill[Skill["Surgery"] = 41] = "Surgery";
  Skill[Skill["Survival"] = 42] = "Survival";
  Skill[Skill["Swimming"] = 43] = "Swimming";
  Skill[Skill["Tactics"] = 44] = "Tactics";
  Skill[Skill["Technician"] = 45] = "Technician";
  Skill[Skill["ThrownWeapons"] = 46] = "ThrownWeapons";
  Skill[Skill["Tracking"] = 47] = "Tracking";
  Skill[Skill["Training"] = 48] = "Training";
  Skill[Skill["ZeroGOperations"] = 49] = "ZeroGOperations";
  Skill[Skill["Strategy"] = 50] = "Strategy";
  Skill[Skill["Scrounge"] = 51] = "Scrounge";
})(Skill || (Skill = {}));
var Acrobatics;
(function (Acrobatics) {
  Acrobatics[Acrobatics["FreeFall"] = 0] = "FreeFall";
  Acrobatics[Acrobatics["Gymnastics"] = 1] = "Gymnastics";
})(Acrobatics || (Acrobatics = {}));
var AnimalHandling;
(function (AnimalHandling) {
  AnimalHandling[AnimalHandling["Herding"] = 0] = "Herding";
  AnimalHandling[AnimalHandling["Riding"] = 1] = "Riding";
  AnimalHandling[AnimalHandling["Training"] = 2] = "Training";
})(AnimalHandling || (AnimalHandling = {}));
var Communications;
(function (Communications) {
  Communications[Communications["BlackBox"] = 0] = "BlackBox";
  Communications[Communications["Conventional"] = 1] = "Conventional";
  Communications[Communications["HyperpuseGenerator"] = 2] = "HyperpuseGenerator";
})(Communications || (Communications = {}));
var Driving;
(function (Driving) {
  Driving[Driving["Ground"] = 0] = "Ground";
  Driving[Driving["Rail"] = 1] = "Rail";
  Driving[Driving["Sea"] = 2] = "Sea";
})(Driving || (Driving = {}));
var Gunnery;
(function (Gunnery) {
  Gunnery[Gunnery["Aerospace"] = 0] = "Aerospace";
  Gunnery[Gunnery["Air"] = 1] = "Air";
  Gunnery[Gunnery["Battlesuit"] = 2] = "Battlesuit";
  Gunnery[Gunnery["Ground"] = 3] = "Ground";
  Gunnery[Gunnery["Mech"] = 4] = "Mech";
  Gunnery[Gunnery["ProtoMech"] = 5] = "ProtoMech";
  Gunnery[Gunnery["Sea"] = 6] = "Sea";
  Gunnery[Gunnery["Spacecraft"] = 7] = "Spacecraft";
  Gunnery[Gunnery["Turret"] = 8] = "Turret";
})(Gunnery || (Gunnery = {}));
var MedTech;
(function (MedTech) {
  MedTech[MedTech["General"] = 0] = "General";
  MedTech[MedTech["Veterinary"] = 1] = "Veterinary";
})(MedTech || (MedTech = {}));
var Navigation;
(function (Navigation) {
  Navigation[Navigation["Ground"] = 0] = "Ground";
  Navigation[Navigation["Air"] = 1] = "Air";
  Navigation[Navigation["Sea"] = 2] = "Sea";
  Navigation[Navigation["Space"] = 3] = "Space";
  Navigation[Navigation["KFJump"] = 4] = "KFJump";
})(Navigation || (Navigation = {}));
var Piloting;
(function (Piloting) {
  Piloting[Piloting["Aerospace"] = 0] = "Aerospace";
  Piloting[Piloting["Aircraft"] = 1] = "Aircraft";
  Piloting[Piloting["Battlesuit"] = 2] = "Battlesuit";
  Piloting[Piloting["Ground"] = 3] = "Ground";
  Piloting[Piloting["Mech"] = 4] = "Mech";
  Piloting[Piloting["ProtoMech"] = 5] = "ProtoMech";
  Piloting[Piloting["Railcraft"] = 6] = "Railcraft";
  Piloting[Piloting["Seacraft"] = 7] = "Seacraft";
  Piloting[Piloting["Spacecraft"] = 8] = "Spacecraft";
  Piloting[Piloting["VTOL"] = 9] = "VTOL";
})(Piloting || (Piloting = {}));
var Prestidigitation;
(function (Prestidigitation) {
  Prestidigitation[Prestidigitation["PickPocket"] = 0] = "PickPocket";
  Prestidigitation[Prestidigitation["Quickdraw"] = 1] = "Quickdraw";
  Prestidigitation[Prestidigitation["SleightOfHand"] = 2] = "SleightOfHand";
})(Prestidigitation || (Prestidigitation = {}));
var SecuritySystem;
(function (SecuritySystem) {
  SecuritySystem[SecuritySystem["Electrical"] = 0] = "Electrical";
  SecuritySystem[SecuritySystem["Mechanical"] = 1] = "Mechanical";
})(SecuritySystem || (SecuritySystem = {}));
var Surgery;
(function (Surgery) {
  Surgery[Surgery["General"] = 0] = "General";
  Surgery[Surgery["Veterinary"] = 1] = "Veterinary";
})(Surgery || (Surgery = {}));
var Tactics;
(function (Tactics) {
  Tactics[Tactics["Infantry"] = 0] = "Infantry";
  Tactics[Tactics["Land"] = 1] = "Land";
  Tactics[Tactics["Sea"] = 2] = "Sea";
  Tactics[Tactics["Air"] = 3] = "Air";
  Tactics[Tactics["Space"] = 4] = "Space";
})(Tactics || (Tactics = {}));
var Technician;
(function (Technician) {
  Technician[Technician["Aeronautics"] = 0] = "Aeronautics";
  Technician[Technician["Cybernetics"] = 1] = "Cybernetics";
  Technician[Technician["Electronics"] = 2] = "Electronics";
  Technician[Technician["Jets"] = 3] = "Jets";
  Technician[Technician["Mechanical"] = 4] = "Mechanical";
  Technician[Technician["Myomer"] = 5] = "Myomer";
  Technician[Technician["Nuclear"] = 6] = "Nuclear";
  Technician[Technician["Weapons"] = 7] = "Weapons";
})(Technician || (Technician = {}));
var ThrownWeapons;
(function (ThrownWeapons) {
  ThrownWeapons[ThrownWeapons["Blades"] = 0] = "Blades";
  ThrownWeapons[ThrownWeapons["Blunt"] = 1] = "Blunt";
  ThrownWeapons[ThrownWeapons["Spear"] = 2] = "Spear";
})(ThrownWeapons || (ThrownWeapons = {}));
var Tracking;
(function (Tracking) {
  Tracking[Tracking["Urban"] = 0] = "Urban";
  Tracking[Tracking["Wilds"] = 1] = "Wilds";
})(Tracking || (Tracking = {}));
var Archtype;
(function (Archtype) {
  Archtype[Archtype["Noble"] = 0] = "Noble";
  Archtype[Archtype["Mechwarrior"] = 1] = "Mechwarrior";
  Archtype[Archtype["Infantry"] = 2] = "Infantry";
  Archtype[Archtype["Tanker"] = 3] = "Tanker";
  Archtype[Archtype["Pilot"] = 4] = "Pilot";
  Archtype[Archtype["Explorer"] = 5] = "Explorer";
  Archtype[Archtype["ShipsOfficer"] = 6] = "ShipsOfficer";
  Archtype[Archtype["Mercenary"] = 7] = "Mercenary";
  Archtype[Archtype["Pirate"] = 8] = "Pirate";
  Archtype[Archtype["Cop"] = 9] = "Cop";
  Archtype[Archtype["Diplomat"] = 10] = "Diplomat";
  Archtype[Archtype["CorpExec"] = 11] = "CorpExec";
  Archtype[Archtype["Journalist"] = 12] = "Journalist";
  Archtype[Archtype["Scientist"] = 13] = "Scientist";
  Archtype[Archtype["Engineer"] = 14] = "Engineer";
  Archtype[Archtype["Technician"] = 15] = "Technician";
  Archtype[Archtype["Academic"] = 16] = "Academic";
  Archtype[Archtype["Artist"] = 17] = "Artist";
  Archtype[Archtype["Entertainer"] = 18] = "Entertainer";
  Archtype[Archtype["Thug"] = 19] = "Thug";
})(Archtype || (Archtype = {}));
var CreatureTrait;
(function (CreatureTrait) {
  CreatureTrait[CreatureTrait["Aggressive"] = 0] = "Aggressive";
  CreatureTrait[CreatureTrait["Cognition"] = 1] = "Cognition";
  CreatureTrait[CreatureTrait["Armor"] = 2] = "Armor";
  CreatureTrait[CreatureTrait["BloodSucker"] = 3] = "BloodSucker";
  CreatureTrait[CreatureTrait["BloodRage"] = 4] = "BloodRage";
  CreatureTrait[CreatureTrait["Camoflage"] = 5] = "Camoflage";
  CreatureTrait[CreatureTrait["ColdBlooded"] = 6] = "ColdBlooded";
  CreatureTrait[CreatureTrait["Domesticated"] = 7] = "Domesticated";
  CreatureTrait[CreatureTrait["ExceptionalAttack"] = 8] = "ExceptionalAttack";
  CreatureTrait[CreatureTrait["Flight"] = 9] = "Flight";
  CreatureTrait[CreatureTrait["GoodHearing"] = 10] = "GoodHearing";
  CreatureTrait[CreatureTrait["GoodSmell"] = 11] = "GoodSmell";
  CreatureTrait[CreatureTrait["GoodVision"] = 12] = "GoodVision";
  CreatureTrait[CreatureTrait["Hardy"] = 13] = "Hardy";
  CreatureTrait[CreatureTrait["NightVision"] = 14] = "NightVision";
  CreatureTrait[CreatureTrait["OffensiveAdaptation"] = 15] = "OffensiveAdaptation";
  CreatureTrait[CreatureTrait["PackHunter"] = 16] = "PackHunter";
  CreatureTrait[CreatureTrait["Poisonous"] = 17] = "Poisonous";
  CreatureTrait[CreatureTrait["PoisonResistance"] = 18] = "PoisonResistance";
  CreatureTrait[CreatureTrait["Skittish"] = 19] = "Skittish";
  CreatureTrait[CreatureTrait["Susceptible"] = 20] = "Susceptible";
  CreatureTrait[CreatureTrait["ToolUser"] = 21] = "ToolUser";
  CreatureTrait[CreatureTrait["CombatSense"] = 22] = "CombatSense";
  CreatureTrait[CreatureTrait["FastLearner"] = 23] = "FastLearner";
  CreatureTrait[CreatureTrait["Fit"] = 24] = "Fit";
  CreatureTrait[CreatureTrait["GTolerance"] = 25] = "GTolerance";
  CreatureTrait[CreatureTrait["PainResistance"] = 26] = "PainResistance";
  CreatureTrait[CreatureTrait["Patient"] = 27] = "Patient";
  CreatureTrait[CreatureTrait["ThickSkinned"] = 28] = "ThickSkinned";
  CreatureTrait[CreatureTrait["Toughness"] = 29] = "Toughness";
  CreatureTrait[CreatureTrait["CombatParalysis"] = 30] = "CombatParalysis";
  CreatureTrait[CreatureTrait["Compulsion"] = 31] = "Compulsion";
  CreatureTrait[CreatureTrait["GlassJaw"] = 32] = "GlassJaw";
  CreatureTrait[CreatureTrait["Handicap"] = 33] = "Handicap";
  CreatureTrait[CreatureTrait["Impatient"] = 34] = "Impatient";
  CreatureTrait[CreatureTrait["LostLimb"] = 35] = "LostLimb";
  CreatureTrait[CreatureTrait["PoorHearing"] = 36] = "PoorHearing";
  CreatureTrait[CreatureTrait["PoorVision"] = 37] = "PoorVision";
  CreatureTrait[CreatureTrait["SlowLearner"] = 38] = "SlowLearner";
  CreatureTrait[CreatureTrait["ThinSkinned"] = 39] = "ThinSkinned";
})(CreatureTrait || (CreatureTrait = {}));
var CreatureSkill;
(function (CreatureSkill) {
  CreatureSkill[CreatureSkill["Agility"] = 0] = "Agility";
  CreatureSkill[CreatureSkill["Language"] = 1] = "Language";
  CreatureSkill[CreatureSkill["Melee"] = 2] = "Melee";
  CreatureSkill[CreatureSkill["Mimicry"] = 3] = "Mimicry";
  CreatureSkill[CreatureSkill["Climbing"] = 4] = "Climbing";
  CreatureSkill[CreatureSkill["Perception"] = 5] = "Perception";
  CreatureSkill[CreatureSkill["Running"] = 6] = "Running";
  CreatureSkill[CreatureSkill["Stealth"] = 7] = "Stealth";
  CreatureSkill[CreatureSkill["Swimming"] = 8] = "Swimming";
  CreatureSkill[CreatureSkill["Tracking"] = 9] = "Tracking";
  CreatureSkill[CreatureSkill["Survival"] = 10] = "Survival";
})(CreatureSkill || (CreatureSkill = {}));
var PlantTrait;
(function (PlantTrait) {
  PlantTrait[PlantTrait["Armor"] = 0] = "Armor";
  PlantTrait[PlantTrait["Camouflage"] = 1] = "Camouflage";
  PlantTrait[PlantTrait["ExceptionalAttack"] = 2] = "ExceptionalAttack";
  PlantTrait[PlantTrait["Hardy"] = 3] = "Hardy";
  PlantTrait[PlantTrait["Poisonous"] = 4] = "Poisonous";
  PlantTrait[PlantTrait["PoisonResistance"] = 5] = "PoisonResistance";
  PlantTrait[PlantTrait["Susceptible"] = 6] = "Susceptible";
})(PlantTrait || (PlantTrait = {}));
var PlantSkill;
(function (PlantSkill) {
  PlantSkill[PlantSkill["Melee"] = 0] = "Melee";
  PlantSkill[PlantSkill["Perception"] = 1] = "Perception";
})(PlantSkill || (PlantSkill = {}));
var Book;
(function (Book) {
  Book[Book["ATimeOfWar"] = 0] = "ATimeOfWar";
  Book[Book["ATimeOfWarCompanion"] = 1] = "ATimeOfWarCompanion";
  Book[Book["EraDigestAgeOfWar"] = 2] = "EraDigestAgeOfWar";
  Book[Book["EraDigestGoldenCentury"] = 3] = "EraDigestGoldenCentury";
  Book[Book["EraReport2750"] = 4] = "EraReport2750";
  Book[Book["EraReport3052"] = 5] = "EraReport3052";
  Book[Book["EraReport3062"] = 6] = "EraReport3062";
  Book[Book["EraReport3145"] = 7] = "EraReport3145";
  Book[Book["HouseArano"] = 8] = "HouseArano";
  Book[Book["FieldManual3085"] = 9] = "FieldManual3085";
  Book[Book["BestGuess"] = 10] = "BestGuess";
})(Book || (Book = {}));

/***/ }),

/***/ 4908:
/*!***********************************!*\
  !*** ./src/app/utils/exp.pipe.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExpPipe: () => (/* binding */ ExpPipe)
/* harmony export */ });
/* harmony import */ var _stat_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stat.pipe */ 6987);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;


class ExpPipe {
  constructor() {
    this.statPipe = new _stat_pipe__WEBPACK_IMPORTED_MODULE_0__.StatPipe();
  }
  transform(value) {
    if (!value) return 'undefined';
    if ('Or' in value) {
      return 'Or?!';
    } else if ('Pick' in value) {
      return 'Pick?!';
    } else if ('Set' in value) {
      return 'Set?!';
    } else if ('If' in value) {
      return 'If?!';
    } else {
      return `${this.statPipe.transform(value)} ${value.Quantity > 0 ? '+' : ''}${value.Quantity} EXP`;
    }
  }
}
_class = ExpPipe;
_class.ɵfac = function ExpPipe_Factory(t) {
  return new (t || _class)();
};
_class.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({
  name: "exp",
  type: _class,
  pure: true
});

/***/ }),

/***/ 8742:
/*!********************************************!*\
  !*** ./src/app/utils/exp/exp.component.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExpComponent: () => (/* binding */ ExpComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common */ 6555);
/* harmony import */ var _or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../or-exp/or-exp.component */ 2298);
/* harmony import */ var _star_exp_star_exp_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../star-exp/star-exp.component */ 5483);
/* harmony import */ var _pick_exp_pick_exp_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pick-exp/pick-exp.component */ 6062);
/* harmony import */ var _set_exp_set_exp_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../set-exp/set-exp.component */ 7030);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _exp_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../exp.pipe */ 4908);
var _class;













const _c0 = function () {
  return [];
};
function ExpComponent_ng_container_1_li_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-or-exp", 3, 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const or_r7 = ctx.$implicit;
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](2);
    const exp_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("incomplete", !_r8.isComplete);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("options", (tmp_1_0 = or_r7) !== null && tmp_1_0 !== undefined ? tmp_1_0 : _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](4, _c0))("quantity", exp_r1.Quantity);
  }
}
function ExpComponent_ng_container_1_li_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-star-exp", 5, 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](2);
    const exp_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("incomplete", !_r10.isComplete);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("exp", exp_r1);
  }
}
function ExpComponent_ng_container_1_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-pick-exp", 7, 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const pick_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("count", pick_r12.Count)("options", pick_r12.Options)("quantity", pick_r12.Quantity);
  }
}
function ExpComponent_ng_container_1_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-set-exp", 9, 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const set_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("limit", set_r14.Quantity)("options", set_r14.Options)("enlist", true);
  }
}
function ExpComponent_ng_container_1_li_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](2, "exp");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const exp_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](2, 1, exp_r1), " ");
  }
}
function ExpComponent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](1, ExpComponent_ng_container_1_li_1_Template, 3, 5, "li", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](2, ExpComponent_ng_container_1_li_2_Template, 3, 3, "li", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](3, ExpComponent_ng_container_1_ng_container_3_Template, 3, 3, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](4, ExpComponent_ng_container_1_ng_container_4_Template, 3, 3, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](5, ExpComponent_ng_container_1_li_5_Template, 3, 3, "li", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const exp_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.isOr(exp_r1));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.isStar(exp_r1));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.isPick(exp_r1));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.isSet(exp_r1));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.isStd(exp_r1));
  }
}
class ExpComponent {
  get isComplete() {
    const toCheck = [...(this.orChoices ?? []), ...(this.starChoices ?? []), ...(this.pickChoices ?? []), ...(this.setChoices ?? [])];
    return toCheck.map(choice => choice.isComplete).reduce((a, b) => a && b, true);
  }
  get experience() {
    return [...this.values.filter(exp => this.isStd(exp)),
    // if we try to access these values at the wrong time then or and star might not be initialized yet
    ...[...(this.orChoices ?? []), ...(this.starChoices ?? []), ...(this.pickChoices ?? []), ...(this.setChoices ?? [])]
    //we will filter out incomplete choices as that will ensure all remaining have a defined experience property
    .flatMap(choice => choice.experience).filter(exp => !!exp)];
  }
  constructor(ref) {
    this.ref = ref;
    this.choice = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.completed = new _angular_core__WEBPACK_IMPORTED_MODULE_6__.EventEmitter();
    this.subscriptions = [];
    this.orSubs = [];
    this.starSubs = [];
    this.pickSubs = [];
    this.setSubs = [];
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.orChoices.changes.subscribe(choice => {
      [...this.orSubs].forEach(_ => {
        this.orSubs.shift()?.unsubscribe();
      });
      choice.forEach(or => {
        this.orSubs.push(or.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));
    this.subscriptions.push(this.starChoices.changes.subscribe(choice => {
      [...this.starSubs].forEach(_ => {
        this.starSubs.shift()?.unsubscribe();
      });
      choice.forEach(star => {
        this.starSubs.push(star.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));
    this.subscriptions.push(this.pickChoices.changes.subscribe(choice => {
      [...this.pickSubs].forEach(_ => {
        this.pickSubs.shift()?.unsubscribe();
      });
      choice.forEach(pick => {
        this.pickSubs.push(pick.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
      choice.forEach(pick => {
        this.pickSubs.push(pick.completed.subscribe(() => {
          if (this.isComplete) this.completed.emit();
          this.ref.detectChanges();
          this.ref.markForCheck();
        }));
      });
    }));
    this.subscriptions.push(this.setChoices.changes.subscribe(choice => {
      [...this.setSubs].forEach(_ => {
        this.setSubs.shift()?.unsubscribe();
      });
      choice.forEach(set => {
        this.setSubs.push(set.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));
  }
  sendUpdate(change) {
    this.choice.emit(change);
    if (this.isComplete) this.completed.emit();
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  ngOnDestroy() {
    [...this.subscriptions, ...this.orSubs, ...this.starSubs, ...this.pickSubs, ...this.setSubs].forEach(sub => sub.unsubscribe());
  }
  isOr(exp) {
    return 'Or' in exp ? exp.Or : undefined;
  }
  isPick(exp) {
    return 'Pick' in exp ? {
      ...exp.Pick,
      Quantity: exp.Quantity
    } : undefined;
  }
  isSet(exp) {
    return 'Set' in exp ? {
      ...exp.Set,
      Quantity: exp.Quantity
    } : undefined;
  }
  isStar(exp) {
    if ('Or' in exp) return undefined; //TODO figure out if this case is correct
    if ('Pick' in exp) return undefined; //TODO figure out if this case is correct
    if ('Set' in exp) return undefined;
    if ('If' in exp) return undefined;
    switch (exp.Kind) {
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute:
        return undefined;
      //TODO figure out if this case is correct or even possible
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
        if ('Subskill' in exp && (exp.Subskill === '*' || exp.Subskill instanceof RegExp)) return {
          ...exp
        };
        if ('Speciality' in exp && exp.Speciality === '*') return {
          ...exp
        };
        return undefined;
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait:
        switch (exp.Trait) {
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion:
            if ('Trigger' in exp && exp.Trigger === '*') return {
              ...exp
            };else return undefined;
          default:
            return undefined;
        }
      default:
        return undefined;
    }
  }
  isIf(exp) {
    return 'If' in exp ? {
      exp: exp,
      isActive: false //TODO implement this
    } : undefined;
  }
  isStd(exp) {
    return !(this.isOr(exp) || this.isStar(exp) || this.isPick(exp) || this.isSet(exp) || this.isIf(exp));
  }
}
_class = ExpComponent;
_class.ɵfac = function ExpComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_6__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-exp"]],
  viewQuery: function ExpComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_1__.OrExpComponent, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_star_exp_star_exp_component__WEBPACK_IMPORTED_MODULE_2__.StarExpComponent, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_pick_exp_pick_exp_component__WEBPACK_IMPORTED_MODULE_3__.PickExpComponent, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_set_exp_set_exp_component__WEBPACK_IMPORTED_MODULE_4__.SetExpComponent, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.orChoices = _t);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.starChoices = _t);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.pickChoices = _t);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.setChoices = _t);
    }
  },
  inputs: {
    values: "values"
  },
  outputs: {
    choice: "choice",
    completed: "completed"
  },
  decls: 2,
  vars: 1,
  consts: [[4, "ngFor", "ngForOf"], [3, "incomplete", 4, "ngIf"], [4, "ngIf"], [3, "options", "quantity"], ["orChoices", ""], [3, "exp"], ["starChoices", ""], [3, "count", "options", "quantity"], ["pickChoices", ""], [3, "limit", "options", "enlist"], ["setChoices", ""]],
  template: function ExpComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ul");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](1, ExpComponent_ng_container_1_Template, 6, 5, "ng-container", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.values);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_1__.OrExpComponent, _star_exp_star_exp_component__WEBPACK_IMPORTED_MODULE_2__.StarExpComponent, _pick_exp_pick_exp_component__WEBPACK_IMPORTED_MODULE_3__.PickExpComponent, _set_exp_set_exp_component__WEBPACK_IMPORTED_MODULE_4__.SetExpComponent, _exp_pipe__WEBPACK_IMPORTED_MODULE_5__.ExpPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 2298:
/*!**************************************************!*\
  !*** ./src/app/utils/or-exp/or-exp.component.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OrExpComponent: () => (/* binding */ OrExpComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _stat_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../stat.pipe */ 6987);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 8849);
var _class;






const _c0 = ["or"];
function OrExpComponent_option_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "stat");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](2, "stat");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "stat");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](5, "stat");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const stat_r3 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngValue", stat_r3)("value", ctx_r1.showLabel ? _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 4, stat_r3) : _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](2, 6, stat_r3, ctx_r1.labelArgs))("disabled", ctx_r1.disabledIndexes[ctx_r1.options.indexOf(stat_r3)]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r1.showLabel ? _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 9, stat_r3) : _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](5, 11, stat_r3, ctx_r1.labelArgs), " ");
  }
}
function OrExpComponent_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"](" ", ctx_r2.quantity > 0 ? "+" : "", "", ctx_r2.quantity, " EXP");
  }
}
class OrExpComponent {
  get selectedIndex() {
    return this._currentIndex;
  }
  get selectedValue() {
    return this._currentValue;
  }
  get disabledIndexes() {
    return Array.from({
      length: this.options.length
    }, (_, i) => i).map(i => this.disabledOptionIndexes.includes(i));
  }
  constructor(ref) {
    this.ref = ref;
    this.showQuantity = true;
    this.showLabel = true;
    this.disabledOptionIndexes = [];
    this.choice = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
    this.labelArgs = {
      value: '/',
      index: 1
    };
    this._currentIndex = 0;
    this._currentValue = undefined;
    this.lastIndex = 0;
    this.statPipe = new _stat_pipe__WEBPACK_IMPORTED_MODULE_0__.StatPipe();
  }
  get experience() {
    return this.selectedIndex === 0 ? undefined : {
      ...this.options[this.selectedIndex - 1],
      Quantity: this.quantity
    };
  }
  get isComplete() {
    return !!this.experience;
  }
  set selectedIndex(value) {
    this._currentIndex = value;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  set selectedValue(value) {
    this._currentValue = value;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  onOrChanged(e) {
    const src = e.target;
    this.ref.markForCheck();
    this.selectedIndex = src.selectedIndex;
    this.selectedValue = this.options[this.selectedIndex - 1];
    this.choice.emit({
      add: this.experience ? [this.experience] : [],
      remove: this.lastIndex === 0 ? [] : [{
        ...this.options[this.lastIndex - 1],
        Quantity: -this.quantity
      }]
    });
    this.lastIndex = this.selectedIndex;
    const transform = this.statPipe.transform(this.selectedValue, this.showLabel ? undefined : this.labelArgs);
    this.or.nativeElement.value = transform;
    src.value = transform;
    this.ref.detectChanges();
  }
}
_class = OrExpComponent;
_class.ɵfac = function OrExpComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-or-exp"]],
  viewQuery: function OrExpComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_c0, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.or = _t.first);
    }
  },
  inputs: {
    options: "options",
    quantity: "quantity",
    showQuantity: "showQuantity",
    showLabel: "showLabel",
    assignedIndex: "assignedIndex",
    disabledOptionIndexes: "disabledOptionIndexes"
  },
  outputs: {
    choice: "choice"
  },
  decls: 9,
  vars: 12,
  consts: [["title", "or", 3, "required", "selectedIndex", "value", "change"], ["or", ""], ["hidden", "", "selected", "", 1, "incomplete", 3, "value"], [3, "ngValue", "value", "disabled", 4, "ngFor", "ngForOf"], [4, "ngIf"], [3, "ngValue", "value", "disabled"]],
  template: function OrExpComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span")(1, "select", 0, 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function OrExpComponent_Template_select_change_1_listener($event) {
        return ctx.onOrChanged($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "option", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](5, "stat");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](6, "stat");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, OrExpComponent_option_7_Template, 6, 14, "option", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, OrExpComponent_ng_container_8_Template, 3, 2, "ng-container", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("required", true)("selectedIndex", ctx.selectedIndex)("value", ctx.selectedValue);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", undefined);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.selectedValue ? ctx.showLabel ? _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](5, 7, ctx.options[ctx.selectedIndex - 1]) : _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](6, 9, ctx.options[ctx.selectedIndex - 1], ctx.labelArgs) : " -- select an option -- ", " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.options);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.showQuantity);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgSelectMultipleOption"], _stat_pipe__WEBPACK_IMPORTED_MODULE_0__.StatPipe],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 6062:
/*!******************************************************!*\
  !*** ./src/app/utils/pick-exp/pick-exp.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PickExpComponent: () => (/* binding */ PickExpComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common */ 6555);
/* harmony import */ var _stat_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stat.pipe */ 6987);
/* harmony import */ var _star_exp_star_exp_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../star-exp/star-exp.component */ 5483);
/* harmony import */ var _or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../or-exp/or-exp.component */ 2298);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6575);
var _class;









function PickExpComponent_ng_template_0_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "app-star-exp", 6, 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const i_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("assignedIndex", i_r5)("showLabel", false)("showQuantity", false)("exp", ctx_r7.asExp(ctx_r7.pickedOption[i_r5]));
  }
}
function PickExpComponent_ng_template_0_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "app-or-exp", 8, 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const i_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("assignedIndex", i_r5)("options", ctx_r8.cachedSubOptions[i_r5])("quantity", ctx_r8.quantity)("showLabel", false)("showQuantity", false);
  }
}
function PickExpComponent_ng_template_0_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" ", ctx_r9.quantity > 0 ? "+" : "", "", ctx_r9.quantity, " EXP ");
  }
}
function PickExpComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "app-or-exp", 3, 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("choice", function PickExpComponent_ng_template_0_Template_app_or_exp_choice_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r15);
      const i_r5 = restoredCtx.$implicit;
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r14.onPickerChoice($event, i_r5));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, PickExpComponent_ng_template_0_ng_container_3_Template, 3, 4, "ng-container", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, PickExpComponent_ng_template_0_ng_container_4_Template, 3, 5, "ng-container", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, PickExpComponent_ng_template_0_ng_container_5_Template, 2, 2, "ng-container", 5);
  }
  if (rf & 2) {
    const i_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("options", ctx_r1.options)("quantity", ctx_r1.quantity)("showLabel", true)("showQuantity", false)("disabledOptionIndexes", ctx_r1.disabledIndexes[i_r5]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r1.extraType(ctx_r1.pickedOption[i_r5]) === "text");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r1.extraType(ctx_r1.pickedOption[i_r5]) === "dropdown");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r1.showQuantity);
  }
}
function PickExpComponent_ng_template_2_ng_container_0_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainer"](0);
  }
}
const _c0 = function (a0) {
  return {
    $implicit: a0
  };
};
function PickExpComponent_ng_template_2_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, PickExpComponent_ng_template_2_ng_container_0_ng_container_2_Template, 1, 0, "ng-container", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const i_r17 = ctx.$implicit;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("incomplete", !ctx_r16.isIndexComplete(i_r17));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngTemplateOutlet", _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](4, _c0, i_r17));
  }
}
function PickExpComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](0, PickExpComponent_ng_template_2_ng_container_0_Template, 3, 6, "ng-container", 10);
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r3.indexes);
  }
}
function PickExpComponent_ng_container_4_ng_container_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainer"](0);
  }
  if (rf & 2) {
    const i_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("incomplete", !ctx_r21.isIndexComplete(i_r20));
  }
}
function PickExpComponent_ng_container_4_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, PickExpComponent_ng_container_4_ng_container_1_ng_container_1_Template, 1, 2, "ng-container", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const i_r20 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngTemplateOutlet", _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](2, _c0, i_r20));
  }
}
function PickExpComponent_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, PickExpComponent_ng_container_4_ng_container_1_Template, 2, 4, "ng-container", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r4.indexes);
  }
}
class PickExpComponent {
  get isComplete() {
    const subIndexes = [...(this.starChoices ?? []), ...(this.orChoices ?? [])].map(component => component.assignedIndex);
    return this.indexes.filter(index => !subIndexes.includes(index)).reduce((sofar, index) => sofar && !!this.pickedOption[index] && !this.needsExtra(this.pickedOption[index]), true) && [...(this.starChoices ?? []), ...(this.orChoices ?? [])].reduce((sofar, component) => sofar && component.isComplete, true);
  }
  get experience() {
    const orIndex = this.indexes.filter(i => (this.orChoices ?? []).map(or => or.assignedIndex).includes(i));
    const starIndex = this.indexes.filter(i => (this.starChoices ?? []).map(star => star.assignedIndex).includes(i));
    const otherIndex = this.indexes.filter(i => !orIndex.includes(i) && !starIndex.includes(i));
    return [...(this.orChoices ?? []).filter(or => orIndex.includes(or.assignedIndex ?? -1)).map(or => or.experience ? [or.experience] : []), ...(this.starChoices ?? []).filter(star => starIndex.includes(star.assignedIndex ?? -1)).map(star => star.experience ? [star.experience] : []), ...otherIndex.map(index => this.pickedOption[index] ? [this.asExp(this.pickedOption[index])] : [])].flatMap(exp => exp).filter(exp => !this.needsExtra(exp));
  }
  get indexes() {
    return [...Array(this.count).keys()];
  }
  get cachedSubOptions() {
    return this._cachedSubOptions;
  }
  constructor(ref) {
    this.ref = ref;
    this.enlist = true;
    this.showQuantity = true;
    this.disabledOptionIndexes = [];
    this.choice = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.completed = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.labelArgs = {
      value: '/',
      index: 0
    };
    this._cachedSubOptions = {};
    this.pickedOption = {};
    this.disabledIndexes = {};
    this.maxPickedCounts = {};
    this.subscriptions = [];
    this.starSubs = [];
    this.orSubs = [];
    this.statPipe = new _stat_pipe__WEBPACK_IMPORTED_MODULE_1__.StatPipe();
    this._precalcualted = {};
  }
  ngOnDestroy() {
    [...this.subscriptions, ...this.orSubs, ...this.starSubs].forEach(sub => sub.unsubscribe());
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.orChoices.changes.subscribe(choice => {
      [...this.orSubs].forEach(_ => {
        this.orSubs.shift()?.unsubscribe();
      });
      choice.forEach(or => {
        this.orSubs.push(or.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));
    this.subscriptions.push(this.starChoices.changes.subscribe(choice => {
      [...this.starSubs].forEach(_ => {
        this.starSubs.shift()?.unsubscribe();
      });
      choice.forEach(star => {
        this.starSubs.push(star.choice.subscribe(change => {
          this.sendUpdate(change);
        }));
      });
    }));
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  ngOnInit() {
    this.options.map(opt => JSON.stringify(opt)).forEach(opt => {
      this.maxPickedCounts[opt] = opt in this.maxPickedCounts ? this.maxPickedCounts[opt] + 1 : 1;
    });
    this.indexes.forEach(i => {
      this.pickedOption[i] = undefined;
      this.disabledIndexes[i] = [...this.disabledOptionIndexes];
    });
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  sendUpdate(change) {
    this.ref.detectChanges();
    const noneNeedExtra = change.add.length > 0 && !change.add.map(exp => this.needsExtra(exp)).reduce((sofar, current) => sofar || current, false);
    if (noneNeedExtra) {
      this.choice.emit(change);
    }
    if (this.isComplete) this.completed.emit();
    this.indexes.forEach(index => {
      this.pickedOption[index] = this.pickedOption[index];
    });
    this.ref.markForCheck();
  }
  needsExtra(stat) {
    if (stat === undefined) return false;
    if ('Quantity' in stat) {
      if ('Or' in stat || 'Pick' in stat || 'Set' in stat || 'If' in stat) {
        return false;
      }
      const asStat = {
        ...stat
      };
      delete asStat.Quantity;
      return this.needsExtra(asStat);
    }
    const transformed = this.statPipe.transform(stat);
    if (transformed.slice(-1) === '/' || transformed.slice(-2) === '/*') {
      switch (stat.Kind) {
        case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait:
          switch (stat.Trait) {
            case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion:
              return 'Trigger' in stat ? stat.Trigger.length === 0 : true;
            case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute:
              return !('Attribute' in stat);
            case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude:
              return !('Skill' in stat);
            default:
              return false;
          }
        case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
          const expectSpeciality = stat.Speciality && stat.Speciality.length === 0;
          switch (stat.Skill) {
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking:
              return !('Subskill' in stat) && !expectSpeciality;
            // Skills which usually have * for subskill
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art:
            case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest:
              if ('Subskill' in stat && stat.Subskill instanceof RegExp) return true;
              return !('Subskill' in stat && typeof stat.Subskill === 'string' && stat.Subskill.length > 0 && stat.Subskill !== '*') && !expectSpeciality;
            default:
              return false;
          }
        default:
          return false;
      }
    } else {
      return false;
    }
  }
  extraType(stat) {
    if (!stat) return 'none';
    switch (stat.Kind) {
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait:
        switch (stat.Trait) {
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion:
            return 'text';
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude:
            return 'dropdown';
          default:
            return 'none';
        }
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
        switch (stat.Skill) {
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking:
            return 'dropdown';
          // Skills which usually have * for subskill
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Science:
            return 'text';
          default:
            return 'none';
        }
      default:
        return 'none';
    }
  }
  asExp(stat) {
    const ret = {
      ...stat,
      Quantity: this.quantity
    };
    return ret;
  }
  asOpts(stat) {
    if (!stat) return [];
    const json = JSON.stringify(stat);
    if (json in this._precalcualted) return this._precalcualted[json];
    switch (stat.Kind) {
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait:
        switch (stat.Trait) {
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute:
            this._precalcualted[json] = (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Attribute).map(att => {
              return {
                ...stat,
                Attribute: att
              };
            });
            break;
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude:
            this._precalcualted[json] = (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Skill).map(skill => {
              return {
                Kind: _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
                Trait: _common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude,
                Skill: skill
              };
            });
            break;
          default:
            return [];
        }
        break;
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
        switch (stat.Skill) {
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Acrobatics).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.AnimalHandling).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Communications).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Driving).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.MedTech).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Navigation).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Piloting).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Prestidigitation).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.SecuritySystem).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Surgery).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Tactics).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Technician).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.ThrownWeapons).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking:
            return (0,_common__WEBPACK_IMPORTED_MODULE_0__.EnumMap)(_common__WEBPACK_IMPORTED_MODULE_0__.Tracking).map(subskill => {
              return {
                ...stat,
                Subskill: subskill
              };
            });
          default:
            return [];
        }
      default:
        return [];
    }
    return this._precalcualted[json];
  }
  onPickerChoice(e, index) {
    const added = [...e.add].map(item => {
      return {
        ...item
      };
    });
    const removed = [...e.remove].map(item => {
      return {
        ...item
      };
    });
    [...added, ...removed].forEach(item => {
      if ('Quantity' in item) delete item.Quantity;
    });
    this.pickedOption[index] = added[0];
    if (this.needsExtra(this.pickedOption[index])) {
      this.ref.markForCheck();
      this.cachedSubOptions[index] = this.asOpts(this.pickedOption[index]);
      this.ref.detectChanges();
    }
    this.pickedOption[index] = added[0];
    const nonspecial = [];
    const special = [];
    const cal = (values, delta) => {
      return values.map(value => {
        return {
          json: JSON.stringify(value),
          delta: delta
        };
      });
    };
    [...cal(added, -1), ...cal(removed, 1)].forEach(item => {
      switch (item.delta) {
        case 1:
          if (item.json in this.maxPickedCounts) {
            if (this.maxPickedCounts[item.json] > 0) {
              nonspecial.push(item);
            } else {
              special.push(item);
            }
          } else {
            //Maybe its json for some reason?
            const json = JSON.parse(item.json);
            console.log('que');
          }
          break;
        case -1:
          if (item.json in this.maxPickedCounts) {
            if (this.maxPickedCounts[item.json] > 1) {
              nonspecial.push(item);
            } else {
              special.push(item);
            }
          } else {
            console.log('wat');
          }
          break;
        default:
          throw new Error('This should not happen!');
      }
      ;
    });
    [...nonspecial, ...special].forEach(item => this.maxPickedCounts[item.json] += item.delta);
    if (special.length > 0) {
      this.indexes.forEach(index => {
        const choice = JSON.stringify(this.pickedOption[index]);
        const filter = key => {
          if (key === choice) {
            return true;
          }
          return this.maxPickedCounts[key] > 0;
        };
        const options = [...new Set([...Object.keys(this.maxPickedCounts)])].map(json => !filter(json));
        const disabledIndexes = Array.from({
          length: options.length
        }, (_, i) => i).filter(i => options[i]);
        this.disabledIndexes[index] = [...new Set([...this.disabledOptionIndexes, ...disabledIndexes])];
      });
    }
    this.sendUpdate({
      add: e.add.map(x => {
        return {
          ...x
        };
      }),
      remove: e.remove.map(x => {
        return {
          ...x
        };
      })
    });
  }
  isIndexComplete(index) {
    const subIndexes = [...(this.starChoices ?? []), ...(this.orChoices ?? [])].filter(component => component.assignedIndex === index);
    if (subIndexes.length === 0) {
      return !!this.pickedOption[index] && !this.needsExtra(this.pickedOption[index]);
    }
    return !!this.pickedOption[index] && (subIndexes.length > 0 ? subIndexes.reduce((sofar, current) => sofar && current.isComplete, true) : true);
  }
}
_class = PickExpComponent;
_class.ɵfac = function PickExpComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_4__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-pick-exp"]],
  viewQuery: function PickExpComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_star_exp_star_exp_component__WEBPACK_IMPORTED_MODULE_2__.StarExpComponent, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_3__.OrExpComponent, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.starChoices = _t);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.orChoices = _t);
    }
  },
  inputs: {
    count: "count",
    options: "options",
    quantity: "quantity",
    enlist: "enlist",
    showQuantity: "showQuantity",
    disabledOptionIndexes: "disabledOptionIndexes"
  },
  outputs: {
    choice: "choice",
    completed: "completed"
  },
  decls: 5,
  vars: 2,
  consts: [["body", ""], ["listloop", ""], [4, "ngIf", "ngIfElse"], [3, "options", "quantity", "showLabel", "showQuantity", "disabledOptionIndexes", "choice"], ["pickerChoices", ""], [4, "ngIf"], [3, "assignedIndex", "showLabel", "showQuantity", "exp"], ["starChoices", ""], [3, "assignedIndex", "options", "quantity", "showLabel", "showQuantity"], ["orChoices", ""], [4, "ngFor", "ngForOf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [3, "incomplete", 4, "ngTemplateOutlet", "ngTemplateOutletContext"]],
  template: function PickExpComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](0, PickExpComponent_ng_template_0_Template, 6, 8, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, PickExpComponent_ng_template_2_Template, 1, 1, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, PickExpComponent_ng_container_4_Template, 2, 1, "ng-container", 2);
    }
    if (rf & 2) {
      const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.enlist)("ngIfElse", _r2);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgTemplateOutlet, _or_exp_or_exp_component__WEBPACK_IMPORTED_MODULE_3__.OrExpComponent, _star_exp_star_exp_component__WEBPACK_IMPORTED_MODULE_2__.StarExpComponent],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 9650:
/*!**************************************!*\
  !*** ./src/app/utils/rng.service.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RngService: () => (/* binding */ RngService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;

class RngService {
  constructor() {}
  Roll() {
    return Math.round(Math.random() * 5 + 1);
  }
}
_class = RngService;
_class.ɵfac = function RngService_Factory(t) {
  return new (t || _class)();
};
_class.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
  token: _class,
  factory: _class.ɵfac,
  providedIn: 'root'
});

/***/ }),

/***/ 7030:
/*!****************************************************!*\
  !*** ./src/app/utils/set-exp/set-exp.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SetExpComponent: () => (/* binding */ SetExpComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common */ 6555);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _pick_exp_pick_exp_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pick-exp/pick-exp.component */ 6062);
var _class;





const _c0 = ["picker"];
const _c1 = ["speciality"];
const _c2 = ["counter"];
const _c3 = ["recSetExp"];
function SetExpComponent_ng_template_0_input_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "input", 9, 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("blur", function SetExpComponent_ng_template_0_input_3_Template_input_blur_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r11.specialityBlur($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function SetExpComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "app-pick-exp", 4, 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, SetExpComponent_ng_template_0_input_3_Template, 2, 0, "input", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "input", 7, 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function SetExpComponent_ng_template_0_Template_input_change_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r14);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r13.quantityChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, " EXP ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](2);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    let tmp_11_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("incomplete", !ctx_r1.selfComplete);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("count", 1)("options", ctx_r1.options)("quantity", ctx_r1.quantity)("showQuantity", false)("enlist", false)("disabledOptionIndexes", ctx_r1.disabledOptionIndexes);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r7.experience.length !== 0 && ctx_r1.isSkill(_r7.experience[0]));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("maxLength", 4)("valueAsNumber", ctx_r1.quantity)("min", ctx_r1.min)("max", _r7.experience.length !== 0 && ctx_r1.hasLimit(_r7.experience[0]) ? (tmp_11_0 = (tmp_11_0 = ctx_r1.hasLimit(_r7.experience[0])) == null ? null : tmp_11_0.Limit) !== null && tmp_11_0 !== undefined ? tmp_11_0 : ctx_r1.max : ctx_r1.max);
  }
}
function SetExpComponent_ng_template_2_app_set_exp_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-set-exp", 12, 13);
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("limit", ctx_r15.remaining)("options", ctx_r15.options)("enlist", ctx_r15.enlist)("disabledOptionIndexes", ctx_r15.nextDisabledOptions);
  }
}
function SetExpComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, SetExpComponent_ng_template_2_app_set_exp_0_Template, 2, 4, "app-set-exp", 11);
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r3.remaining !== 0);
  }
}
function SetExpComponent_ng_template_4_ng_container_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](0);
  }
}
function SetExpComponent_ng_template_4_ng_container_0_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](0);
  }
}
function SetExpComponent_ng_template_4_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, SetExpComponent_ng_template_4_ng_container_0_ng_container_1_Template, 1, 0, "ng-container", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, SetExpComponent_ng_template_4_ng_container_0_ng_container_2_Template, 1, 0, "ng-container", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", _r0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", _r2);
  }
}
function SetExpComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, SetExpComponent_ng_template_4_ng_container_0_Template, 3, 2, "ng-container", 14);
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r5.quantity !== 0);
  }
}
function SetExpComponent_ng_container_6_ng_container_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](0);
  }
}
function SetExpComponent_ng_container_6_ng_container_1_li_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](0);
  }
}
function SetExpComponent_ng_container_6_ng_container_1_li_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, SetExpComponent_ng_container_6_ng_container_1_li_3_ng_container_1_Template, 1, 0, "ng-container", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", _r2);
  }
}
function SetExpComponent_ng_container_6_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, SetExpComponent_ng_container_6_ng_container_1_ng_container_2_Template, 1, 0, "ng-container", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, SetExpComponent_ng_container_6_ng_container_1_li_3_Template, 2, 1, "li", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", _r0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r20.remaining !== 0);
  }
}
function SetExpComponent_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, SetExpComponent_ng_container_6_ng_container_1_Template, 4, 2, "ng-container", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r6.quantity !== 0);
  }
}
class SetExpComponent {
  get properLimit() {
    return this._propertLimit ?? this.limit;
  }
  get nextDisabledOptions() {
    const pickers = (this.picker.pickedOption[0] ? [this.picker.options.map(opt => JSON.stringify(opt)).indexOf(JSON.stringify(this.picker.pickedOption[0]))] : []).filter(i => i >= 0);
    return [...new Set([...this.disabledOptionIndexes, ...pickers])];
  }
  set properLimit(value) {
    this._propertLimit = Math.sign(this.limit) > 0 ? Math.min(this.limit, value) : Math.max(this.limit, value);
  }
  get quantity() {
    return this._quantity;
  }
  set quantity(value) {
    this._quantity = (0,_common__WEBPACK_IMPORTED_MODULE_0__.clamp)(value, this.min, this.max);
    this.ref.detectChanges();
    this.ref.markForCheck();
    if (this.recSetExp) {
      this.recsub?.unsubscribe();
      this.recsub = undefined;
      this.recsub = this.recSetExp.choice.subscribe(values => {
        this.choice.emit(values);
      });
    }
  }
  get min() {
    return Math.min(this.properLimit, Math.sign(this.properLimit));
  }
  get max() {
    return Math.max(this.properLimit, Math.sign(this.properLimit));
  }
  get remaining() {
    const current = this.limit - this.quantity;
    return Math.sign(this.limit) > 0 ? (0,_common__WEBPACK_IMPORTED_MODULE_0__.clamp)(current, 0, Math.max(this.limit, Math.sign(this.limit))) : (0,_common__WEBPACK_IMPORTED_MODULE_0__.clamp)(current, Math.min(this.limit, Math.sign(this.limit)), 0);
  }
  get unspent() {
    return this.remaining + (this.recSetExp?.unspent ?? 0);
  }
  get total() {
    return this.quantity + (this.recSetExp?.total ?? 0);
  }
  get subtotal() {
    return !!this.recSetExp ? this.total - this.quantity : 0;
  }
  get selfComplete() {
    const validQuantity = this.quantity >= this.min && this.max >= this.quantity;
    const pickerComplete = this.picker?.isComplete ?? false;
    return validQuantity && pickerComplete;
  }
  get isComplete() {
    const recursiveComplete = !!this.recSetExp ? this.recSetExp?.isComplete : this.remaining === 0;
    return this.selfComplete && recursiveComplete;
  }
  get experience() {
    return [...this.picker.experience.map(exp => {
      const skill = this.isSkill(exp);
      const speciality = this.speciality?.nativeElement.value;
      if (skill && speciality !== undefined) return this.handleSpeciality(skill, speciality);else return exp;
    }), ...(this.recSetExp?.experience ?? [])];
  }
  constructor(ref) {
    this.ref = ref;
    this.enlist = true;
    this.disabledOptionIndexes = [];
    this.choice = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this._quantity = 0;
    this.subscriptions = [];
    this.previous = [];
  }
  ngOnInit() {
    this.quantity = Math.sign(this.properLimit) > 0 ? this.max : this.min;
  }
  ngAfterViewInit() {
    this.subscriptions.push(this.picker.choice.subscribe(changes => {
      const value = this.hasLimit(changes.add[0]);
      if (value) {
        this.properLimit = value.Limit;
        this.quantityChanged();
      }
      this.onChange();
    }), this.picker.completed.subscribe(() => {
      this.onChange();
    }));
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.recsub?.unsubscribe();
  }
  quantityChanged(_) {
    if (isNaN(this.counter.nativeElement.valueAsNumber)) {
      this.ref.markForCheck();
      this.counter.nativeElement.valueAsNumber = this.quantity;
      this.ref.detectChanges();
      return;
    }
    this.ref.markForCheck();
    const clamped = (0,_common__WEBPACK_IMPORTED_MODULE_0__.clamp)(this.counter.nativeElement.valueAsNumber, this.min, this.max);
    this.counter.nativeElement.valueAsNumber = clamped;
    this.quantity = clamped;
    if (this.total !== this.limit) {
      const diff = this.limit - this.total;
      if (this.recSetExp) {
        this.recSetExp.quantity += diff;
      } else {
        this.quantity += diff;
      }
    }
    this.ref.detectChanges();
    this.onChange();
  }
  onChange() {
    if (this.isComplete) this.choice.emit({
      add: this.experience,
      remove: this.previous
    });
    this.previous = this.experience.map(exp => {
      return {
        ...exp,
        Quantity: -exp.Quantity
      };
    });
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
  isSkill(exp) {
    if ('Kind' in exp && exp.Kind === _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill) return exp;
    return undefined;
  }
  hasLimit(stat) {
    return stat.Limit !== undefined ? {
      ...stat,
      Limit: stat.Limit
    } : undefined;
  }
  handleSpeciality(skill, speciality) {
    if ('Speciality' in skill) {
      if (speciality.length > 0) {
        skill.Speciality = speciality;
      } else {
        delete skill.Speciality;
      }
    } else {
      if (speciality.length > 0) {
        Object.assign(skill, {
          Speciality: speciality
        });
      } else {
        //If the Speciality property is missing and we dont have an input value just return as there is nothing to do.
      }
    }
    return skill;
  }
  specialityBlur(_) {
    const speciality = this.speciality.nativeElement.value;
    const skill = this.isSkill(this.experience[0]);
    this.handleSpeciality(skill, speciality);
    this.onChange();
  }
}
_class = SetExpComponent;
_class.ɵfac = function SetExpComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-set-exp"]],
  viewQuery: function SetExpComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c1, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c2, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c3, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.picker = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.speciality = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.counter = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.recSetExp = _t.first);
    }
  },
  inputs: {
    limit: "limit",
    options: "options",
    enlist: "enlist",
    disabledOptionIndexes: "disabledOptionIndexes"
  },
  outputs: {
    choice: "choice"
  },
  decls: 7,
  vars: 2,
  consts: [["body", ""], ["rec", ""], ["nonlist", ""], [4, "ngIf", "ngIfElse"], [1, "picker", 3, "count", "options", "quantity", "showQuantity", "enlist", "disabledOptionIndexes"], ["picker", ""], ["type", "text", "title", "spec", "id", "spec", "name", "spec", "placeholder", "add speciality?", "class", "speciality", "disabled", "", 3, "blur", 4, "ngIf"], ["type", "number", "title", "quantity", "id", "quantity", "name", "quantity", "placeholder", "0", 1, "counter", 3, "maxLength", "valueAsNumber", "min", "max", "change"], ["counter", ""], ["type", "text", "title", "spec", "id", "spec", "name", "spec", "placeholder", "add speciality?", "disabled", "", 1, "speciality", 3, "blur"], ["speciality", ""], [3, "limit", "options", "enlist", "disabledOptionIndexes", 4, "ngIf"], [3, "limit", "options", "enlist", "disabledOptionIndexes"], ["recSetExp", ""], [4, "ngIf"], [4, "ngTemplateOutlet"]],
  template: function SetExpComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, SetExpComponent_ng_template_0_Template, 7, 13, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, SetExpComponent_ng_template_2_Template, 1, 1, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, SetExpComponent_ng_template_4_Template, 1, 1, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, SetExpComponent_ng_container_6_Template, 2, 1, "ng-container", 3);
    }
    if (rf & 2) {
      const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.enlist)("ngIfElse", _r4);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgTemplateOutlet, _pick_exp_pick_exp_component__WEBPACK_IMPORTED_MODULE_1__.PickExpComponent, _class],
  styles: ["div[_ngcontent-%COMP%] {\n  \n\n\n\n\n}\ndiv[_ngcontent-%COMP%]   .counter[_ngcontent-%COMP%] {\n  max-height: 1.5rem;\n  width: 3rem;\n  min-width: 3rem;\n  max-width: 5rem;\n  text-align: right;\n  padding-top: 0px;\n  margin-top: 0px;\n  padding-bottom: 0px;\n  margin-bottom: 0px;\n  max-height: 18px;\n}\ndiv[_ngcontent-%COMP%]   .speciality[_ngcontent-%COMP%] {\n  max-height: 1.5rem;\n  text-align: right;\n  padding-top: 0px;\n  margin-top: 0px;\n  padding-bottom: 0px;\n  margin-bottom: 0px;\n  max-height: 18px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdXRpbHMvc2V0LWV4cC9zZXQtZXhwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0k7OzsrQkFBQTtBQUVKO0FBR0k7RUFDSSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBRUEsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBRlI7QUFTSTtFQUNJLGtCQUFBO0VBQ0EsaUJBQUE7RUFFQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFSUiIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuZGl2IHtcclxuICAgIC8qZGlzcGxheTogZmxleDtcclxuICAgIGZsb2F0OmlubGluZS1zdGFydDtcclxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7Ki9cclxuXHJcbiAgICAuY291bnRlciB7XHJcbiAgICAgICAgbWF4LWhlaWdodDogMS41cmVtOyBcclxuICAgICAgICB3aWR0aDogM3JlbTtcclxuICAgICAgICBtaW4td2lkdGg6IDNyZW07XHJcbiAgICAgICAgbWF4LXdpZHRoOiA1cmVtO1xyXG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0OyBcclxuXHJcbiAgICAgICAgcGFkZGluZy10b3A6IDBweDtcclxuICAgICAgICBtYXJnaW4tdG9wOiAwcHg7XHJcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDBweDtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAwcHg7XHJcbiAgICAgICAgbWF4LWhlaWdodDogMThweDtcclxuICAgIH1cclxuXHJcbiAgICAucGlja2VyIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAuc3BlY2lhbGl0eSB7XHJcbiAgICAgICAgbWF4LWhlaWdodDogMS41cmVtOyBcclxuICAgICAgICB0ZXh0LWFsaWduOiByaWdodDsgXHJcblxyXG4gICAgICAgIHBhZGRpbmctdG9wOiAwcHg7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogMHB4O1xyXG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAwcHg7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMHB4O1xyXG4gICAgICAgIG1heC1oZWlnaHQ6IDE4cHg7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 5483:
/*!******************************************************!*\
  !*** ./src/app/utils/star-exp/star-exp.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StarExpComponent: () => (/* binding */ StarExpComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common */ 6555);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6575);
var _class;




const _c0 = ["compulsionTrigger"];
const _c1 = ["subskill"];
function StarExpComponent_span_0_label_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "label", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Compulsion/");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function StarExpComponent_span_0_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx_r4.quantity, " EXP");
  }
}
function StarExpComponent_span_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, StarExpComponent_span_0_label_1_Template, 2, 0, "label", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "input", 2, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("blur", function StarExpComponent_span_0_Template_input_blur_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r5.compulsionBlur($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, StarExpComponent_span_0_ng_container_4_Template, 2, 1, "ng-container", 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.showLabel);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("required", true)("minLength", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.showQuantity);
  }
}
function StarExpComponent_span_1_label_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "label", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx_r7.skillName, "/");
  }
}
function StarExpComponent_span_1_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx_r9.quantity, " EXP");
  }
}
function StarExpComponent_span_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, StarExpComponent_span_1_label_1_Template, 2, 1, "label", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "input", 6, 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("blur", function StarExpComponent_span_1_Template_input_blur_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r10.subskillBlur($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, StarExpComponent_span_1_ng_container_4_Template, 2, 1, "ng-container", 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.showLabel);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("required", true)("minLength", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.showQuantity);
  }
}
class StarExpComponent {
  get isComplete() {
    if (!this.experience) return false;
    if ('Or' in this.experience || 'Pick' in this.experience || 'Set' in this.experience || 'If' in this.experience) return false;
    if (this.experience.Kind === _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait && this.experience.Trait === _common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion && 'Trigger' in this.experience) return this.experience.Trigger.length > 0;else if (this.experience.Kind === _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill && 'Subskill' in this.experience && typeof this.experience.Subskill === 'string') {
      return this.experience.Subskill.length > 0 && this.experience.Subskill !== '*';
    } else {
      return false;
    }
  }
  get value() {
    if (this.trigger) return this.compulsionTrigger.nativeElement.value;
    if (this.skill) return this.subskill.nativeElement.value;
    return '';
  }
  set value(newVal) {
    if (this.trigger) this.compulsionTrigger.nativeElement.value = newVal;
    if (this.skill) this.subskill.nativeElement.value = newVal;
  }
  get trigger() {
    if ('Or' in this.exp || 'Pick' in this.exp || 'Set' in this.exp || 'If' in this.exp) return false;
    switch (this.exp.Kind) {
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait:
        switch (this.exp.Trait) {
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion:
            return true;
          default:
            return false;
        }
      default:
        return false;
    }
  }
  get skill() {
    if ('Or' in this.exp || 'Pick' in this.exp || 'Set' in this.exp || 'If' in this.exp) return undefined;
    if (this.exp.Kind !== _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill) return undefined;
    return {
      ...this.exp
    };
  }
  get quantity() {
    return this.exp.Quantity > 0 ? `+${this.exp.Quantity}` : `${this.exp.Quantity}`;
  }
  get skillName() {
    if ('Or' in this.exp || 'Pick' in this.exp || 'Set' in this.exp || 'If' in this.exp) return '';
    if (this.exp.Kind !== _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill) return '';
    return Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Skill)[this.exp.Skill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').replace(/([A-Z])([A-Z])/g, '$1-$2').trim();
  }
  constructor(ref) {
    this.ref = ref;
    this.showLabel = true;
    this.showQuantity = true;
    this.choice = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
    this.experience = undefined;
  }
  compulsionBlur(e) {
    if ('Or' in this.exp || 'Pick' in this.exp || 'Set' in this.exp || 'If' in this.exp) return;
    if (this.exp.Kind !== _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait) return;
    this.onBlur({
      Kind: _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait,
      Trait: _common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion,
      Trigger: this.compulsionTrigger.nativeElement.value,
      Quantity: this.exp.Quantity
    });
  }
  subskillBlur(e) {
    if ('Or' in this.exp || 'Pick' in this.exp || 'Set' in this.exp || 'If' in this.exp) return;
    if (this.exp.Kind !== _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill) return;
    this.onBlur({
      Kind: _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill,
      Skill: this.exp.Skill,
      Subskill: this.subskill.nativeElement.value.replace(/(.+)/, 'Substring' in this.exp && this.exp.Substring instanceof RegExp ? this.exp.Substring.source : '$1'),
      Quantity: this.exp.Quantity
    });
  }
  onBlur(newExp) {
    if (JSON.stringify(this.oldExp) === JSON.stringify(newExp)) return;
    if (this.value.length === 0) return;
    this.ref.markForCheck();
    this.experience = newExp;
    this.choice.emit({
      add: [newExp],
      remove: this.oldExp ? [{
        ...this.oldExp,
        Quantity: -this.oldExp
      }] : []
    });
    this.oldExp = newExp;
    this.ref.detectChanges();
  }
}
_class = StarExpComponent;
_class.ɵfac = function StarExpComponent_Factory(t) {
  return new (t || _class)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.ChangeDetectorRef));
};
_class.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: _class,
  selectors: [["app-star-exp"]],
  viewQuery: function StarExpComponent_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_c1, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.compulsionTrigger = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.subskill = _t.first);
    }
  },
  inputs: {
    exp: "exp",
    showLabel: "showLabel",
    showQuantity: "showQuantity",
    assignedIndex: "assignedIndex"
  },
  outputs: {
    choice: "choice"
  },
  decls: 2,
  vars: 2,
  consts: [[4, "ngIf"], ["for", "compulsion", 4, "ngIf"], ["id", "compulsion", "type", "text", "placeholder", "fill in a compulsion trigger...", 3, "required", "minLength", "blur"], ["compulsionTrigger", ""], ["for", "compulsion"], ["for", "skill", 4, "ngIf"], ["id", "skill", "type", "text", "placeholder", "fill in a subskill...", 3, "required", "minLength", "blur"], ["subskill", ""], ["for", "skill"]],
  template: function StarExpComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, StarExpComponent_span_0_Template, 5, 4, "span", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, StarExpComponent_span_1_Template, 5, 4, "span", 0);
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.trigger);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.skill);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf],
  styles: ["span[_ngcontent-%COMP%] {\n  padding: 1px, 2px;\n  max-height: 18px;\n}\nspan[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  padding-right: 0px;\n  margin-right: 0px;\n  padding-left: 0px;\n  margin-left: 0px;\n}\nspan[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  padding-left: 0px;\n  margin-left: 0px;\n  padding-top: 0px;\n  margin-top: 0px;\n  padding-bottom: 0px;\n  margin-bottom: 0px;\n  max-height: 18px;\n}\n\nlabel[_ngcontent-%COMP%] {\n  padding-left: 0px;\n  margin-left: 0px;\n  padding-top: 0px;\n  margin-top: 0px;\n  padding-bottom: 0px;\n  margin-bottom: 0px;\n  max-height: 18px;\n}\n\ninput[_ngcontent-%COMP%] {\n  padding-left: 0px;\n  margin-left: 0px;\n  padding-top: 0px;\n  margin-top: 0px;\n  padding-bottom: 0px;\n  margin-bottom: 0px;\n  max-height: 18px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdXRpbHMvc3Rhci1leHAvc3Rhci1leHAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDSSxpQkFBQTtFQUNBLGdCQUFBO0FBQUo7QUFDSTtFQUNJLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0FBQ1I7QUFDSTtFQUNJLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFDUjs7QUFHQTtFQUNJLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFBSjs7QUFHQTtFQUNJLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFBSiIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5zcGFuIHtcclxuICAgIHBhZGRpbmc6IDFweCwgMnB4O1xyXG4gICAgbWF4LWhlaWdodDogMThweDtcclxuICAgIGxhYmVsIHtcclxuICAgICAgICBwYWRkaW5nLXJpZ2h0OiAwcHg7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAwcHg7XHJcbiAgICAgICAgcGFkZGluZy1sZWZ0OiAwcHg7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDBweDtcclxuICAgIH1cclxuICAgIGlucHV0IHtcclxuICAgICAgICBwYWRkaW5nLWxlZnQ6IDBweDtcclxuICAgICAgICBtYXJnaW4tbGVmdDogMHB4O1xyXG4gICAgICAgIHBhZGRpbmctdG9wOiAwcHg7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogMHB4O1xyXG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAwcHg7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMHB4O1xyXG4gICAgICAgIG1heC1oZWlnaHQ6IDE4cHg7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxhYmVsIHtcclxuICAgIHBhZGRpbmctbGVmdDogMHB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDBweDtcclxuICAgIHBhZGRpbmctdG9wOiAwcHg7XHJcbiAgICBtYXJnaW4tdG9wOiAwcHg7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogMHB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMHB4O1xyXG4gICAgbWF4LWhlaWdodDogMThweDtcclxufVxyXG5cclxuaW5wdXQge1xyXG4gICAgcGFkZGluZy1sZWZ0OiAwcHg7XHJcbiAgICBtYXJnaW4tbGVmdDogMHB4O1xyXG4gICAgcGFkZGluZy10b3A6IDBweDtcclxuICAgIG1hcmdpbi10b3A6IDBweDtcclxuICAgIHBhZGRpbmctYm90dG9tOiAwcHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwcHg7XHJcbiAgICBtYXgtaGVpZ2h0OiAxOHB4O1xyXG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 6987:
/*!************************************!*\
  !*** ./src/app/utils/stat.pipe.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatPipe: () => (/* binding */ StatPipe)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ 6555);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
var _class;


class StatPipe {
  transform(value, split) {
    if (!value) return 'undefined';
    if (split) {
      return this.transform(value).split(split.value)[split.index];
    }
    switch (value.Kind) {
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Attribute:
        const atts = Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Attribute);
        return atts[value.Attribute.valueOf()].toString();
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Skill:
        const skill = Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Skill)[value.Skill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').replace(/([A-Z])([A-Z])/g, '$1-$2').trim();
        const speciality = value.Speciality ? `(${value.Speciality})` : '';
        const hasSubskillDefined = ('Subskill' in value);
        switch (value.Skill) {
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Acrobatics:
            const acrobatics = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Acrobatics)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${acrobatics} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.AnimalHandling:
            const animalHandling = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.AnimalHandling)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${animalHandling} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Communications:
            const communications = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Communications)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${communications} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Driving:
            const driving = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Driving)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${driving} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Gunnery:
            const gunnery = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Gunnery)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${gunnery} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.MedTech:
            const medTech = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.MedTech)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${medTech} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Navigation:
            const navigation = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Navigation)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${navigation} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Piloting:
            const piloting = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Piloting)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${piloting} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Prestidigitation:
            const prestidigitation = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Prestidigitation)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${prestidigitation} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.SecuritySystem:
            const securitySystem = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.SecuritySystem)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${securitySystem} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Surgery:
            const surgery = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Surgery)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${surgery} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tactics:
            const tactics = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Tactics)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${tactics} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Technician:
            const technician = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Technician)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${technician} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.ThrownWeapons:
            const thrownWeapons = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.ThrownWeapons)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').trim() : '';
            return `${skill}/${thrownWeapons} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Tracking:
            const tracking = hasSubskillDefined ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Tracking)[value.Subskill.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').replace(/([A-Z])([A-Z])/g, '$1-$2').trim() : '';
            return `${skill}/${tracking} ${speciality}`.trim();
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Language:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Career:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Protocol:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Streetwise:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Survival:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Art:
          case _common__WEBPACK_IMPORTED_MODULE_0__.Skill.Interest:
            const requiredSubskill = 'Subskill' in value ? `/${hasSubskillDefined ? value.Subskill : ''}` : '/';
            return `${skill}${requiredSubskill} ${speciality}`.trim();
          default:
            const subskill = 'Subskill' in value ? `/${hasSubskillDefined ? value.Subskill : ''}` : '';
            return `${skill}${subskill} ${speciality}`.trim();
        }
      case _common__WEBPACK_IMPORTED_MODULE_0__.Statistic.Trait:
        const trait = Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Trait)[value.Trait.valueOf()].toString().replace(/([A-Z]+)/g, ' $1').replace(/([A-Z])([A-Z])/g, '$1-$2').replace(/([I][-][D])/g, 'ID').trim();
        switch (value.Trait) {
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.Compulsion:
            const compulstionTrigger = 'Trigger' in value ? value.Trigger : '';
            return `${trait}/${compulstionTrigger}`;
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.ExceptionalAttribute:
            const exceptionalAttribute = 'Attribute' in value ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Attribute)[value.Attribute] : '';
            return `${trait}/${exceptionalAttribute}`;
          case _common__WEBPACK_IMPORTED_MODULE_0__.Trait.NaturalAptitude:
            const naturalAptitude = 'Skill' in value ? Object.values(_common__WEBPACK_IMPORTED_MODULE_0__.Skill)[value.Skill].toString().replace(/([A-Z]+)/g, ' $1').replace(/([A-Z])([A-Z])/g, '$1-$2').trim() : '';
            return `${trait}/${naturalAptitude}`;
          default:
            return trait;
        }
      default:
        //Maybe its json for some reason?
        let ret = 'ERROR';
        try {
          const json = JSON.parse(value);
          ret = this.transform(json, split);
        } finally {
          return ret;
        }
    }
  }
}
_class = StatPipe;
_class.ɵfac = function StatPipe_Factory(t) {
  return new (t || _class)();
};
_class.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({
  name: "stat",
  type: _class,
  pure: true
});

/***/ }),

/***/ 4913:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 8629);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4913)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map