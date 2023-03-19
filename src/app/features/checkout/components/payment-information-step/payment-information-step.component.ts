import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentInfo } from '../../../../types/checkoutSteps.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-information-step',
  templateUrl: './payment-information-step.component.html',
  styleUrls: ['./payment-information-step.component.scss']
})
export class PaymentInformationStepComponent {
  @Output() paymentFormValue = new EventEmitter<PaymentInfo>();
  @Input() orderPrice: number;
  constructor() {}

  form: FormGroup = new FormGroup({
    cardNumber: new FormControl(null, Validators.required),
    cvv: new FormControl(null, Validators.required),
    expirationDate: new FormControl('', Validators.required),
    name: new FormControl('')
  });

  get cardNumber(): FormControl {
    return this.form.get('cardNumber') as FormControl;
  }
  get cvv(): FormControl {
    return this.form.get('cvv') as FormControl;
  }
  get expirationDate(): FormControl {
    return this.form.get('expirationDate') as FormControl;
  }
  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }
  onSubmit() {
    this.paymentFormValue.emit(this.form.value);
  }
}
