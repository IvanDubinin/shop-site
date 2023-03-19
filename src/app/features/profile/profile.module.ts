import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductModule } from '../product/product.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import * as fromComponents from './components';

const maskConfig: Partial<IConfig> = {
  validation: false
};

@NgModule({
  declarations: [...fromComponents.components],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ProductModule,
    MaterialModule,
    NgxMaskModule.forRoot(maskConfig),
    ProfileRoutingModule
  ],
  exports: [...fromComponents.components]
})
export class ProfileModule {}
