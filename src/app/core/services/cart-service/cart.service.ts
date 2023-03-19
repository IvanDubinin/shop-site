import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { ICart, ICartList } from 'src/app/types/cart.interface';
import { IProduct } from 'src/app/types/product.model';
import { IUser } from 'src/app/types/user.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartSubject: BehaviorSubject<ICartList>;
  user: IUser | null;

  constructor(private userService: UserService) {
    this.cartSubject = new BehaviorSubject(this.getLocalCart());
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      if (user) this.mergeCart();
    });
  }

  getLocalCart() {
    return JSON.parse(localStorage.getItem(this.getKey()) as string);
  }

  getKey() {
    return this.user ? `authCart ${this.user.id}` : 'unAuthCart';
  }

  addToCart(cartItem: ICart) {
    let cart = this.getLocalCart() || {};
    if (cart.hasOwnProperty(cartItem.product.id.toString())) {
      cart[cartItem.product.id.toString()].amount++;
    } else {
      cart[cartItem.product.id.toString()] = cartItem;
    }
    this.setCartInLocalStorage(cart);
  }

  clearCart() {
    localStorage.removeItem(this.getKey());
    return this.cartSubject.next({});
  }

  getProductById(product: IProduct) {
    const cart = this.getLocalCart();
    return cart[product.id.toString()] ? cart[product.id.toString()] : false;
  }

  decreaseProduct(product: IProduct) {
    const cart = this.getLocalCart();

    if (cart[product.id.toString()].amount === 1) {
      this.removeProduct(product.id);
    } else {
      cart[product.id.toString()].amount--;
      this.setCartInLocalStorage(cart);
    }
  }

  getQuantity() {
    let cart = this.getLocalCart();
    let quantity = 0;
    for (let key in cart) {
      quantity += cart[key].amount;
    }
    return quantity;
  }

  removeProduct(productId: number) {
    let cart = this.getLocalCart();
    delete cart[productId.toString()];
    this.setCartInLocalStorage(cart);
  }

  saveCart() {
    let cart = this.getLocalCart();
    localStorage.setItem('savedCart', JSON.stringify(cart));
    localStorage.removeItem(this.getKey());
    this.cartSubject.next({});
  }

  mergeCart() {
    const unAuthorizedCart = JSON.parse(localStorage.getItem('unAuthCart') as string);
    const authorizedCart = JSON.parse(localStorage.getItem(this.getKey()) as string)
      ? JSON.parse(localStorage.getItem(this.getKey()) as string)
      : {};

    for (let key in unAuthorizedCart) {
      if (authorizedCart.hasOwnProperty(key)) {
        authorizedCart[key].amount += unAuthorizedCart[key].amount;
      } else {
        authorizedCart[key] = unAuthorizedCart[key];
      }
    }
    this.setCartInLocalStorage(authorizedCart);
    localStorage.removeItem('unAuthCart');
  }

  setCartInLocalStorage(cart: ICartList) {
    localStorage.setItem(this.getKey(), JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  getInitialAndDiscountPrices() {
    let cart = this.getLocalCart();
    let discountPrice = 0;
    let initialPrice = 0;
    for (let key in cart) {
      if (cart[key].checked) {
        initialPrice += cart[key].amount * cart[key].product.price;
        discountPrice += cart[key].amount * cart[key].product.discountPrice;
      }
    }
    return { initialPrice, discountPrice };
  }

  calculatePersonalDiscount(user: IUser | null) {
    if (!user || !user.spentMoney) {
      return 0;
    }
    const userSpentMoney = user.spentMoney;
    return userSpentMoney >= 100000
      ? 0.25
      : userSpentMoney >= 50000
      ? 0.15
      : userSpentMoney >= 10000
      ? 0.1
      : 0;
  }
}
