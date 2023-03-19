import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { IUser } from 'src/app/types/user.interface';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss']
})
export class CurrentUserComponent {
  user: IUser;
  constructor(svc: UserService) {
    this.user = svc.authorizedUser;
  }
}
