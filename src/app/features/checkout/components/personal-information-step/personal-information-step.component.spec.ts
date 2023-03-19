import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationStepComponent } from './personal-information-step.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

describe('PersonalInformationStepComponent', () => {
  let component: PersonalInformationStepComponent;
  let fixture: ComponentFixture<PersonalInformationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalInformationStepComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule, MatDialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInformationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
