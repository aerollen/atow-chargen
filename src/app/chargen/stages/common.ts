import { EventEmitter, Output } from "@angular/core";
import { Subject } from "rxjs";
import { Experience, Stage } from "src/app/utils/common";

export interface Common {
    //complete: EventEmitter<Experience[]>;
    //changed: EventEmitter<never>;

    get Stage(): Stage;
    get isComplete(): Subject<boolean>;
}

