import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperForOrderCardComponent } from './swiper-for-order-card.component';

describe('SwiperForOrderCardComponent', () => {
  let component: SwiperForOrderCardComponent;
  let fixture: ComponentFixture<SwiperForOrderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SwiperForOrderCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperForOrderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
