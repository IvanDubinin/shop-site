import { rawProductMock } from './raw-entities';
import { rawProductToIProduct } from 'src/app/types/builders/raw-product-to-product';
import { Review } from '../app/types/review.model';

export const IProductSingleEntityMock = rawProductToIProduct(rawProductMock);
export const IProductArrayMock = [IProductSingleEntityMock, IProductSingleEntityMock];

export const reviewLong: Review = new Review({
  id: 1,
  userId: 0,
  productId: 1,
  author: 'Anonymous',
  rating: 5,
  comment:
    'the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing the most cool thing ',
  createdAt: new Date().valueOf(),
  updatedAt: new Date().valueOf()
});

export const reviewShort: Review = new Review({
  id: 1,
  userId: 0,
  productId: 1,
  author: 'petya vasechkin',
  rating: 5,
  comment: 'the most cool thing',
  createdAt: new Date().valueOf(),
  updatedAt: new Date().valueOf()
});

export const reviews: Array<Review> = [reviewLong, reviewShort];
