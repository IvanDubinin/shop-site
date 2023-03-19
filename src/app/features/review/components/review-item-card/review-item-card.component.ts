import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Review } from '../../../../types/review.model';
import { UserService } from '../../../../core/services/user.service';
import { ModalWindowService } from '../../../../core/services/modalWindow.service';

const MAX_SHOWN_LENGTH = 500;
const ELLIPSIS = '...';

@Component({
  selector: 'app-review-item-card',
  templateUrl: './review-item-card.component.html',
  styleUrls: ['./review-item-card.component.scss']
})
export class ReviewItemCardComponent implements OnInit {
  @Input() review: Review;
  @Output() reviewUpdated: EventEmitter<Review> = new EventEmitter<Review>();
  @Output() reviewDeleted: EventEmitter<Review> = new EventEmitter<Review>();

  canShowMoreOrLess: boolean;
  isCommentShownFull: boolean;
  shownComment: string;
  isOwnComment: boolean;

  shortenComment() {
    return this.review.comment.slice(0, MAX_SHOWN_LENGTH - ELLIPSIS.length) + ELLIPSIS;
  }

  onMoreOrLessClick() {
    this.isCommentShownFull = !this.isCommentShownFull;
    this.shownComment = this.isCommentShownFull ? this.review.comment : this.shortenComment();
  }

  onReviewUpdated() {
    this.reviewUpdated.emit(this.review);
  }

  private modalConfig = {
    data: {
      title: 'Confirmation',
      content: 'Are you sure you want to remove this review?',
      buttonOK: 'YES',
      buttonNG: 'NO'
    },
    width: '500px',
    panelClass: 'dialog',
    autoFocus: '[name=closeNo]'
  };

  onReviewDeleted() {
    this.modalService.modal(this.modalConfig).subscribe((pressed) => {
      if (pressed && JSON.parse(pressed)) {
        this.reviewDeleted.emit(this.review);
      }
    });
  }

  constructor(public userService: UserService, private modalService: ModalWindowService) {}

  ngOnInit() {
    if (this.review.comment.length > MAX_SHOWN_LENGTH) {
      this.shownComment = this.shortenComment();
      this.isCommentShownFull = false;
      this.canShowMoreOrLess = true;
    } else {
      this.shownComment = this.review.comment;
      this.isCommentShownFull = true;
      this.canShowMoreOrLess = false;
    }
    this.isOwnComment = this.userService.getUser().getValue()?.id === this.review.userId;
  }
}
