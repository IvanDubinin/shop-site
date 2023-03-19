import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAddressBook } from 'src/app/types/addressbook.interface';

@Component({
  selector: 'app-address-book-modal-window',
  templateUrl: './address-book-modal-window.component.html',
  styleUrls: ['./address-book-modal-window.component.scss']
})
export class AddressBookModalWindowComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IAddressBook) {}

  get addOrUpdate() {
    return this.data.id ? 'Update the' : 'Add new';
  }
}
