import { Component, OnInit } from '@angular/core';
import { ModalWindowService } from '../../../../core/services/modalWindow.service';
import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { ICart, ICartList } from '../../../../types/cart.interface';
import { IProduct } from 'src/app/types/product.model';
import { getModalConfig } from 'src/app/helpers/cartModalConfig';
import { AutoUnsubscribeComponent } from 'src/app/helpers/AutoUnsubscribeComponent';
import { MatDialog } from '@angular/material/dialog';
import { IOrderProduct } from 'src/app/types/order.interfaces';
import { IUser } from 'src/app/types/user.interface';
import { OrderService } from 'src/app/core/services/order.service';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-shopping-cart-page',
  templateUrl: './shopping-cart-page.component.html',
  styleUrls: ['./shopping-cart-page.component.scss'],
  providers: [ModalWindowService]
})
export class ShoppingCartPageComponent extends AutoUnsubscribeComponent implements OnInit {
  products: Array<IProduct>;
  cart: ICartList | null;
  mapOfProducts = new Map();
  productsForOrder: IOrderProduct[];

  user: IUser | null;

  constructor(
    public cartService: CartService,
    private modalWindowService: ModalWindowService,
    private orderService: OrderService,
    public userService: UserService,
    public dialog: MatDialog
  ) {
    super();
    this.user = this.userService.authorizedUser;
  }

  ngOnInit(): void {
    this.cartService.cartSubject.subscribe((cart) => {
      if (!cart) return;

      this.productsForOrder = Object.values(cart)
        .filter((cartItem: ICart) => cartItem.checked)
        .map((cartItem: ICart) => {
          return {
            originalProductId: cartItem.product.id,
            categoryId: cartItem.product.category,
            price: cartItem.product.price,
            quantity: cartItem.amount
          };
        });
      this.user = this.userService.getUser().getValue();

      this.mapOfProducts = new Map<string, ICart>();
      this.createMapOfProducts(Object.values(cart));
    });
  }

  createMapOfProducts(cartProducts: Array<ICart>) {
    for (let item of cartProducts) {
      if (this.mapOfProducts.has(item.product.sellerName)) {
        this.mapOfProducts.set(item.product.sellerName, {
          products: [...this.mapOfProducts.get(item.product.sellerName).products, item.product],
          lastAddingTime: Math.max(
            this.mapOfProducts.get(item.product.sellerName).lastAddingTime,
            item.addingTime
          )
        });
      } else {
        this.mapOfProducts.set(item.product.sellerName, {
          products: [item.product],
          lastAddingTime: item.addingTime
        });
      }
    }
  }

  openDialog() {
    this.modalWindowService.modal(getModalConfig('all')).subscribe({
      next: (data) => {
        if (data === 'true') {
          this.cartService.clearCart();
        }
      },
      error: (err) => console.log(err)
    });
  }

  cartIsEmpty() {
    const cart = this.cartService.getLocalCart();
    return !cart || Object.keys(this.cartService.getLocalCart()).length === 0;
  }

  get allPrices() {
    const initialAndDiscountPrices = this.cartService.getInitialAndDiscountPrices();
    const personalDiscount = (
      this.cartService.calculatePersonalDiscount(this.user) * initialAndDiscountPrices.discountPrice
    ).toFixed(2);

    const finalPrice = initialAndDiscountPrices.discountPrice - +personalDiscount;

    return {
      generalDiscount:
        initialAndDiscountPrices.initialPrice - initialAndDiscountPrices.discountPrice,
      personalDiscount,
      finalPrice
    };
  }

  createAnOrder() {
    this.orderService.createIntermediateOrder({
      userId: this.user ? +this.user.id : null,
      products: this.productsForOrder,
      status: 'WAITING_FOR_PAYMENT',
      deliveryPrice: 100,
      totalPrice: this.allPrices.finalPrice + 100,
      createdAt: Date.now(),
      deliveryType: 'Courier service delivery',
      deliveryAddress: null
    });

    this.productsForOrder.forEach((el) => this.cartService.removeProduct(el.originalProductId));
  }
}
