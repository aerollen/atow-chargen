import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VitalsComponent } from './vitals.component';
import { AppModule } from 'src/app/app.module';

describe('VitalsComponent', () => {
  let component: VitalsComponent;
  let fixture: ComponentFixture<VitalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [VitalsComponent]
    });
    fixture = TestBed.createComponent(VitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a min value of 16 for starting age', ()=> {
    component.startingAge = 10;
    expect(component.startingAge).toBe(16);
  });
});
