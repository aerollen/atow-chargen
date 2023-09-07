import { Citation, Eternal, Experience, Requirement, Archtype } from "../utils/common"

export class Background {
    private timeline: {
        [Date in Eternal]?: Array<(Record<'Kind', BackgroundEvent> & Partial<BackgroundInfo>)>
    } = {}

    constructor(
        private when: number,
        private moduleInfo: BackgroundInfo) {
        const date: Eternal = (when-2398) as Eternal
        if(date > 0) {
            this.timeline[0] = [{
                Kind: BackgroundEvent.Disallow
            }];
        }
        this.timeline[date] = [{
            Kind: BackgroundEvent.Allowed,
            ...moduleInfo
        }];
    }

    enable(when: number, backgroundInfo: Partial<Omit<BackgroundInfo, 'Duration'>> | undefined = undefined) : Background {
        this.timeline[(when-2398) as Eternal] = [{
            Kind: BackgroundEvent.Allowed,
            ...backgroundInfo
        }];
        return this;
    }

    disable(when: number) : Background {
        this.timeline[(when-2398) as Eternal] = [{
            Kind: BackgroundEvent.Disallow
        }];
        return this;
    }

    update(when: number, backgroundInfo: Partial<Omit<BackgroundInfo, 'Stage' | 'Duration'>>): Background {
        this.timeline[(when-2398) as Eternal] = [{
            Kind: BackgroundEvent.Modify,
            ...backgroundInfo
        }];
        return this;
    }

    public At(when: Eternal): BackgroundInfo | undefined {
        const importantDates = Object.keys(this.timeline)
            .filter(key => (+key) <= when)
            .sort((a, b) => (+a) - (+b))
            .map(key => (+key) as Eternal)
            .filter(date => 
                this.timeline[date]?.some(event => 
                    event.Kind === BackgroundEvent.Allowed || event.Kind === BackgroundEvent.Disallow))
            .reverse();

        const latest = importantDates.pop();
        if(latest === undefined) throw new Error(); //this means dates is empty and latest is undefined, which means there is no defined founding, which is bad.
        if(!(this.timeline[latest]?.some(date => date.Kind === BackgroundEvent.Allowed))) {
            //this means that the most recent background event is that it disallowed, which means if that date is before now (which it must be because above) then there is no background to return
            return undefined;
        }

        //build the background between 'latest' and 'when'
        const dates = Object.keys(this.timeline)
            .filter(key => (+key) >= latest && (+key) <= when)
            .sort((a, b) => (+a) - (+b))
            .map(key => (+key) as Eternal);

        //this is the actual data, just unprocssed
        const events = dates.flatMap(date => this.timeline[date]?.filter(event => event.Kind === BackgroundEvent.Allowed || event.Kind === BackgroundEvent.Modify))
        const initial = [...dates].shift();

        if(initial === undefined) throw new Error();
        const start = this.timeline[initial]?.filter(date => date.Kind === BackgroundEvent.Allowed)[0];

        const process = (sofar: ReturnType<typeof this.At>): ReturnType<typeof this.At> => {
            const current = events.shift();
            if(!current) return sofar;

            switch(current.Kind) {
                case BackgroundEvent.Allowed:
                case BackgroundEvent.Modify:
                    return process({
                        Name: current.Name ?? sofar!.Name!,
                        Prereq: current.Prereq ?? sofar!.Prereq,
                        Cost: current.Cost ?? sofar!.Cost!,
                        Experience: current.Experience ?? sofar!.Experience!,
                        Duration: current.Duration ?? sofar!.Duration!,
                        Citation: current.Citation ?? sofar!.Citation,
                        ArchtypeScore: { ...sofar?.ArchtypeScore, ...current.ArchtypeScore },
                    });
                case BackgroundEvent.Disallow:
                    return undefined;
            }
        }

        const ret = process({ 
            Name: start!.Name!,
            Prereq: start!.Prereq,
            Cost: start!.Cost!,
            Experience: start!.Experience!,
            Duration: start!.Duration!,
            Citation: start!.Citation,
            ArchtypeScore: start!.ArchtypeScore,
        });
        return ret;
    }
}

export type BackgroundInfo = {
    Name: string,
    Prereq?: Requirement,
    Cost: number,
    Experience: Experience[]
    Duration: number,
    Citation?: Citation,
    ArchtypeScore?: Partial<{ [archtype in Archtype]: number }>
}

enum BackgroundEvent {
    'Allowed', 'Disallow', 'Modify'
}