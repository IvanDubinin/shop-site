import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { WishlistService } from '../../../core/services/wishlist.service';
import { IWishlist } from '../../../types/wishlist.interface';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface DataWishlistModal {
  userId: number;
  productId: number;
}

@Component({
  selector: 'app-wishlist-modal',
  templateUrl: './wishlist-modal.component.html',
  styleUrls: ['./wishlist-modal.component.scss']
})
export class WishlistModalComponent implements OnInit {
  readonly MAX_WISHLIST_LENGTH = 150;
  wishlists: Observable<IWishlist[]>;
  userId: number;
  productId: number;
  form: FormGroup = new FormGroup({
    newWishlistName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(this.MAX_WISHLIST_LENGTH)
    ])
  });
  isFormShown: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DataWishlistModal,
    private dialog: MatDialog,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.userId = this.data.userId;
    this.productId = this.data.productId;
    this.wishlists = this.wishlistService.wishlists.getObjects(this.userId);
    this.wishlistService.wishlists.forceCacheUpdate(this.userId);
  }

  isAdded(wishlist: IWishlist): boolean {
    return wishlist.products.some((p) => p === this.productId);
  }

  selected(wishlist: IWishlist): void {
    if (this.isAdded(wishlist)) {
      this.wishlistService.deleteProductFromWishlist(this.productId, wishlist).subscribe(() => {});
    } else {
      this.wishlistService.addProductToWishlist(this.productId, wishlist).subscribe(() => {});
    }
  }

  get newWishlistName(): FormControl {
    return this.form.get('newWishlistName') as FormControl;
  }

  get typedCharacters(): string {
    return `${this.newWishlistName.value.length}/${this.MAX_WISHLIST_LENGTH}`;
  }

  submit() {
    if (this.form.valid) {
      this.wishlistService
        .addWishlist({
          name: this.newWishlistName.value,
          isDefault: false,
          userId: this.userId,
          products: [this.productId]
        })
        .subscribe(() => {
          this.isFormShown = false;
        });
    }
  }

  showForm() {
    this.isFormShown = true;
  }
}
