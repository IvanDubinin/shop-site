import { Component, Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import { IProductsWithLastAddingTime } from 'src/app/types/cart.interface';

import { IProduct } from 'src/app/types/product.model';

@Component({
  selector: 'app-cart-list-wrapper',
  templateUrl: './cart-list-wrapper.component.html',
  styleUrls: ['./cart-list-wrapper.component.scss']
})
export class CartListWrapperComponent {
  @Input() mapOfProducts: Map<string, IProductsWithLastAddingTime>;
  @Input() products: IProduct[];

  addingDateDescOrder = (
    a: KeyValue<string, IProductsWithLastAddingTime>,
    b: KeyValue<string, IProductsWithLastAddingTime>
  ): number => {
    return b.value.lastAddingTime - a.value.lastAddingTime;
  };
}
