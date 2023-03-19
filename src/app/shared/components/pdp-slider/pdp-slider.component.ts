import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import SwiperCore, {
  SwiperOptions,
  Autoplay,
  Grid,
  Pagination,
  Controller,
  Navigation,
  Virtual
} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { IProduct } from 'src/app/types/product.model';
import { sliderConfig, DirectionOptions } from './pdp-slider.config';

const sliderResizeThreshold = 768;

SwiperCore.use([Autoplay, Grid, Pagination, Controller, Navigation, Virtual]);
@Component({
  selector: 'app-pdp-slider',
  templateUrl: './pdp-slider.component.html',
  styleUrls: ['./pdp-slider.component.scss']
})
export class PdpSliderComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('frontSwiper') frontSwiper: SwiperComponent;
  @ViewChild('sideSwiper') sideSwiper: SwiperComponent;
  @Input() product: IProduct;
  sideConfig: SwiperOptions = sliderConfig.sideSlider;
  frontConfig: SwiperOptions = sliderConfig.frontSlider;
  direction: DirectionOptions;
  resizeListenerCb = () => {
    {
      if (
        (window.innerWidth < sliderResizeThreshold &&
          this.direction === DirectionOptions.vertical) ||
        (window.innerWidth > sliderResizeThreshold &&
          this.direction === DirectionOptions.horizontal)
      ) {
        this.toggleDirectionProperty();
        this.setSideSwiperDirection();
      }
    }
  };
  constructor() {}

  ngAfterViewInit(): void {
    this.frontSwiper.swiperRef.controller.control = this.sideSwiper.swiperRef;
    this.sideSwiper.swiperRef.controller.control = this.frontSwiper.swiperRef;
    this.setSideSwiperDirection();
    window.addEventListener('resize', this.resizeListenerCb);
  }

  ngOnInit(): void {
    this.direction =
      window.innerWidth > sliderResizeThreshold
        ? DirectionOptions.vertical
        : DirectionOptions.horizontal;
  }

  onSlideClicked(e: Event, i: number) {
    this.frontSwiper.swiperRef.slideTo(i);
  }

  setSideSwiperDirection() {
    this.sideSwiper.swiperRef.changeDirection(this.direction);
  }

  toggleDirectionProperty() {
    this.direction =
      this.direction === DirectionOptions.vertical
        ? DirectionOptions.horizontal
        : DirectionOptions.vertical;
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListenerCb);
  }
}
