import { SwiperOptions } from 'swiper';

export enum DirectionOptions {
  horizontal = 'horizontal',
  vertical = 'vertical'
}

const sideSlider: SwiperOptions = {
  direction: 'vertical',
  slidesPerView: 3,
  centeredSlides: true,
  slidesPerGroup: 1,
  resizeObserver: true,
  navigation: {
    prevEl: '.swiper-custom-button-prev',
    nextEl: '.swiper-custom-button-next'
  }
};

const frontSlider: SwiperOptions = {
  slidesPerView: 1,
  centeredSlides: true,
  centeredSlidesBounds: true,
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true,
    bulletElement: 'div',
    bulletActiveClass: 'swiper-pagination-bullet-active'
  }
};

export const sliderConfig = {
  sideSlider,
  frontSlider
};
