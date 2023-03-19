import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-in-up-modal-window',
  templateUrl: './sign-in-up-modal-window.component.html',
  styleUrls: ['./sign-in-up-modal-window.component.scss']
})
export class SignInUpModalWindowComponent {
  selected = new FormControl(0);
  isSeller = false;
}
