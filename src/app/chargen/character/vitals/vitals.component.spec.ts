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

  describe('should enforce Birth Year < Starting Year inequality', () => {
    it('should maintain inequality when Birth Year changes', () => {
      component.startingYear = 3051;
      component.yearOfBirth = 3100;
      fixture.detectChanges();

      expect(component.yearOfBirth).toBeLessThan(component.startingYear);
      expect(component.startingAge).toBe(component.startingYear - component.yearOfBirth);
    });

    it('should maintain inequality when Starting year changes', () => {
      component.yearOfBirth = 3100;
      component.startingYear = 3051;
      fixture.detectChanges();

      expect(component.yearOfBirth).toBeLessThan(component.startingYear);
      expect(component.startingAge).toBe(component.startingYear - component.yearOfBirth);
    });

    it('should update Birth year when Starting age changes', () => {
      component.startingYear = 3051;
      component.startingAge = 21;
      fixture.detectChanges();

      const originalBirhtYear = component.yearOfBirth;

      component.startingAge += 4;
      fixture.detectChanges();

      expect(component.yearOfBirth).toBe(originalBirhtYear - 4);

      component.startingAge -= 5;
      fixture.detectChanges();

      expect(component.yearOfBirth).toBe(originalBirhtYear + 1);
    });

    it('Should update increase Starting Age when Starting year increases', () => {
      component.yearOfBirth = 3100;
      component.startingYear = 3051;
      fixture.detectChanges();

      const ageBeforeChange = component.startingAge;
      component.startingYear += 1;
      fixture.detectChanges();

      expect(component.startingAge).toBe(ageBeforeChange + 1);
    });

    [21, 16].forEach(age => 
      it(`Should update decrease Starting Age or Birth year when Starting year decreases for starting age of ${age}`, () => {
        component.startingYear = 3051;
        component.startingAge = age;
        fixture.detectChanges();

        const ageBeforeChange = component.startingAge;
        component.startingYear -= 1;
        fixture.detectChanges();

        expect(component.startingAge).toBeLessThanOrEqual(ageBeforeChange);
        expect(component.startingAge).toBeGreaterThanOrEqual(16);
      }));

  });
});
