import { Citation, Eternal, Experience, Requirement } from "../utils/common"

export class Field {
    private timeline: {
        [Date in Eternal]?: Array<(Record<'Kind', FieldEvent> & Partial<SkillField>)>
    } = {}

    constructor(
        private when: number,
        private field: SkillField) {
        const date: Eternal = (when-2398) as Eternal
        if(date > 0) {
            this.timeline[0] = [{
                Kind: FieldEvent.Disallow
            }];
        }
        this.timeline[date] = [{
            Kind: FieldEvent.Allowed,
            ...field
        }];
    }

    public At(when: Eternal): SkillField | undefined {
        const importantDates = Object.keys(this.timeline)
            .filter(key => (+key) <= when)
            .sort((a, b) => (+a) - (+b))
            .map(key => (+key) as Eternal)
            .filter(date => 
                this.timeline[date]?.some(event => 
                    event.Kind === FieldEvent.Allowed || event.Kind === FieldEvent.Disallow))
            .reverse();

        const latest = importantDates.pop();
        if(latest === undefined) throw new Error(); //this means dates is empty and latest is undefined, which means there is no defined founding, which is bad.
        if(!(this.timeline[latest]?.some(date => date.Kind === FieldEvent.Allowed))) {
            //this means that the most recent field event is that it disallowed, which means if that date is before now (which it must be because above) then there is no field to return
            return undefined;
        }

        //build the field between 'latest' and 'when'
        const dates = Object.keys(this.timeline)
            .filter(key => (+key) >= latest && (+key) <= when)
            .sort((a, b) => (+a) - (+b))
            .map(key => (+key) as Eternal);

        //this is the actual data, just unprocssed
        const events = dates.flatMap(date => this.timeline[date]?.filter(event => event.Kind === FieldEvent.Allowed || event.Kind === FieldEvent.Modify))
        const initial = [...dates].shift();

        if(initial === undefined) throw new Error();
        const start = this.timeline[initial]?.filter(date => date.Kind === FieldEvent.Allowed)[0];

        const process = (sofar: ReturnType<typeof this.At>): ReturnType<typeof this.At> => {
            const current = events.shift();
            if(!current) return sofar;

            switch(current.Kind) {
                case FieldEvent.Allowed:
                case FieldEvent.Modify:
                    return process({
                        Name: current.Name ?? sofar!.Name!,
                        Prereq: current.Prereq ?? sofar!.Prereq,
                        Skills: current.Skills ?? sofar!.Skills!,
                        Citation: current.Citation ?? sofar!.Citation
                    });
                case FieldEvent.Disallow:
                    return undefined;
            }
        }

        const ret = process({ 
            Name: start!.Name!,
            Prereq: start!.Prereq,
            Skills: start!.Skills!,
            Citation: start!.Citation
        });
        return ret;
    }
}

export type SkillField = {
    Name: string,
    Prereq?: Requirement,
    Skills: Omit<Experience, 'Quantity' | 'Set' | 'If'>[],
    Citation?: Citation
}

enum FieldEvent {
    'Allowed', 'Disallow', 'Modify'
}