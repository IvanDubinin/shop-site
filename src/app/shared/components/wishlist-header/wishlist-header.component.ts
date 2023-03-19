import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IWishlist } from '../../../types/wishlist.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wishlist-header',
  templateUrl: './wishlist-header.component.html',
  styleUrls: ['./wishlist-header.component.scss']
})
export class WishlistHeaderComponent {
  readonly MAX_WISHLIST_LENGTH = 150;

  @Input() wishlist: IWishlist;
  @Output() rename: EventEmitter<string> = new EventEmitter<string>();
  @Output() delete: EventEmitter<IWishlist> = new EventEmitter<IWishlist>();

  isEditMode: boolean;
  form: FormGroup = new FormGroup({});

  constructor() {
    this.isEditMode = false;
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  onEditWishlist() {
    const nameControl = new FormControl(this.wishlist.name, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(this.MAX_WISHLIST_LENGTH)
    ]);
    this.form.addControl('name', nameControl);
    this.isEditMode = true;
  }

  onEndEditWishlist() {
    this.rename.emit(this.name.value);
    this.isEditMode = false;
  }

  onDeleteWishlist() {
    this.delete.emit(this.wishlist);
  }

  onBlur(event: FocusEvent) {
    this.onEndEditWishlist();
    event.stopPropagation();
  }
}
