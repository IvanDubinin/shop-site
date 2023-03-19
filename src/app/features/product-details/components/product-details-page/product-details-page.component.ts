import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/types/product.model';

import { UserService } from '../../../../core/services/user.service';
import { IUser } from '../../../../types/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { ReviewModalComponent } from '../../../../shared/components';
import { ReviewService } from 'src/app/core/services/review.service';
import { getAverageRating } from 'src/app/helpers/getAverageRating';
import { Subscription } from 'rxjs';
import { SignInUpModalWindowComponent } from '../../../auth/components';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { WishlistModalComponent } from 'src/app/shared/components/wishlist-modal/wishlist-modal.component';
import { ProductsService } from 'src/app/core/services/products.service';

const errorMessage = 'product does not exist';
const ADD_FEEDBACK = 'Add new feedback';
const SIGN_IN_ADD_FEEDBACK = 'Sign in and add new feedback';

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.scss'],
  providers: []
})
export class ProductDetailsPageComponent implements OnInit, OnDestroy {
  product: IProduct;
  errorStatus: string | undefined;
  columnsToDisplay = ['key', 'value'];

  currentUser: IUser | undefined;
  rating: number;
  isFavorite: boolean = false;
  hasCurrentUserAReview: boolean;

  reviewServiceSubscription: Subscription;
  userServiceSubscription: Subscription;
  reviewButtonTitle: string;

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public dialog: MatDialog,
    private reviewService: ReviewService,
    private wishlistService: WishlistService,
    public productService: ProductsService
  ) {
    if (this.route.routeConfig && this.route.snapshot.data['product'].createdAt) {
      this.route.routeConfig.data = {
        product: this.route.snapshot.data['product'],
        breadcrumb: this.route.snapshot.data['product']['name']
      };
    }
  }

  ngOnInit(): void {
    if (this.route.snapshot.data['product']?.createdAt) {
      this.product = this.route.snapshot.data['product'];
      this.getRating();
      this.userServiceSubscription = this.userService.getUser().subscribe((user) => {
        this.currentUser = user ?? undefined;
        if (user) {
          this.calculateIsFavorite();
          this.reviewButtonTitle = ADD_FEEDBACK;
          this.wishlistService.wishlists.forceCacheUpdate(user.id);
        } else {
          this.isFavorite = false;
          this.reviewButtonTitle = SIGN_IN_ADD_FEEDBACK;
        }
        this.calculateIfUserHasReview(user);
      });
    } else {
      this.errorStatus = errorMessage;
    }
  }

  getRating() {
    this.reviewServiceSubscription = this.reviewService
      .getReviewsByProductId(this.product.id)
      .subscribe((observable) => {
        this.calculateIfUserHasReview(this.userService.currentUser);
        observable.subscribe({
          next: (reviews) => {
            this.rating = getAverageRating(reviews);
          },
          error: (e) => console.error(e)
        });
      });
  }

  addReview(rating: number = 0): void {
    if (!this.currentUser) {
      this.dialog
        .open(SignInUpModalWindowComponent, {
          width: '600px'
        })
        .afterClosed()
        .subscribe(() => this.openReviewModal(rating));
    } else {
      this.openReviewModal(rating);
    }
  }

  openReviewModal(rating: number = 0): void {
    if (!this.currentUser || this.hasCurrentUserAReview) return;
    const dialogRef = this.dialog.open(ReviewModalComponent, {
      width: '500px',
      data: {
        productId: this.product.id,
        rating
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getRating();
    });
  }

  ngOnDestroy() {
    this.reviewServiceSubscription?.unsubscribe();
    this.userServiceSubscription?.unsubscribe();
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

  calculateIfUserHasReview(user: IUser | null) {
    if (user?.role !== 'consumer') {
      this.hasCurrentUserAReview = false;
      return;
    }
    this.reviewService
      .getReviewsByUserIdAndProductId(user.id, this.product.id)
      .subscribe((reviews) => {
        this.hasCurrentUserAReview = reviews.length > 0;
      });
  }

  get discountPercentage() {
    return this.productService.getDiscountPercentage(this.product);
  }
}
