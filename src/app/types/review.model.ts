import { msToDate } from '../helpers/msToDate';

interface ReviewData {
  userId: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
}

interface ReviewRawChanges {
  createdAt: number;
  updatedAt: number;
}

interface ReviewChanges {
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewId {
  id: number;
}

export type INewReview = ReviewData & Partial<ReviewRawChanges> & Partial<ReviewId>;
export type IRawReview = ReviewData & ReviewRawChanges & ReviewId;
export type IReview = ReviewData & ReviewChanges & ReviewId;

export class Review implements IReview {
  public readonly id: number;
  public readonly userId: number;
  public readonly productId: number;

  public author: string;
  public rating: number;
  public comment: string;

  public readonly createdAt: Date;
  private _updatedAt: Date;

  public get updatedAt() {
    return this._updatedAt;
  }

  constructor({
    id,
    userId,
    productId,
    author,
    comment,
    rating,
    updatedAt,
    createdAt
  }: IRawReview) {
    this.id = id;
    this.userId = userId;
    this.productId = productId;
    this.author = author;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = msToDate(createdAt);
    this._updatedAt = msToDate(updatedAt);
  }

  public update(): Review {
    this._updatedAt = new Date();
    return this;
  }

  public toRawReview(): IRawReview {
    return {
      ...this,
      createdAt: this.createdAt.valueOf(),
      updatedAt: this._updatedAt.valueOf()
    };
  }
}

export const setChangesToReview = (newReview: INewReview): INewReview => {
  const changes: ReviewRawChanges = {
    createdAt: new Date().valueOf(),
    updatedAt: new Date().valueOf()
  };
  return { ...newReview, ...changes };
};
