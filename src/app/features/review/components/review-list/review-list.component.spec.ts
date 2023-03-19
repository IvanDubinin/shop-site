import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewListComponent } from './review-list.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../../../../types/user.interface';
import { rawUserMock } from '../../../../../mocks/raw-entities';
import { UserService } from '../../../../core/services/user.service';
import { ReviewService } from '../../../../core/services/review.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Review } from '../../../../types/review.model';
import { reviews } from '../../../../../mocks/constucted-entities';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

class MockUserService {
  getById(_: string): Observable<IUser> {
    return new Observable<IUser>((subscriber) => {
      subscriber.next(rawUserMock);
    });
  }
  getUser(): BehaviorSubject<IUser | null> {
    return new BehaviorSubject<IUser | null>(rawUserMock);
  }
}

class MockReviewServiceEmpty {
  getReviewsByProductId(_: string): BehaviorSubject<Observable<Review[]>> {
    return new BehaviorSubject<Observable<Review[]>>(
      new Observable<Review[]>((subscriber) => {
        subscriber.next();
      })
    );
  }
}

class MockReviewServiceFull {
  getReviewsByProductId(_: string): BehaviorSubject<Observable<Review[]>> {
    return new BehaviorSubject<Observable<Review[]>>(
      new Observable<Review[]>((subscriber) => {
        subscriber.next(reviews);
      })
    );
  }
}

describe('ReviewListComponent', () => {
  let component: ReviewListComponent;
  let fixture: ComponentFixture<ReviewListComponent>;

  describe('without reviews', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ReviewListComponent],
        imports: [HttpClientTestingModule, MatDialogModule],
        providers: [
          { provide: UserService, useClass: MockUserService },
          { provide: ReviewService, useClass: MockReviewServiceEmpty },
          HttpClient,
          HttpHandler,
          { provide: MAT_DIALOG_DATA, useValue: { data: { productId: 5, rating: 5 } } }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      TestBed.inject(HttpClient);
      TestBed.inject(HttpTestingController);
      fixture = TestBed.createComponent(ReviewListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should warn about it', () => {
      const text = fixture.nativeElement.querySelector('.no-review');
      expect(text).toBeTruthy();
      expect(text.textContent).toContain('There are no comments yet. Be the first to review');
    });
  });

  describe('with reviews', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ReviewListComponent],
        imports: [HttpClientTestingModule, MatDialogModule],
        providers: [
          { provide: UserService, useClass: MockUserService },
          { provide: ReviewService, useClass: MockReviewServiceFull },
          HttpClient,
          HttpHandler,
          { provide: MAT_DIALOG_DATA, useValue: { data: { productId: 5, rating: 5 } } }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      TestBed.inject(HttpClient);
      TestBed.inject(HttpTestingController);
      fixture = TestBed.createComponent(ReviewListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
