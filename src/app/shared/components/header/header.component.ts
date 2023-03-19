import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignInUpModalWindowComponent } from '../../../features/auth/components';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { CartService } from 'src/app/core/services/cart-service/cart.service';

import { DEFAULT_PLP_IHTTP_PARAMS } from 'src/app/features/product/components/product-list-page/product-list-page-constants';
import { IUser } from '../../../types/user.interface';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  _defaultPlpQueryParams = DEFAULT_PLP_IHTTP_PARAMS;
  user: IUser | null;
  userSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    public cartService: CartService
  ) {}
  ngOnInit() {
    this.userSubscription = this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }
  openDialog(): void {
    this.dialog.open(SignInUpModalWindowComponent, {
      width: '600px'
    });
  }

  toggleMenu() {
    if (window.innerWidth < 769) this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
