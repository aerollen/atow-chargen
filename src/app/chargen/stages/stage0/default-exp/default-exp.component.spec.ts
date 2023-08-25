import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultExpComponent } from './default-exp.component';
import { AppModule } from 'src/app/app.module';

describe('DefaultExpComponent', () => {
  let component: DefaultExpComponent;
  let fixture: ComponentFixture<DefaultExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [DefaultExpComponent]
    });
    fixture = TestBed.createComponent(DefaultExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
