import { IAddressBook } from './addressbook.interface';

export interface PaymentInfo {
  cardNumber: string;
  expDate: string;
  name: string;
}

export interface PersonalInformation {
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
  email: string;
}

export interface LocationAndName {
  title?: string;
  name?: string;
  surname?: string;
  country?: string;
  city?: string;
  street?: string;
  building?: string;
  flat?: string;
  zip?: string;
}
