import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { IHttpParams } from '../../types/HttpParams.interface';
import { first, map, NEVER, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { buildParamsObject } from '../../helpers/buildParamsObject';
import { environment } from '../../../environments/environment';
import { IWishlist } from '../../types/wishlist.interface';
import { IProduct } from '../../types/product.model';
import { ProductsService } from './products.service';
import { switchMap } from 'rxjs/operators';
import { ArrayHelper } from '../../helpers/array.helper';
import { LoggingService } from './logging-service';

const WISHLISTS = 'wishlists';
const BACK_URL: string = `${environment.apiUrl}/${WISHLISTS}`;

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  products: ArrayHelper<IProduct>;
  wishlists: ArrayHelper<IWishlist>;

  private productsGetter = (wishlistId: number): Observable<IProduct[]> => {
    return this.getWishlistById(wishlistId).pipe(
      switchMap((wl) => (wl !== null ? this.getProductsInWishlist(wl!) : []))
    );
  };

  constructor(
    private userService: UserService,
    private productService: ProductsService,
    private http: HttpClient,
    private loggingService: LoggingService
  ) {
    this.products = new ArrayHelper<IProduct>(this.productsGetter.bind(this));
    this.wishlists = new ArrayHelper<IWishlist>(this.getWishlistsByUser.bind(this));
  }

  getWishlists(params: IHttpParams = {}): Observable<IWishlist[]> {
    const httpParams = new HttpParams({
      fromObject: buildParamsObject(params)
    });

    return this.http
      .get<IWishlist[]>(BACK_URL, {
        params: httpParams,
        observe: 'body'
      })
      .pipe(first());
  }

  getWishlistById(wishlistId: number): Observable<IWishlist | null> {
    const params: IHttpParams = {
      id: wishlistId
    };
    return this.getWishlists(params).pipe(
      map((wishlists) => {
        return wishlists.length > 0 ? wishlists[0] : null;
      })
    );
  }

  getWishlistsByUser(userId: number): Observable<IWishlist[]> {
    const params: IHttpParams = {
      userId
    };
    return this.getWishlists(params).pipe(
      tap((wishlists) => {
        return wishlists.some((wl) => wl.isDefault)
          ? wishlists
          : wishlists.push(WishlistService.getDefaultWishlist(userId));
      })
    );
  }

  private static getDefaultWishlist(userId: number): IWishlist {
    return {
      id: null,
      name: 'Default wishlist',
      isDefault: true,
      products: [],
      userId
    };
  }

  addWishlist(wishlist: Omit<IWishlist, 'id'>, message?: string): Observable<IWishlist> {
    return this.http
      .post<IWishlist>(BACK_URL, wishlist, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'body'
      })
      .pipe(
        first(),
        tap((wishlist) => {
          const user = this.userService.getUser().getValue();
          if (user) {
            this.wishlists.forceCacheUpdate(user.id);
            this.loggingService.logBusinessAction({
              title: `Success`,
              message: message ? message : `Wishlist '${wishlist.name}' has been added`
            });
          }
          return wishlist;
        })
      );
  }

  deleteWishlist(wishlist: IWishlist): Observable<never> {
    if (wishlist.id === null) return NEVER;
    return this.http.delete<never>(`${BACK_URL}/${wishlist.id}`).pipe(
      first(),
      tap((_) => {
        const user = this.userService.getUser().getValue();
        if (user) {
          this.wishlists.forceCacheUpdate(user.id);
          this.loggingService.logBusinessAction({
            title: `Success`,
            message: `Wishlist '${wishlist.name}' has been removed`
          });
        }
      })
    );
  }

  updateWishlist(wishlist: IWishlist, message?: string): Observable<IWishlist> {
    if (wishlist.id === null) {
      return this.addWishlist(wishlist).pipe(
        switchMap((newWishlist) => this.updateWishlist(newWishlist, message))
      );
    }
    return this.http.put<IWishlist>(`${BACK_URL}/${wishlist.id}`, wishlist).pipe(
      first(),
      tap((newWishlist) => {
        const user = this.userService.getUser().getValue();
        if (user) {
          this.wishlists.forceCacheUpdate(user.id);
          this.products.forceCacheUpdate(newWishlist.id!);
          this.loggingService.logBusinessAction({
            title: `Success`,
            message: message ? message : `Wishlist '${wishlist.name}' has been updated`
          });
        }
      })
    );
  }

  addProductToWishlist(productId: number, wishlist: IWishlist): Observable<IWishlist> {
    const user = this.userService.getUser().getValue();
    if (!user) return of(wishlist);
    if (wishlist.id === null) {
      return this.addWishlist(wishlist).pipe(
        switchMap((newWishlist) => this.addProductToWishlist(productId, newWishlist))
      );
    }
    return this.productService.getProductById(productId).pipe(
      switchMap((product) => {
        const newWL: IWishlist = {
          ...wishlist,
          products: [...wishlist.products, productId]
        };
        return this.updateWishlist(
          newWL,
          `Product '${product.name}' has been added to '${wishlist.name}' wishlist`
        );
      })
    );
  }

  deleteProductFromWishlist(productId: number, wishlist: IWishlist): Observable<IWishlist> {
    const newProducts = wishlist.products.filter((p) => p !== productId);
    if (newProducts.length === wishlist.products.length) return NEVER;
    const newWL: IWishlist = {
      ...wishlist,
      products: newProducts
    };
    if (wishlist.id === null) {
      return this.addWishlist(newWL);
    }
    return this.productService
      .getProductById(productId)
      .pipe(
        switchMap((product) =>
          this.updateWishlist(
            newWL,
            `Product '${product.name}' has been removed from '${wishlist.name}' wishlist`
          )
        )
      );
  }

  getProductsInWishlist(wishlist: IWishlist): Observable<IProduct[]> {
    return wishlist.products.length > 0
      ? this.productService
          .getProducts({ id: wishlist.products })
          .pipe(map((response) => response.body! as IProduct[]))
      : of([] as IProduct[]);
  }

  isFavoriteProductForUser(productId: number, userId: number | undefined): Observable<boolean> {
    return userId
      ? this.getWishlistsByUser(userId).pipe(
          map((wishlists) => {
            return wishlists.some((w) => w.products.includes(productId));
          })
        )
      : of(false);
  }
}
