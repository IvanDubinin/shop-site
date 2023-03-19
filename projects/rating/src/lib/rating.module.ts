import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StarsComponent } from './stars/stars.component';

@NgModule({
  declarations: [StarsComponent],
  imports: [CommonModule],
  exports: [StarsComponent]
})
export class RatingModule {}
