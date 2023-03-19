import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ReviewService } from 'src/app/core/services/review.service';
import { getAverageRating } from 'src/app/helpers/getAverageRating';

import { IProduct } from 'src/app/types/product.model';
import { productItemCardSettings } from './product-item-card.component.settings';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { WishlistModalComponent } from '../wishlist-modal/wishlist-modal.component';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-product-item-card',
  templateUrl: './product-item-card.component.html',
  styleUrls: ['./product-item-card.component.scss']
})
export class ProductItemCardComponent implements OnInit, OnDestroy {
  @Input() product: IProduct;
  @Input() viewMode: string;

  @HostBinding('class') get getClasses() {
    return productItemCardSettings.hostCssClasses[this.viewMode];
  }

  isFavorite: boolean = false;
  rating: number;
  reviewServiceSubscription: Subscription;
  userServiceSubscription: Subscription;

  constructor(
    private reviewService: ReviewService,
    private userService: UserService,
    private wishlistService: WishlistService,
    public dialog: MatDialog,
    public productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.reviewServiceSubscription = this.reviewService
      .getReviewsByProductId(this.product.id)
      .subscribe((observable) => {
        observable.subscribe({
          next: (reviews) => {
            this.rating = getAverageRating(reviews);
          },
          error: (e) => console.error(e)
        });
      });

    this.userServiceSubscription = this.userService.getUser().subscribe((user) => {
      if (user) {
        this.calculateIsFavorite();
      } else {
        this.isFavorite = false;
      }
    });

    this.calculateIsFavorite();
  }

  ngOnDestroy() {
    this.reviewServiceSubscription.unsubscribe();
    this.userServiceSubscription.unsubscribe();
  }

  calculateIsFavorite() {
    const user = this.userService.getUser().getValue();
    if (this.product && user) {
      this.wishlistService
        .isFavoriteProductForUser(this.product.id, user.id)
        .subscribe((isFavorite) => (this.isFavorite = isFavorite));
    }
  }

  onFavoriteClick() {
    const user = this.userService.getUser().getValue();
    if (user?.role !== 'consumer') return;
    this.dialog
      .open(WishlistModalComponent, {
        maxWidth: '600px',
        minWidth: '400px',
        autoFocus: 'li:first-child input',
        data: {
          userId: user.id,
          productId: this.product.id
        }
      })
      .afterClosed()
      .subscribe(() => this.calculateIsFavorite());
  }

  get discountPercentage() {
    return this.productService.getDiscountPercentage(this.product);
  }
}
