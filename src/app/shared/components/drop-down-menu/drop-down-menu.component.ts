import { Component, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.scss']
})
export class DropDownMenuComponent {
  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  constructor(private userService: UserService) {}

  logOut() {
    this.userService.logout();
  }
}
