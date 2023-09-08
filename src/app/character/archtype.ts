import { Affiliation } from "../affiliation/affiliation";
import { Background } from "../background/background";
import { Education } from "../education/education";
import { Stage, Archtype as ArchtypeEnum } from "../utils/common";

export class Archtype {
    constructor(
        public type: ArchtypeEnum, 
        public data: { [stage in Stage]: ArchtypeInfo<stage> }) {
        const defaultValues = (): Array<{
        }> => {
            //Im still working out how this should actually work.
            switch(type) {
                case ArchtypeEnum.Academic:
                case ArchtypeEnum.Artist:
                case ArchtypeEnum.Cop:
                case ArchtypeEnum.CorpExec:
                case ArchtypeEnum.Diplomat:
                case ArchtypeEnum.Engineer:
                case ArchtypeEnum.Entertainer:
                case ArchtypeEnum.Explorer:
                case ArchtypeEnum.Infantry:
                case ArchtypeEnum.Journalist:
                case ArchtypeEnum.Mechwarrior:
                case ArchtypeEnum.Mercenary:
                case ArchtypeEnum.Noble:
                case ArchtypeEnum.Pilot:
                case ArchtypeEnum.Pirate:
                case ArchtypeEnum.Scientist:
                case ArchtypeEnum.ShipsOfficer:
                case ArchtypeEnum.Tanker:
                case ArchtypeEnum.Technician:
                case ArchtypeEnum.Thug:
                    return [];
            }
        }
    }

    calculateSuggestedScore<T>(item: T): number {
        return 0;
    }
}

export type ArchtypeInfo<stage extends Stage> 
    = { Stage: stage } 
    & stage extends 0 ? { Affiliations: Affiliation[] } 
    : stage extends 3 ? { Educations: Education[] }
    : { Backgrounds: Background[] }