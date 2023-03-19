import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { LoggingService } from 'src/app/core/services/logging-service';
import { IInnerNotification } from 'src/app/types/notification.interface';

import { CustomSnackBarComponent } from './custom-snack-bar.component';

describe('CustomSnackBarComponent', () => {
  let component: CustomSnackBarComponent;
  let fixture: ComponentFixture<CustomSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSnackBarComponent],
      imports: [MatSnackBarModule],
      providers: [
        LoggingService,
        Injector,
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: { data: new BehaviorSubject(new Map<number, IInnerNotification>()) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
