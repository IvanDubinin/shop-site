import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { ICartList } from 'src/app/types/cart.interface';
import { IProduct } from 'src/app/types/product.model';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
  @Input() sellerName: string;
  @Input() products: IProduct[];

  allChecked: boolean = false;
  someChecked: boolean = false;

  cart: ICartList;

  constructor(public cartService: CartService) {
    this.cart = this.cartService.getLocalCart();
  }

  ngOnInit(): void {
    if (!this.products) this.products = [];
    this.updateChecking();
  }

  sortProductsByAddingTime() {
    return this.products.sort((productA, productB) => {
      return this.cart[productB.id].addingTime - this.cart[productA.id].addingTime;
    });
  }

  updateChecking() {
    this.allChecked = this.getProductIds()
      .map((id) => this.cart[id])
      .every((item) => item.checked);
    if (!this.allChecked) {
      this.someChecked =
        this.getProductIds()
          .map((id) => this.cart[id])
          .filter((t) => t.checked).length > 0;
    }
  }

  setAll(checked: boolean) {
    this.allChecked = checked;
    if (!this.products) {
      return;
    }
    this.getProductIds()
      .map((id) => this.cart[id])
      .forEach((t) => (t.checked = checked));
    this.cartService.setCartInLocalStorage(this.cart);
  }

  getProductIds() {
    return this.products.map((product) => product.id);
  }

  setSingle(id: number, checked: boolean) {
    this.cart[id].checked = checked;
    this.cartService.setCartInLocalStorage(this.cart);
    this.updateChecking();
  }

  productIsChecked(productId: number) {
    return this.cart[productId].checked;
  }
}
