import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';

import * as fromComponents from './components';

@NgModule({
  declarations: [...fromComponents.components],
  imports: [CommonModule, MaterialModule, RouterModule, SharedModule, FormsModule],
  exports: [...fromComponents.components]
})
export class ProductModule {}
