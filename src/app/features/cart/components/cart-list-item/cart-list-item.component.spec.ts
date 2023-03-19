import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from 'src/app/core/services/user.service';
import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { IProductSingleEntityMock } from 'src/mocks/constucted-entities';

import { CartListItemComponent } from './cart-list-item.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CartListItemComponent', () => {
  let component: CartListItemComponent;
  let fixture: ComponentFixture<CartListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartListItemComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [CartService, UserService, HttpClient, HttpHandler]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListItemComponent);
    component = fixture.componentInstance;
    component.product = IProductSingleEntityMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
