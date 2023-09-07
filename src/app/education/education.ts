import { Subject } from "rxjs";
import { Citation, Eternal, Experience, Requirement, Skill } from "../utils/common";
import { SkillField } from "./field";

export class Education {
    private timeline: {
        [Date in Eternal]?: Array<(Record<'Kind', EducationEvent> & Partial<EduInfo>)>
    } = {}

    constructor(
        private when: number,
        private info: EduInfo) {
        const date: Eternal = (when-2398) as Eternal
        if(date > 0) {
            this.timeline[0] = [{
                Kind: EducationEvent.Disallow
            }];
        }
        this.timeline[date] = [{
            Kind: EducationEvent.Allowed,
            ...info
        }];
    }

    public RemoveField(when: number, type: EducationType, name: string, citation?: Citation): Education {
        this.timeline[(when-2398) as Eternal] = [...(this.timeline[(when-2398) as Eternal] ?? []), {
            Kind: EducationEvent.FieldRemoved,
            [type]: { Options: [{ Name: name }]},
            Citation: citation
        }];
        return this;
    }

    public AddField(when: number, type: EducationType, field: SkillField, citation?: Citation): Education {
        this.timeline[(when-2398) as Eternal] = [...(this.timeline[(when-2398) as Eternal] ?? []), {
            Kind: EducationEvent.FieldAdded,
            [type]: { Options: [field]},
            Citation: citation
        }];
        return this;
    }

    public At(when: Eternal): EduInfo | undefined {
        const importantDates = Object.keys(this.timeline)
            .filter(key => (+key) <= when)
            .sort((a, b) => (+a) - (+b))
            .map(key => (+key) as Eternal)
            .filter(date => 
                this.timeline[date]?.some(event => 
                    event.Kind === EducationEvent.Allowed || event.Kind === EducationEvent.Disallow))
            .reverse();

        const latest = importantDates.pop();
        if(latest === undefined) throw new Error(); //this means dates is empty and latest is undefined, which means there is no defined founding, which is bad.
        if(!(this.timeline[latest]?.some(date => date.Kind === EducationEvent.Allowed))) {
            //this means that the most recent education event is that it disallowed, which means if that date is before now (which it must be because above) then there is no field to return
            return undefined;
        }

        //build the education between 'latest' and 'when'
        const dates = Object.keys(this.timeline)
            .filter(key => (+key) >= latest && (+key) <= when)
            .sort((a, b) => (+a) - (+b))
            .map(key => (+key) as Eternal);

        //this is the actual data, just unprocssed
        const events = dates.flatMap(date => this.timeline[date]?.filter(event => event.Kind === EducationEvent.Allowed || event.Kind === EducationEvent.Modify))
        const initial = [...dates].shift();

        if(initial === undefined) throw new Error();
        const start = this.timeline[initial]?.filter(date => date.Kind === EducationEvent.Allowed)[0];

        const remove = (sofar: { Duration: number, Options: Pick<SkillField, 'Name'>[] } | undefined, values: Pick<SkillField, 'Name'>[]): typeof sofar => {
            if(!sofar) return undefined;
            if(values.length === 0) return sofar;
            const names: string[] = values.map(value => value.Name);
            return {
                Duration: sofar!.Duration,
                Options: sofar.Options.filter(field => !names.includes(field.Name))
            }
        }

        const add = (sofar: { Duration: number, Options: Pick<SkillField, 'Name'>[] } | undefined, values: Pick<SkillField, 'Name'>[]): typeof sofar => {
            if(!sofar) return undefined;
            if(values.length === 0) return sofar;
            return {
                Duration: sofar!.Duration,
                Options: [...sofar.Options, ...values]
            }
        }

        const process = (sofar: ReturnType<typeof this.At>): ReturnType<typeof this.At> => {
            const current = events.shift();
            if(!current) return sofar;

            switch(current.Kind) {
                case EducationEvent.Allowed:
                case EducationEvent.Modify:
                    return process({
                        Name: current.Name ?? sofar!.Name!,
                        Prereq: current.Prereq ?? sofar!.Prereq,
                        Cost: current.Cost ?? sofar!.Cost!,
                        Experience: current.Experience ?? sofar!.Experience!,
                        Citation: current.Citation ?? sofar!.Citation,
                        [EducationType.Basic]: (sofar!)[EducationType.Basic],
                        [EducationType.Advanced]: (sofar!)[EducationType.Advanced],
                        [EducationType.Special]: (sofar!)[EducationType.Special],
                    });
                case EducationEvent.Disallow:
                    return undefined;
                case EducationEvent.FieldAdded:
                    return process({
                        Name: sofar!.Name!,
                        Prereq: sofar!.Prereq,
                        Cost: sofar!.Cost!,
                        Experience: sofar!.Experience!,
                        Citation: sofar!.Citation,
                        [EducationType.Basic]: add((sofar!)[EducationType.Basic], EducationType.Basic in current ? current[EducationType.Basic]?.Options ?? [] : []),
                        [EducationType.Advanced]: add((sofar!)[EducationType.Advanced], EducationType.Advanced in current ? current[EducationType.Advanced]?.Options ?? [] : []),
                        [EducationType.Special]: add((sofar!)[EducationType.Special], EducationType.Special in current ? current[EducationType.Special]?.Options ?? [] : []),
                    });
                case EducationEvent.FieldRemoved:
                    return process({
                        Name: sofar!.Name!,
                        Prereq: sofar!.Prereq,
                        Cost: sofar!.Cost!,
                        Experience: sofar!.Experience!,
                        Citation: sofar!.Citation,
                        [EducationType.Basic]: remove((sofar!)[EducationType.Basic], EducationType.Basic in current ? current[EducationType.Basic]?.Options ?? [] : []),
                        [EducationType.Advanced]: remove((sofar!)[EducationType.Advanced], EducationType.Advanced in current ? current[EducationType.Advanced]?.Options ?? [] : []),
                        [EducationType.Special]: remove((sofar!)[EducationType.Special], EducationType.Special in current ? current[EducationType.Special]?.Options ?? [] : []),
                    });
            }
        }

        const ret = process({ 
            Name: start!.Name!,
            Prereq: start!.Prereq,
            Cost: start!.Cost!,
            Experience: start!.Experience!,
            Citation: start!.Citation,
            [EducationType.Basic]: (start!)[EducationType.Basic],
            [EducationType.Advanced]: (start!)[EducationType.Advanced],
            [EducationType.Special]: (start!)[EducationType.Special],
        });
        return ret;
    }
}

export enum EducationType {
    Basic, Advanced, Special
}

type _EduInfo = {
    Name: string,
    Cost: number,
    Experience: Experience[],
    Prereq?: Requirement,
    Citation?: Citation
}

export type EduInfo = _EduInfo & Partial<Record<EducationType, {
    Duration: number,
    Options: (Pick<SkillField, 'Name'> & Partial<SkillField>)[]
}>>

enum EducationEvent {
    'Allowed', 'Disallow', 'Modify', 'FieldAdded', 'FieldRemoved'
}