import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistModalComponent } from './wishlist-modal.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('WishlistModalComponent', () => {
  let component: WishlistModalComponent;
  let fixture: ComponentFixture<WishlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule, MatSnackBarModule],
      declarations: [WishlistModalComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { data: { productId: 0, userId: 0 } } }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
