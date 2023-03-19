import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { IProductArrayMock } from 'src/mocks/constucted-entities';
import { ICartProduct } from 'src/mocks/raw-entities';
import { CartListComponent } from './cart-list.component';

describe('CartListComponent', () => {
  let component: CartListComponent;
  let fixture: ComponentFixture<CartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartListComponent],
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, MatDialogModule],
      providers: [
        {
          prodive: CartService,
          useValue: {
            getLocalCart: () => {
              return { '0': ICartProduct };
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
    component.products = IProductArrayMock;
    component.cart = { '0': ICartProduct };
    component.sellerName = 'seller';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
