import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../types/user.interface';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ReviewService } from 'src/app/core/services/review.service';
import { Review } from '../../../types/review.model';
import { Observer } from 'rxjs';

const RATINGS = ['', 'Very Bad', 'Bad', 'Not Bad', 'Good', 'Very Good'];
const ADD_FEEDBACK = 'Add feedback';
const EDIT_FEEDBACK = 'Save changes';

interface dataForReviewModal {
  productId: number;
  rating?: number;
  review?: Review;
}

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss']
})
export class ReviewModalComponent implements OnInit {
  user: IUser;
  rating: number;
  buttonName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: dataForReviewModal,
    public userService: UserService,
    public dialog: MatDialog,
    private reviewService: ReviewService
  ) {
    this.user = userService.authorizedUser;
  }

  setRating(newRating: number) {
    this.rating = newRating;
  }

  ngOnInit(): void {
    this.form.setValue({
      name: `${this.user?.firstName} ${this.user?.lastName}`,
      comment: this.data.review?.comment ?? ''
    });
    this.rating = this.data.review?.rating || this.data.rating || 0;
    this.buttonName = this.data.review ? EDIT_FEEDBACK : ADD_FEEDBACK;
  }

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    comment: new FormControl('', [
      Validators.required,
      Validators.minLength(30),
      Validators.maxLength(1000)
    ])
  });

  getRatingInWords() {
    return RATINGS[this.rating];
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get comment(): FormControl {
    return this.form.get('comment') as FormControl;
  }

  onSubmit() {
    const processDialog: Partial<Observer<Review>> = {
      next: () => {
        this.form.reset();
        this.dialog.closeAll();
      },
      error: (e) => console.error(e)
    };

    if (this.form.valid) {
      if (this.data.review) {
        // let's edit the existing review
        this.data.review.author = this.name.value;
        this.data.review.rating = this.rating;
        this.data.review.comment = this.comment.value;
        this.reviewService.updateReview(this.data.review).subscribe(processDialog);
      } else {
        // let's create a new one
        this.reviewService
          .createReview({
            userId: this.user.id,
            productId: this.data.productId,
            author: this.name.value,
            rating: this.rating,
            comment: this.comment.value
          })
          .subscribe(processDialog);
      }
    }
  }

  getErrorEmail() {
    return this.comment.errors?.['required']
      ? 'Comment is required'
      : this.comment.errors?.['minlength']
      ? 'Min length is 30 symbols'
      : this.comment.errors?.['maxlength']
      ? 'Max length is 1000 symbols'
      : '';
  }
}
