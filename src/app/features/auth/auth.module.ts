import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

import * as fromComponents from './components';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [...fromComponents.components],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule, NgxMaskModule],
  exports: [...fromComponents.components]
})
export class AuthModule {}
