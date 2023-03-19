import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListItemComponent } from './order-list-item.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { rawOrderMock } from '../../../../../../mocks/raw-entities';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderService } from 'src/app/core/services/order.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { ModalWindowService } from 'src/app/core/services/modalWindow.service';
// import { SharedModule } from '../../../../shared/shared.module';
// import { rawOrderMock } from '../../../../../mocks/raw-entities';
// import { OrderService } from '../../../../core/services/order.service';
// import { ProductsService } from '../../../../core/services/products.service';
// import { ModalWindowService } from '../../../../core/services/modalWindow.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OrderListItemComponent', () => {
  let component: OrderListItemComponent;
  let fixture: ComponentFixture<OrderListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderListItemComponent],
      imports: [HttpClientModule, SharedModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [OrderService, ProductsService, ModalWindowService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListItemComponent);
    component = fixture.componentInstance;
    component.order = rawOrderMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
