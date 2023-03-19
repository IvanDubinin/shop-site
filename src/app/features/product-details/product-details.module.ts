import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailsRoutingModule } from './product-details-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReviewModule } from '../review/review.module';
import { MaterialModule } from 'src/app/material/material.module';

import * as fromComponents from './components';

@NgModule({
  declarations: [...fromComponents.components],
  imports: [CommonModule, SharedModule, MaterialModule, ReviewModule, ProductDetailsRoutingModule],
  exports: [...fromComponents.components]
})
export class ProductDetailsModule {}
