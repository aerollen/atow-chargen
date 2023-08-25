import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpComponent } from './exp.component';
import { AppModule } from 'src/app/app.module';

describe('ExpComponent', () => {
  let component: ExpComponent;
  let fixture: ComponentFixture<ExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ExpComponent]
    });
    fixture = TestBed.createComponent(ExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
