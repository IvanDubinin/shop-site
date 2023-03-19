import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { PersonalInformationStepComponent } from './personal-information-step/personal-information-step.component';
import { PaymentInformationStepComponent } from './payment-information-step/payment-information-step.component';
import { DeliveryAddressStepComponent } from './delivery-address-step/delivery-address-step.component';
import { DeliveryAddressFormComponent } from './delivery-address-step/delivery-address-form/delivery-address-form.component';
import { CheckoutStepperComponent } from './checkout-stepper/checkout-stepper.component';

export const components: any[] = [
  CheckoutPageComponent,
  PersonalInformationStepComponent,
  DeliveryAddressStepComponent,
  PaymentInformationStepComponent,
  DeliveryAddressFormComponent,
  CheckoutStepperComponent
];

export * from './checkout-page/checkout-page.component';
export * from './personal-information-step/personal-information-step.component';
export * from './payment-information-step/payment-information-step.component';
export * from './delivery-address-step/delivery-address-step.component';
export * from './delivery-address-step/delivery-address-form/delivery-address-form.component';
export * from './checkout-stepper/checkout-stepper.component';
