import { Component, Input, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';
const STARS_AMOUNT = 5;
@Component({
  selector: 'rating-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  private _rating: number = 0;
  @HostBinding('class') get classes() {
    return this.isActive ? 'active' : 'passive';
  }
  @HostBinding('title') get title() {
    return !this.isActive && this.renderTitle ? `${this.rating}/${this.maxRating}` : '';
  }

  @Output() ratingChanged: EventEmitter<number> = new EventEmitter<number>();
  @Input() roundDec: number = 1;
  @Input() starsAmount: number = STARS_AMOUNT;
  @Input() isActive: boolean = true;
  @Input() set rating(rating: number) {
    this._rating = this.roundToDec(rating);
    this.calcPartiallyPaintedStarFields();
  }
  @Input() setSelfRatingOnClick: boolean = false;
  @Input() maxRating: number | null = null;
  @Input() renderTitle = true;
  get rating() {
    return this._rating;
  }
  starArray: Array<any>;
  ratingAmountPerStar: number;
  partiallyPaintedStar = {
    index: 0,
    gradientOffset: 0,
    gradient1Id: Math.random(),
    gradient2Id: Math.random()
  };

  constructor() {}

  ngOnInit(): void {
    this.starArray = new Array(this.starsAmount);
    this.maxRating = this.maxRating || this.starsAmount;
    this.ratingAmountPerStar = this.maxRating / this.starsAmount;
    this.calcPartiallyPaintedStarFields();
  }

  calcPartiallyPaintedStarFields() {
    let currentStarMaxRating = 0;
    let starIndex = 0;
    for (starIndex; currentStarMaxRating < this.rating; starIndex++) {
      currentStarMaxRating += this.ratingAmountPerStar;
    }
    this.updatePartiallyPaintedStar(--starIndex);
  }

  updatePartiallyPaintedStar(starIndex: number): void {
    const maxGradientLength = 100;
    const edgeRatingFuse = this.rating === 0 ? 0 : maxGradientLength;
    this.partiallyPaintedStar.index = starIndex;
    this.partiallyPaintedStar.gradientOffset =
      ((this.rating % this.ratingAmountPerStar) / this.ratingAmountPerStar) * maxGradientLength ||
      edgeRatingFuse;
  }

  onRatingChange(starIndex: number): void {
    if (!this.isActive || starIndex > this.starsAmount) {
      return;
    }
    const newRating = starIndex * this.ratingAmountPerStar;
    if (this.setSelfRatingOnClick) {
      this.rating = newRating;
    }
    this.ratingChanged.emit(newRating);
  }

  roundToDec(number: number) {
    return Math.round(number * Math.pow(10, this.roundDec)) / Math.pow(10, this.roundDec);
  }
}
