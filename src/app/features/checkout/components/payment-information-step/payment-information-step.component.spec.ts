import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { PaymentInformationStepComponent } from './payment-information-step.component';
import { CustomCurrencyPipe } from '../../../../shared/pipes';

describe('PaymentInformationStepComponent', () => {
  let component: PaymentInformationStepComponent;
  let fixture: ComponentFixture<PaymentInformationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInformationStepComponent, CustomCurrencyPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInformationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
