import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from '../../../../../types/product.model';
import { ProductsService } from '../../../../../core/services/products.service';
import { UserService } from '../../../../../core/services/user.service';
import { Subscription } from 'rxjs';
import { IWishlist } from 'src/app/types/wishlist.interface';
import { WishlistService } from 'src/app/core/services/wishlist.service';
// import { IProduct } from '../../types/product.model';
// import { ProductsService } from '../../core/services/products.service';
// import { UserService } from '../../core/services/user.service';
import { Observable } from 'rxjs';
// import { WishlistService } from '../../core/services/wishlist.service';
// import { IWishlist } from '../../types/wishlist.interface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist-page.component.html',
  styleUrls: ['./wishlist-page.component.scss']
})
export class WishlistPageComponent implements OnInit {
  oldWishlistName: string | null = null;
  wishlists: Observable<IWishlist[]>;
  products: Observable<IProduct[]>;
  currentWishlist: number = 0;

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private wishlistService: WishlistService
  ) {
    this.currentWishlist = 0;
  }

  ngOnInit(): void {
    const user = this.userService.getUser().getValue();
    if (!user) return;
    this.wishlists = this.wishlistService.wishlists.getObjects(user.id).pipe(
      tap((wls) => {
        if (wls.length > 0) {
          this.updateProductSubscription(wls[this.currentWishlist]);
        }
        return wls;
      })
    );
    this.wishlistService.wishlists.forceCacheUpdate(user.id);
  }

  showWishlist(index: number, wishlist: IWishlist) {
    this.currentWishlist = index;
    this.updateProductSubscription(wishlist);
  }

  private updateProductSubscription(wishlist: IWishlist) {
    if (wishlist.id !== null) {
      this.products = this.wishlistService.products.getObjects(wishlist.id);
      this.wishlistService.products.forceCacheUpdate(wishlist.id);
    }
  }

  deleteWishlist(wishlist: IWishlist, index: number) {
    this.wishlistService.deleteWishlist(wishlist).subscribe(() => {
      if (this.currentWishlist === index) {
        this.currentWishlist = index - 1;
      }
    });
  }

  updateWishlistName(newWishlistName: string, wishlist: IWishlist) {
    if (newWishlistName !== wishlist.name) {
      const newWL: IWishlist = {
        ...wishlist,
        name: newWishlistName
      };
      this.wishlistService.updateWishlist(newWL).subscribe((_) => {});
    }
  }
}
