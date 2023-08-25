import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewaffComponent } from './newaff.component';
import { AppModule } from 'src/app/app.module';

describe('NewaffComponent', () => {
  let component: NewaffComponent;
  let fixture: ComponentFixture<NewaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [NewaffComponent]
    });
    fixture = TestBed.createComponent(NewaffComponent);
    component = fixture.componentInstance;
    component.currentYear = 3051;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
