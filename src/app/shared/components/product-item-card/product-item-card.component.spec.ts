import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemCardComponent } from './product-item-card.component';
import { IProductSingleEntityMock } from 'src/mocks/constucted-entities';
import { CustomCurrencyPipe } from 'src/app/shared/pipes/custom-currency/custom-currency.pipe';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ProductsService } from '../../../core/services/products.service';
import { UserService } from '../../../core/services/user.service';
import { ReviewService } from '../../../core/services/review.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { LoggingService } from 'src/app/core/services/logging-service';

describe('ProductItemCardComponent', () => {
  let component: ProductItemCardComponent;
  let fixture: ComponentFixture<ProductItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductItemCardComponent, CustomCurrencyPipe],
      imports: [HttpClientModule, RouterTestingModule, MatSnackBarModule, MatDialogModule],
      providers: [
        ProductsService,
        UserService,
        ReviewService,
        HttpClient,
        HttpHandler,
        LoggingService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemCardComponent);
    component = fixture.componentInstance;
    component.product = IProductSingleEntityMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
