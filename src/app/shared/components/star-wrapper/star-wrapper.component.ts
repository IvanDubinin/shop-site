import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-star-wrapper',
  templateUrl: './star-wrapper.component.html',
  styleUrls: ['./star-wrapper.component.scss']
})
export class StarWrapperComponent {
  @Input() rating: number = 0;
  @Input() allowToEditRating: boolean = false;
  @Output() ratingChanged = new EventEmitter<number>();

  constructor(public dialog: MatDialog) {}

  openReviewModal(rating: number) {
    this.ratingChanged.emit(rating);
  }
}
