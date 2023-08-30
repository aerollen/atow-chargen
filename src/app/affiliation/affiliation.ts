import { Citation, Eternal, Experience, Skill, Stat, Statistic, Archtype } from "../utils/common";

export class Affiliation {
    private timeline: {
        [Date in Eternal]?: Array<(Record<'Kind', AffiliationEvent> & Partial<{
            Subaffiliation: Subaffiliation,
        } & AffiliationInfo>)>
    } = {}

    constructor(
        private founding: number,
        private moduleInfo: AffiliationInfo) {
        this.timeline[(founding - 2398) as Eternal] = [{
            Kind: AffiliationEvent.Founded,
            ...moduleInfo
        }];
    }

    public Update(when: number, update:Partial<AffiliationInfo>): Affiliation {
        this.timeline[(when-2398) as Eternal] = [...(this.timeline[(when-2398) as Eternal] ?? []), {
            Kind: AffiliationEvent.Modified,
            ...update
        }];
        return this;
    }

    public RemoveRegion(when: number, name: string, citation?: Citation): Affiliation {
        this.timeline[(when-2398) as Eternal] = [...(this.timeline[(when-2398) as Eternal] ?? []), {
            Kind: AffiliationEvent.RegionRemoved,
            Name: name,
            Citation: citation
        }];
        return this;
    }

    public AddRegion(when: number, subaff: Subaffiliation): Affiliation {
        this.timeline[(when-2398) as Eternal] = [...(this.timeline[(when-2398) as Eternal] ?? []), {
            Kind: AffiliationEvent.RegionAdded,
            Subaffiliation: subaff
        }];
        return this;
    }

    public At(when: Eternal): (AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>) | undefined {
        const importantDates = Object.keys(this.timeline)
            .filter(key => (+key) <= when)
            .sort((a, b) => (+a) - (+b))
            .map(key => (+key) as Eternal)
            .filter(date => 
                this.timeline[date]?.some(event => 
                    event.Kind === AffiliationEvent.Founded || event.Kind === AffiliationEvent.Dissolved))
            .reverse();
        
        const latest = importantDates.pop();
        if(latest === undefined) throw new Error(); //this means dates is empty and latest is undefined, which means there is no defined founding, which is bad.
        if(!(this.timeline[latest]?.some(date => date.Kind === AffiliationEvent.Founded))) {
            //this means that the most recent affiliation event is that it dissolved, which means if that date is before now (which it must be because above) then there is no affiliation to return
            return undefined;
        }

        //build the affiliation between 'latest' and 'when'
        const dates = Object.keys(this.timeline)
            .filter(key => (+key) >= latest && (+key) <= when)
            .sort((a, b) => (+a) - (+b))
            .map(key => (+key) as Eternal);
        
        //this is the actual data, just unprocssed
        const activities = dates.flatMap(date => this.timeline[date]?.filter(event => event.Kind === AffiliationEvent.RegionAdded || event.Kind === AffiliationEvent.RegionRemoved))
        const founding = [...dates].shift();
        if(founding === undefined) throw new Error();
        const start = this.timeline[founding]?.filter(date => date.Kind === AffiliationEvent.Founded)[0];

        const process = (sofar: ReturnType<typeof this.At>): ReturnType<typeof this.At> => {
            const current = activities.shift();
            if(!current) return sofar;

            switch(current.Kind) {
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
                        ArchtypeScore: { ...sofar?.ArchtypeScore, ...current.ArchtypeScore },
                        Protocol: current.Protocol ?? sofar?.Protocol,
                    } as ReturnType<typeof this.At>)
                case AffiliationEvent.RegionAdded:
                    return process({
                        Name: sofar?.Name,
                        Cost: sofar?.Cost,
                        Experience: sofar?.Experience,
                        PrimaryLanguage: sofar?.PrimaryLanguage,
                        SecondaryLanguages: sofar?.SecondaryLanguages,
                        Subaffiliations: [...(sofar?.Subaffiliations ?? []), current.Subaffiliation],
                        Citation: current.Citation ?? sofar?.Citation,
                        ArchtypeScore: { ...sofar?.ArchtypeScore, ...current.ArchtypeScore },
                        Protocol: sofar?.Protocol
                    } as ReturnType<typeof this.At>);
                case AffiliationEvent.RegionRemoved:
                    return process({
                        Name: sofar?.Name,
                        Cost: sofar?.Cost,
                        Experience: sofar?.Experience,
                        PrimaryLanguage: sofar?.PrimaryLanguage,
                        SecondaryLanguages: sofar?.SecondaryLanguages,
                        Subaffiliations: sofar?.Subaffiliations.filter(sub => sub.Name !== current.Name) ?? [],
                        Citation: current.Citation ?? sofar?.Citation,
                        ArchtypeScore: { ...sofar?.ArchtypeScore, ...current.ArchtypeScore },
                        Protocol: sofar?.Protocol
                    } as ReturnType<typeof this.At>);
                case AffiliationEvent.RegionChanged:
                    return process({
                        Name: sofar?.Name,
                        Cost: sofar?.Cost,
                        Experience: sofar?.Experience,
                        PrimaryLanguage: sofar?.PrimaryLanguage,
                        SecondaryLanguages: sofar?.SecondaryLanguages,
                        Subaffiliations: [[...sofar?.Subaffiliations.filter(sub => sub.Name !== current.Name) ?? []], current.Subaffiliation],
                        Citation: current.Citation ?? sofar?.Citation,
                        ArchtypeScore: { ...sofar?.ArchtypeScore, ...current.ArchtypeScore },
                        Protocol: sofar?.Protocol
                    } as ReturnType<typeof this.At>)
            }
        }

        const ret = process({ 
            Name: start!.Name,
            Cost: start!.Cost, 
            Experience: start!.Experience,
            PrimaryLanguage: start!.PrimaryLanguage,
            SecondaryLanguages: start!.SecondaryLanguages,
            Subaffiliations: [],
            Citation: start?.Citation,
            ArchtypeScore: start?.ArchtypeScore,
            Protocol: start?.Protocol
        } as ReturnType<typeof this.At>);
        return ret;
    }
}

export type AffiliationInfo = {
    Name: string,
    Cost: number,
    Experience: Experience[],
    PrimaryLanguage: Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string },
    SecondaryLanguages: Array<Stat & { Skill: Skill.Language, Kind: Statistic.Skill, Subskill: string }>,
    Citation?: Citation,
    ArchtypeScore?: Partial<{ [archtype in Archtype]: number }>
    Protocol: Stat & { Skill: Skill.Protocol, Kind: Statistic.Skill, Subskill: string }
}

export type Subaffiliation = Omit<AffiliationInfo, 'Cost' | 'PrimaryLanguage' | 'SecondaryLanguages' | 'Protocol'>

enum AffiliationEvent {
    'Founded', 'Dissolved', 'RegionAdded', 'RegionRemoved', 'RegionChanged', 'Modified'
}
