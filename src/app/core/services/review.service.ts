import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { IRawReview, Review, INewReview, setChangesToReview } from '../../types/review.model';
import { IHttpParams } from '../../types/HttpParams.interface';
import { buildParamsObject } from '../../helpers/buildParamsObject';

const REVIEWS = 'reviews';
const BACK_URL: string = `${environment.apiUrl}/${REVIEWS}`;

interface CachedObject<T extends object> {
  isValid: boolean;
  cached: T;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly reviewsByProduct: Map<
    number,
    CachedObject<BehaviorSubject<Observable<Review[]>>>
  >;

  constructor(private http: HttpClient) {
    this.reviewsByProduct = new Map<number, CachedObject<BehaviorSubject<Observable<Review[]>>>>();
  }

  getById(id: string): Observable<Review> {
    return this.http.get<Review>(`${BACK_URL}/${id}`);
  }

  getReviews(params: IHttpParams = {}): Observable<Review[]> {
    const httpParams = new HttpParams({
      fromObject: buildParamsObject(params)
    });

    return this.http
      .get<IRawReview[]>(BACK_URL, {
        params: httpParams,
        observe: 'response'
      })
      .pipe(
        map((httpResponse) => {
          const rawReviews: IRawReview[] = httpResponse.body!;
          return rawReviews.map((raw) => new Review(raw));
        })
      );
  }

  getReviewsByProductId(productId: number): BehaviorSubject<Observable<Review[]>> {
    const cachedObject = this.reviewsByProduct.get(productId);

    if (cachedObject && cachedObject.isValid) {
      return cachedObject.cached;
    }

    const params: IHttpParams = {
      sort: 'updatedAt',
      order: 'desc',
      productId
    };
    const query = this.getReviews(params);

    if (cachedObject && !cachedObject.isValid) {
      cachedObject.cached.next(query);
      cachedObject.isValid = true;
      return cachedObject.cached;
    } else {
      const newCachedObject: CachedObject<BehaviorSubject<Observable<Review[]>>> = {
        isValid: true,
        cached: new BehaviorSubject<Observable<Review[]>>(query)
      };
      this.reviewsByProduct.set(productId, newCachedObject);
      return newCachedObject.cached;
    }
  }

  getReviewsByUserId(userId: number): Observable<Review[]> {
    const params: IHttpParams = {
      userId
    };
    return this.getReviews(params);
  }

  getReviewsByUserIdAndProductId(userId: number, productId: number): Observable<Review[]> {
    const params: IHttpParams = {
      userId,
      productId
    };
    return this.getReviews(params);
  }

  createReview(review: INewReview): Observable<Review> {
    const newReview: INewReview = setChangesToReview(review);
    return this.http
      .post<IRawReview>(BACK_URL, newReview, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'body'
      })
      .pipe(
        map((raw) => {
          this.invalidatedCache(review.productId);
          return new Review(raw);
        }),
        first()
      );
  }

  deleteReview(removedReview: Review): Observable<Review> {
    return this.http.delete<IRawReview>(`${BACK_URL}/${removedReview.id}`).pipe(
      map((raw) => {
        this.invalidatedCache(removedReview.productId);
        return new Review(raw);
      }),
      first()
    );
  }

  updateReview(review: Review): Observable<Review> {
    const updatedReview: IRawReview = review.update().toRawReview();
    return this.http.put<IRawReview>(`${BACK_URL}/${updatedReview.id}`, updatedReview).pipe(
      map((raw) => {
        this.invalidatedCache(review.productId);
        return new Review(raw);
      }),
      first()
    );
  }

  public invalidatedCache(productId: number): void {
    const cachedObject = this.reviewsByProduct.get(productId);
    if (cachedObject) {
      cachedObject.isValid = false;
    }
    this.getReviewsByProductId(productId);
  }
}
