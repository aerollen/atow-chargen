import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage2Component } from './stage2.component';
import { AppModule } from 'src/app/app.module';

describe('Stage2Component', () => {
  let component: Stage2Component;
  let fixture: ComponentFixture<Stage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage2Component]
    });
    fixture = TestBed.createComponent(Stage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
