import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { AddToCartComponent } from '../../../shared/components/add-to-cart/add-to-cart.component';
import { UserService } from 'src/app/core/services/user.service';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatSnackBarModule, MatDialogModule],
      declarations: [AddToCartComponent],
      providers: [CartService, UserService, HttpClient, HttpHandler]
    }).compileComponents();
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
