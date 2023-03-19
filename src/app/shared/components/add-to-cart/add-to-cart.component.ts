import { Component, Input } from '@angular/core';
import { ModalWindowService } from 'src/app/core/services/modalWindow.service';
import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { IProduct } from 'src/app/types/product.model';
import { getModalConfig } from 'src/app/helpers/cartModalConfig';
import { AutoUnsubscribeComponent } from 'src/app/helpers/AutoUnsubscribeComponent';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent extends AutoUnsubscribeComponent {
  @Input() product: IProduct;
  @Input() productIsChecked: boolean;
  @Input() isOnCartPage: boolean;

  constructor(public cartService: CartService, private modalWindowService: ModalWindowService) {
    super();
  }

  addToCart(product: IProduct) {
    this.cartService.addToCart({
      amount: 1,
      product,
      checked: this.productIsChecked,
      addingTime: Date.now()
    });
  }

  getAmountByProductId(product: IProduct) {
    let cart = this.cartService.getLocalCart();
    if (cart) {
      return product && cart.hasOwnProperty(product.id) ? cart[product.id].amount : 0;
    } else {
      return 0;
    }
  }

  decreaseProduct(product: IProduct) {
    let cart = this.cartService.getLocalCart();
    if (cart[product.id].amount === 1 && this.isOnCartPage) {
      this.openDialog(product);
    } else {
      this.cartService.decreaseProduct(product);
    }
  }

  openDialog(product: IProduct) {
    this.modalWindowService.modal(getModalConfig('single')).subscribe({
      next: (data) => {
        if (data === 'true') {
          this.cartService.decreaseProduct(product);
        }
      },
      error: (err) => console.log(err)
    });
  }
}
