import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffComponent } from './aff.component';
import { AppModule } from 'src/app/app.module';

describe('AffComponent', () => {
  let component: AffComponent;
  let fixture: ComponentFixture<AffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [AffComponent]
    });
    fixture = TestBed.createComponent(AffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
