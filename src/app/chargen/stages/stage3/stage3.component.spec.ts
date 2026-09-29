import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage3Component } from './stage3.component';
import { AppModule } from '../../../app.module';
import { AffiliationsService } from '../../../affiliation/affiliations.service';
import { NEVER } from 'rxjs';

describe('Stage3Component', () => {
  let component: Stage3Component;
  let fixture: ComponentFixture<Stage3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage3Component]
    });
    fixture = TestBed.createComponent(Stage3Component);
    component = fixture.componentInstance;
    component.startingYear = NEVER;
    component.endingYear = NEVER;
    component.archtype = undefined;
    component.affiliation = TestBed.inject(AffiliationsService).At(3055)[0];
    component.language = NEVER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
