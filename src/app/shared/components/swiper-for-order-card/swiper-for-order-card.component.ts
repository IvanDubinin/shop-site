import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import SwiperCore, { EffectCoverflow, Pagination, SwiperOptions } from 'swiper';
SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-swiper-for-order-card',
  templateUrl: './swiper-for-order-card.component.html',
  styleUrls: ['./swiper-for-order-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SwiperForOrderCardComponent {
  @Input() arrayOfImages: Array<string>;
  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    navigation: true,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      // when window width is >= 769px
      769: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };
  constructor() {}
}
