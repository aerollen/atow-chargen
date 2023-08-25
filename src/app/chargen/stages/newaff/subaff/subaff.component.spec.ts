import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubaffComponent } from './subaff.component';
import { AppModule } from 'src/app/app.module';

describe('SubaffComponent', () => {
  let component: SubaffComponent;
  let fixture: ComponentFixture<SubaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SubaffComponent]
    });
    fixture = TestBed.createComponent(SubaffComponent);
    component = fixture.componentInstance;
    component.subaffiliations = []; // TODO make some resuable testing affiliations?
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
