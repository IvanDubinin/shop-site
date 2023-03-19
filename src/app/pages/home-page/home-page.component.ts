import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../types/product.model';
import { IHttpParams } from '../../types/HttpParams.interface';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [ProductsService]
})
export class HomePageComponent implements OnInit {
  products: Array<IProduct>;
  viewMode: string = 'list';
  params: IHttpParams = {
    sort: 'updatedAt',
    order: 'desc',
    limit: 5
  };

  constructor(private productService: ProductsService) {}
  ngOnInit(): void {
    this.productService.getProducts(this.params).subscribe({
      next: (data) => (this.products = data.body!),
      error: (err) => console.log(err)
    });
  }
}
