import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickExpComponent } from './pick-exp.component';
import { AppModule } from 'src/app/app.module';

describe('PickExpComponent', () => {
  let component: PickExpComponent;
  let fixture: ComponentFixture<PickExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [PickExpComponent]
    });
    fixture = TestBed.createComponent(PickExpComponent);
    component = fixture.componentInstance;
    component.count = 5;
    component.options = [];
    component.quantity = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
