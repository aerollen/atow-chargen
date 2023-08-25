import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage3Component } from './stage3.component';
import { AppModule } from 'src/app/app.module';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
