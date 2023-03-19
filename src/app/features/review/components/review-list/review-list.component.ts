import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReviewService } from '../../../../core/services/review.service';
import { UserService } from '../../../../core/services/user.service';
import { arrayPartition } from '../../../../helpers/array-partition';
import { Review } from '../../../../types/review.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ReviewModalComponent } from '../../../../shared/components';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit, OnDestroy {
  @Input() productId: number;

  reviews: Array<Review> = [];
  reviewServiceSubscription: Subscription;
  userServiceSubscription: Subscription;

  constructor(
    private reviewService: ReviewService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reviewServiceSubscription = this.reviewService
      .getReviewsByProductId(this.productId)
      .subscribe((observable) => {
        observable.subscribe((reviews) => {
          const { accepted: ourReviews, rejected: theirReviews } = arrayPartition(
            reviews,
            (review) => review.userId === this.userService.getUser().getValue()?.id
          );
          this.reviews = ourReviews.concat(theirReviews);
        });
      });
    this.userServiceSubscription = this.userService.getUser().subscribe(() => {
      if (this.userService.isConsumer()) {
        this.reviewService.invalidatedCache(this.productId);
      }
    });
  }

  ngOnDestroy() {
    this.reviewServiceSubscription.unsubscribe();
    this.userServiceSubscription.unsubscribe();
  }

  removeReview(removedReview: Review) {
    this.reviewService.deleteReview(removedReview).subscribe(() => {});
  }

  updateReview(updatedReview: Review) {
    this.dialog.open(ReviewModalComponent, {
      width: '500px',
      data: {
        review: updatedReview
      }
    });
  }
}
