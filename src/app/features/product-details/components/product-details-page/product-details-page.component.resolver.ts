import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from 'src/app/core/services/products.service';
import { IProduct } from 'src/app/types/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductNameToBreadcrumbsResolver implements Resolve<any> {
  constructor(private productService: ProductsService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const productId = +route.paramMap.get('productId')!;
    let product: IProduct;
    try {
      product = await firstValueFrom(this.productService.getProductById(productId));
    } catch (err) {
      return err;
    }
    return product;
  }
}
