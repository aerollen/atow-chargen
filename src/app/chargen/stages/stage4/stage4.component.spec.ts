import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage4Component } from './stage4.component';
import { AppModule } from 'src/app/app.module';

describe('Stage4Component', () => {
  let component: Stage4Component;
  let fixture: ComponentFixture<Stage4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage4Component]
    });
    fixture = TestBed.createComponent(Stage4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
