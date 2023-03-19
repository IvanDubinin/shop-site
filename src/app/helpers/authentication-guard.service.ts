import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { SignInUpModalWindowComponent } from '../features/auth/components';
import { MatDialog } from '@angular/material/dialog';

const TIMEOUT_AFTER_REDIRECTING_TO_HOMEPAGE = 500;

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {
  constructor(public dialog: MatDialog, private router: Router, private userService: UserService) {}

  canActivate() {
    const user = this.userService.authorizedUser;
    if (user) {
      return true;
    }
    this.router.navigate(['/home']);
    setTimeout(() => {
      this.dialog.open(SignInUpModalWindowComponent, {
        width: '600px'
      });
    }, TIMEOUT_AFTER_REDIRECTING_TO_HOMEPAGE);
    return false;
  }
}
