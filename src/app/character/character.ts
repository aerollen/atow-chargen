import { Subject } from "rxjs";
import { Experience } from "../utils/common";

export class Character {
    public Name: string = '';

    public Experience: Subject<Experience> = new Subject();


    constructor(args: Load | Create) {

    }

    
}

type Create = {
    Option: Option.Create,

}

type Load = {
    Option: Option.Load,
    File: string,
}

export enum Option {
    Create, Load
}