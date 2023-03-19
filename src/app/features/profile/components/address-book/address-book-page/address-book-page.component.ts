import { Component } from '@angular/core';
import { AddressBookService } from 'src/app/core/services/addressBook.service';
import { Observable } from 'rxjs';
import { IAddressBook } from 'src/app/types/addressbook.interface';
import { MatDialog } from '@angular/material/dialog';
import { AddressBookModalWindowComponent } from '../address-book-modal-window/address-book-modal-window.component';
import { UserService } from 'src/app/core/services/user.service';
import { IUser } from 'src/app/types/user.interface';

@Component({
  selector: 'app-address-book-page',
  templateUrl: './address-book-page.component.html',
  styleUrls: ['./address-book-page.component.scss']
})
export class AddressBookPageComponent {
  user: IUser | null;
  addresses: IAddressBook[];
  constructor(
    private addressBookService: AddressBookService,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.user = this.userService.getUser().getValue();
    this.loadAdresses();
  }

  loadAdresses() {
    if (this.user) {
      this.addressBookService
        .getAddressesByUserId(+this.user?.id)
        .subscribe((addresses: IAddressBook[]) => (this.addresses = addresses));
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddressBookModalWindowComponent, {
      width: '600px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadAdresses();
    });
  }

  filterAddresses(id: number) {
    this.addresses = this.addresses.filter((address) => address.id !== id);
  }
}
