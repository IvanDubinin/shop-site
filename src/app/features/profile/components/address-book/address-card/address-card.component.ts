import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressBookService } from 'src/app/core/services/addressBook.service';
import { IAddressBook } from '../../../../../types/addressbook.interface';
import { ModalWindowService } from 'src/app/core/services/modalWindow.service';
import { AddressBookModalWindowComponent } from '../address-book-modal-window/address-book-modal-window.component';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss']
})
export class AddressCardComponent {
  @Input() address: IAddressBook;
  @Output() deleteAddress = new EventEmitter<number>();

  constructor(
    private dialog: MatDialog,
    private addressBookService: AddressBookService,
    private modalWindowService: ModalWindowService
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(AddressBookModalWindowComponent, {
      width: '600px',
      data: this.address
    });
    dialogRef.afterClosed().subscribe(() => {
      const addressBookSubscription = this.addressBookService
        .getAddress(this.address.id)
        .subscribe((res) => (this.address = res));
    });
  }

  openConfirmationModal() {
    this.modalWindowService.modal(this.modalConfig).subscribe({
      next: (data) => {
        if (data === 'true') {
          if (!this.address) {
            return;
          }
          this.addressBookService
            .deleteAddress(this.address.id)
            .subscribe(() => this.deleteAddress.emit(this.address.id));
        }
      },
      error: (err) => console.log(err)
    });
  }

  modalConfig = {
    data: {
      title: '',
      content: 'Are you sure you want to delete the address?',
      buttonOK: 'YES',
      buttonNG: 'NO'
    },
    width: '500px',
    panelClass: 'dialog'
  };
}
