import { IProduct } from 'src/app/types/product.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomCurrencyPipe } from 'src/app/shared/pipes/custom-currency/custom-currency.pipe';
import { ProductsService } from 'src/app/core/services/products.service';
import { IProductSingleEntityMock } from 'src/mocks/constucted-entities';

import { ProductDetailsPageComponent } from './product-details-page.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { IUser } from 'src/app/types/user.interface';
import { rawSellerMock, rawUserMock } from 'src/mocks/raw-entities';
import { UserService } from 'src/app/core/services/user.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
class MockUserServiceEmpty {
  getUser(): BehaviorSubject<IUser | null> {
    return new BehaviorSubject<IUser | null>(null);
  }

  isConsumer() {
    return false;
  }
}

class MockUserServiceUser {
  getUser(): BehaviorSubject<IUser | null> {
    return new BehaviorSubject<IUser | null>(rawUserMock);
  }

  isConsumer() {
    return true;
  }
}

class MockUserServiceSeller {
  getUser(): BehaviorSubject<IUser | null> {
    return new BehaviorSubject<IUser | null>(rawSellerMock);
  }

  isConsumer() {
    return false;
  }
}

class MockWishlistServiceFavorite {
  isFavoriteProductForUser(_1: string, _2: string) {
    return of(true);
  }
}

class MockWishlistServiceUsual {
  isFavoriteProductForUser(_1: string, _2: string) {
    return of(false);
  }
}

class MockProductService {
  getDiscountPercentage(product: IProduct) {
    return 0;
  }
}

describe('ProductDetailsPageComponent', () => {
  let component: ProductDetailsPageComponent;
  let fixture: ComponentFixture<ProductDetailsPageComponent>;

  describe('for authenticated consumer user not liked the product', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ProductDetailsPageComponent, CustomCurrencyPipe],
        imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, MatDialogModule],
        providers: [
          { provide: WishlistService, useClass: MockWishlistServiceUsual },
          { provide: UserService, useClass: MockUserServiceUser },
          { provide: ProductsService, useClass: MockProductService }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductDetailsPageComponent);
      component = fixture.componentInstance;
      component.product = IProductSingleEntityMock;
      fixture.detectChanges();
    });

    it('should show the empty heart button', () => {
      const button = fixture.nativeElement.querySelector('.favorite-button');
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('favorite_border');
    });
  });

  describe('for authenticated not-consumer user', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ProductDetailsPageComponent, CustomCurrencyPipe],
        imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, MatDialogModule],
        providers: [
          { provide: ProductsService, useClass: MockWishlistServiceFavorite },
          { provide: UserService, useClass: MockUserServiceSeller },
          { provide: ProductsService, useClass: MockProductService }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductDetailsPageComponent);
      component = fixture.componentInstance;
      component.product = IProductSingleEntityMock;
      fixture.detectChanges();
    });

    it('should not show heart button', () => {
      const button = fixture.nativeElement.querySelector('.favorite-button');
      expect(button).toBeFalsy();
    });
  });

  describe('for non-auth user', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ProductDetailsPageComponent, CustomCurrencyPipe],
        imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, MatDialogModule],
        providers: [
          { provide: ProductsService, useClass: MockWishlistServiceFavorite },
          { provide: UserService, useClass: MockUserServiceEmpty },
          { provide: ProductsService, useClass: MockProductService }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductDetailsPageComponent);
      component = fixture.componentInstance;
      component.product = IProductSingleEntityMock;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not show heart button', () => {
      const button = fixture.nativeElement.querySelector('.favorite-button');
      expect(button).toBeFalsy();
    });
  });
});
