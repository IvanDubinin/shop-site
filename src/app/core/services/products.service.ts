import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../../types/product.model';
import { IRawProduct } from '../../types/raw-product.interface';
import { rawProductToIProduct } from '../../types/builders/raw-product-to-product';
import { IHttpParams } from '../../types/HttpParams.interface';
import { ICategory } from '../../types/category.interface';
import { ITempHttpRespMock } from '../../types/temporary-product-service-response';
import { buildParamsObject } from '../../helpers/buildParamsObject';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  params: IHttpParams;

  constructor(private http: HttpClient) {}

  getProducts(params: IHttpParams): Observable<ITempHttpRespMock> {
    const paramsObj = buildParamsObject(params);
    const httpParams = new HttpParams({ fromObject: paramsObj });

    return this.http
      .get<IRawProduct[]>(`${environment.apiUrl}/products`, {
        params: httpParams,
        observe: 'response'
      })
      .pipe(
        map((httpResp) => {
          const rawProducts = httpResp.body!;
          return {
            body: rawProducts?.map((rawProd) => rawProductToIProduct(rawProd)),
            headers: httpResp.headers
          };
        })
      );
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http
      .get<IRawProduct>(`${environment.apiUrl}/products/${id}`)
      .pipe(map((rawProd) => rawProductToIProduct(rawProd)));
  }

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${environment.apiUrl}/categories`);
  }

  getDiscountPercentage(product: IProduct) {
    return (((product.price - product.discountPrice) * 100) / product.price).toFixed();
  }
}
