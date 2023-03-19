import { Review } from '../types/review.model';

export function getAverageRating(reviews: Review[]) {
  const averageRating =
    reviews.reduce((acc: number, review: Review) => (acc += review.rating), 0) / reviews.length;
  return +averageRating.toFixed(1) || 0;
}
