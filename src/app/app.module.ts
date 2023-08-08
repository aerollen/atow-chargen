import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterComponent } from './chargen/character/character.component';
import { Stage0Component } from './chargen/stages/stage0/stage0.component';
import { Stage1Component } from './chargen/stages/stage1/stage1.component';
import { Stage2Component } from './chargen/stages/stage2/stage2.component';
import { Stage3Component } from './chargen/stages/stage3/stage3.component';
import { Stage4Component } from './chargen/stages/stage4/stage4.component';
import { StatPipe } from './utils/stat.pipe';
import { ExpPipe } from './utils/exp.pipe';
import { ArchtypePipe } from './utils/archtype.pipe';
import { CitationPipe } from './utils/citation.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrExpComponent } from './utils/or-exp/or-exp.component';
import { DefaultExpComponent } from './chargen/stages/stage0/default-exp/default-exp.component';
import { AffComponent } from './chargen/stages/stage0/aff/aff.component';
import { SubaffComponent } from './chargen/stages/stage0/subaff/subaff.component';
import { StarExpComponent } from './utils/star-exp/star-exp.component';

@NgModule({
    declarations: [
        AppComponent,
        CharacterComponent,
        Stage0Component,
        Stage1Component,
        Stage2Component,
        Stage3Component,
        Stage4Component,
        StatPipe,
        ExpPipe,
        ArchtypePipe,
        CitationPipe,
        OrExpComponent,
        DefaultExpComponent,
        AffComponent,
        SubaffComponent,
        StarExpComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        AppRoutingModule,
    ]
})
export class AppModule { }
