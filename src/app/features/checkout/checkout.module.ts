import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { MatStepperModule } from '@angular/material/stepper';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatRadioModule } from '@angular/material/radio';
// import { DeliveryAddressFormComponent } from './components/delivery-address-step/delivery-address-form/delivery-address-form.component';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { CheckoutRoutingModule } from './checkout-routing.module';
// import { AddressBook } from '../address-book/addressbook.module';

import * as fromComponents from './components';
@NgModule({
  declarations: [...fromComponents.components],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgxMaskModule,
    MaterialModule,
    CheckoutRoutingModule
    // MatExpansionModule,
    // MatStepperModule,
    // MatRadioModule
    // AddressBook
  ],
  exports: [...fromComponents.components]
})
export class CheckoutModule {}
