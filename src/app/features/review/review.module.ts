import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';

import * as fromComponents from './components';
import { AppRoutingModule } from '../../app-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [...fromComponents.components],
  imports: [CommonModule, MaterialModule, SharedModule],
  exports: [...fromComponents.components]
})
export class ReviewModule {}
