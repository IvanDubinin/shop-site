import { EventEmitter, Output } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressBookService } from 'src/app/core/services/addressBook.service';
import { UserService } from 'src/app/core/services/user.service';
import { AddressBookModalWindowComponent } from 'src/app/features/profile/components';
import { IAddressBook } from 'src/app/types/addressbook.interface';
import { IUser } from 'src/app/types/user.interface';

const IADDRESSBOOK_PHONE_PROP_INDEX = 4;
const ADDRESS_FIELD_DELIMETER = ' ';
const ADDRESS_ID_INDEX = 1;
type AddressLocationAndCredentials = { credentials: string; location: string };
export type LocationOnly = Omit<
  IAddressBook,
  'id' | 'userId' | 'title' | 'name' | 'surname' | 'phone'
>;
@Component({
  selector: 'app-delivery-address-step',
  templateUrl: './delivery-address-step.component.html',
  styleUrls: ['./delivery-address-step.component.scss']
})
export class DeliveryAddressStepComponent implements OnInit, OnDestroy {
  @Output() deliveryAddressConfirmed = new EventEmitter<LocationOnly>();

  isLoading = false;
  selectedRadio: IAddressBook | null = null;
  addressStrings = new Array<AddressLocationAndCredentials>();
  addressList$: Observable<IAddressBook[] | null> | null = null;
  userSubscription: Subscription | null = null;

  user: IUser | null;
  dialogRef: MatDialogRef<AddressBookModalWindowComponent> | null;

  constructor(
    private addressService: AddressBookService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userSubscription = this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.getAddressList();
    });
  }
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
  getAddressList(): void {
    if (!this.user) {
      this.addressList$ = null;
      return;
    }
    this.isLoading = true;
    this.addressList$ = this.addressService.getAddressesByUserId(+this.user.id).pipe(
      map((address) => {
        if (address?.length) {
          this.buildaddressStrings(address);
        }
        this.isLoading = false;
        return address;
      })
    );
  }

  onProceed(emissionFromForm?: LocationOnly): void {
    const valueToEmit =
      emissionFromForm || (this.getLocationFromAddress(this.selectedRadio!) as LocationOnly);
    this.deliveryAddressConfirmed.emit(valueToEmit);
  }

  getLocationFromAddress(address: IAddressBook): LocationOnly {
    const { id, name, surname, phone, title, userId, ...location } = { ...address };
    return location;
  }

  buildaddressStrings(addressList: IAddressBook[]): void {
    this.addressStrings.length = 0;
    for (const address of addressList) {
      this.addressStrings.push(this.buildAddressString(address));
    }
  }

  editAddress(address: IAddressBook): void {
    this.openAddressDialog({ data: address });
  }
  addAddress() {
    this.openAddressDialog({ data: {} });
  }

  openAddressDialog(dialogData: any): void {
    this.dialogRef = this.dialog.open(AddressBookModalWindowComponent, dialogData);
    this.dialogRef.afterClosed().subscribe({
      next: (data) => {
        this.getAddressList();
        this.dialogRef = null;
      }
    });
  }

  buildAddressString(address: IAddressBook): AddressLocationAndCredentials {
    const addressArray = Object.values(address).slice(ADDRESS_ID_INDEX);
    const credentials = addressArray
      .slice(0, IADDRESSBOOK_PHONE_PROP_INDEX)
      .join(ADDRESS_FIELD_DELIMETER);
    const location = Object.values(this.getLocationFromAddress(address)).join(
      ADDRESS_FIELD_DELIMETER
    );
    return { credentials, location };
  }

  trackAddressId(index: number, address: IAddressBook): IAddressBook {
    return address;
  }
}
