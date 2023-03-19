import { Component, Input } from '@angular/core';
import { ModalWindowService } from 'src/app/core/services/modalWindow.service';
import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { getModalConfig } from 'src/app/helpers/cartModalConfig';
import { IProduct } from 'src/app/types/product.model';
import { AutoUnsubscribeComponent } from 'src/app/helpers/AutoUnsubscribeComponent';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-cart-list-item',
  templateUrl: './cart-list-item.component.html',
  styleUrls: ['./cart-list-item.component.scss']
})
export class CartListItemComponent extends AutoUnsubscribeComponent {
  @Input() product: IProduct;
  @Input() productIsChecked: boolean;

  constructor(
    public cartService: CartService,
    private modalWindowService: ModalWindowService,
    public productService: ProductsService
  ) {
    super();
  }

  openDialog() {
    this.modalWindowService.modal(getModalConfig('single')).subscribe({
      next: (data) => {
        if (data === 'true') {
          this.cartService.removeProduct(this.product.id);
        }
      },
      error: (err) => console.log(err)
    });
  }

  get discountPercentage() {
    return this.productService.getDiscountPercentage(this.product);
  }
}
