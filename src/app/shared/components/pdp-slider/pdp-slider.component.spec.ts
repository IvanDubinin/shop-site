import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdpSliderComponent } from './pdp-slider.component';
import { SwiperComponent } from 'swiper/angular';
import { IProductSingleEntityMock } from 'src/mocks/constucted-entities';
describe('PdpSliderComponent', () => {
  let component: PdpSliderComponent;
  let fixture: ComponentFixture<PdpSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdpSliderComponent, SwiperComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdpSliderComponent);
    component = fixture.componentInstance;
    component.product = IProductSingleEntityMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
