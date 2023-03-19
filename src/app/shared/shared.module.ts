import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';
import { SwiperModule } from 'swiper/angular';
import { RatingModule } from 'projects/rating/src/public-api';
import { ImageCropperModule } from 'ngx-image-cropper';

import * as fromComponents from './components';
import * as fromPipes from './pipes';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [...fromComponents.components, ...fromPipes.pipes],
  imports: [
    CommonModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    ImageCropperModule,
    RouterModule,
    NgxMaskModule,
    MaterialModule
  ],
  exports: [...fromComponents.components, ...fromPipes.pipes, RatingModule, MaterialModule]
})
export class SharedModule {}
