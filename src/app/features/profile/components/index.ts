import { AddressBookModalWindowComponent } from './address-book/address-book-modal-window/address-book-modal-window.component';
import { AddressBookPageComponent } from './address-book/address-book-page/address-book-page.component';
import { AddressBookComponent } from './address-book/address-book/address-book.component';
import { AddressCardComponent } from './address-book/address-card/address-card.component';
import { OrderListItemComponent } from './order/order-list-item/order-list-item.component';
import { OrdersPageComponent } from './order/orders-page/orders-page.component';
import { ProfileDetailsPageComponent } from './profile/profile-details-page/profile-details-page.component';
import { ProfilePageComponent } from './profile/profile-page/profile-page.component';
import { WishlistPageComponent } from './wishlist/wishlist-page/wishlist-page.component';

export const components: any[] = [
  AddressBookComponent,
  AddressBookModalWindowComponent,
  AddressCardComponent,
  AddressBookPageComponent,
  OrderListItemComponent,
  OrdersPageComponent,
  ProfilePageComponent,
  ProfileDetailsPageComponent,
  WishlistPageComponent
];

export * from './address-book/address-book/address-book.component';
export * from './address-book/address-book-modal-window/address-book-modal-window.component';
export * from './address-book/address-card/address-card.component';
export * from './address-book/address-book-page/address-book-page.component';
export * from './order/orders-page/orders-page.component';
export * from './profile/profile-details-page/profile-details-page.component';
export * from './profile/profile-page/profile-page.component';
export * from './wishlist/wishlist-page/wishlist-page.component';
