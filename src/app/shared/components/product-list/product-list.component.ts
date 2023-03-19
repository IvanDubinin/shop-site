import { Component, Input, HostBinding } from '@angular/core';
import { IProduct } from 'src/app/types/product.model';
import { productItemCardSettings } from '../product-item-card/product-item-card.component.settings';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() products: Array<IProduct>;
  @Input() viewMode: string = productItemCardSettings.viewModes['list'];
  @HostBinding('class') get getClasses() {
    return this.viewMode;
  }
  constructor() {}
}
