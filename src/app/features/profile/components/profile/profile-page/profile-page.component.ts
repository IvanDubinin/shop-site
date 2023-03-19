import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../../../types/user.interface';
import { UserService } from '../../../../../core/services/user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  currentUser: IUser;
  title: string;
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentUser = this.userService.authorizedUser;
  }
  ngOnInit(): void {
    this.setTitle();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.setTitle();
    });
  }

  setTitle() {
    this.title = this.activatedRoute.firstChild?.routeConfig?.data?.['breadcrumb'] || 'Profile';
  }

  signOut() {
    this.userService.logout();
  }
}
