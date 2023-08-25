import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrExpComponent } from './or-exp.component';
import { AppModule } from 'src/app/app.module';

describe('OrExpComponent', () => {
  let component: OrExpComponent;
  let fixture: ComponentFixture<OrExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [OrExpComponent]
    });
    fixture = TestBed.createComponent(OrExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
