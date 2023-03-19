import { AutoUnsubscribeComponent } from 'src/app/helpers/AutoUnsubscribeComponent';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LoggingService } from '../../../../../core/services/logging-service';
import { AddressBookService } from 'src/app/core/services/addressBook.service';
import { UserService } from 'src/app/core/services/user.service';

import { ICity } from 'src/app/types/city.interface';
import { ICountry } from 'src/app/types/country.interface';
import { IUser } from 'src/app/types/user.interface';
import { IAddressBook } from '../../../../../types/addressbook.interface';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent extends AutoUnsubscribeComponent implements OnInit {
  user: IUser | null;

  countryOptions: Observable<ICountry[]>;
  cityOptions: Observable<string[]>;

  countries: ICountry[];
  cities: ICity[];

  foundCountries: ICountry[];
  countryCities: string[];

  validatorsForNames = [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern('[a-zA-Z ]*')
  ];
  validatorsForZip = [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')];
  validatorsForBuildingFlat = [Validators.required, Validators.pattern('[0-9/]*')];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAddressBook,
    private addressBookService: AddressBookService,
    private userService: UserService,
    private dialog: MatDialogRef<AddressBookComponent>,
    private loggingService: LoggingService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.user = this.userService.getUser().getValue();
    const getCountriesSubscription = this.addressBookService.getCountries().subscribe((data) => {
      this.countries = data;
      this.countryOptions = this.country.valueChanges.pipe(
        startWith(''),
        map((countryName) =>
          countryName ? this._filterStates(countryName) : this.countries.slice()
        )
      );
    });
    const getCitiesSubscription = this.addressBookService.getCities().subscribe((data) => {
      this.cities = data;
    });
    this.addSubscription(getCountriesSubscription);
    this.addSubscription(getCitiesSubscription);
  }

  onCountrySelect(event: any) {
    if (event) {
      this.foundCountries = this.countries.filter((country) => country.name.includes(event));
      if (this.foundCountries.length) {
        this.countryCities = this.cities.filter(
          (city) => city.countryId === this.foundCountries[0].id
        )[0].name;
      } else {
        this.countryCities = [];
      }
      this.cityOptions = this.city.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
      this.form.controls['city'].setValue('');
    }
  }
  private _filterStates(value: string): ICountry[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter((countryName) =>
      countryName.name.toLowerCase().includes(filterValue)
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countryCities.filter!((option) => option.toLowerCase().includes(filterValue));
  }

  form: FormGroup = this.fb.group({
    firstName: [this.data.name, this.validatorsForNames],
    lastName: [this.data.surname, this.validatorsForNames],
    phone: [this.data.phone, [Validators.required]],
    title: [this.data.title, [Validators.required]],
    street: [this.data.street, [Validators.required]],
    building: [this.data.building, this.validatorsForBuildingFlat],
    flat: [this.data.flat, this.validatorsForBuildingFlat],
    zip: [this.data.zip, this.validatorsForZip],
    country: [this.data.country, [Validators.required]],
    city: [this.data.city, [Validators.required]]
  });

  get firstName(): FormControl {
    return this.form.get('firstName') as FormControl;
  }
  get lastName(): FormControl {
    return this.form.get('lastName') as FormControl;
  }
  get phone(): FormControl {
    return this.form.get('phone') as FormControl;
  }
  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }
  get country(): FormControl {
    return this.form.get('country') as FormControl;
  }
  get city(): FormControl {
    return this.form.get('city') as FormControl;
  }
  get street(): FormControl {
    return this.form.get('street') as FormControl;
  }
  get building(): FormControl {
    return this.form.get('building') as FormControl;
  }
  get flat(): FormControl {
    return this.form.get('flat') as FormControl;
  }
  get zip(): FormControl {
    return this.form.get('zip') as FormControl;
  }

  onSubmit() {
    if (!this.form.valid || !this.user) {
      return;
    }
    const newAddress: Omit<IAddressBook, 'id'> = {
      title: this.title.value,
      name: this.firstName.value,
      surname: this.lastName.value,
      phone: this.phone.value,
      country: this.country.value,
      city: this.city.value,
      street: this.street.value,
      building: this.building.value,
      flat: this.flat.value,
      zip: this.zip.value,
      userId: +this.user.id
    };

    if (Object.keys(this.data).length === 0) {
      const createAddressSubscription = this.addressBookService
        .createAddress(newAddress)
        .subscribe({
          next: () => {
            this.dialog.close();
            this.loggingService.logBusinessAction({
              message: "Address's been successfully added",
              title: 'Success',
              removeByTimeout: 3000
            });
          },
          error: () => {
            this.loggingService.logError({
              message: "Something's gone wrong. Try again please",
              title: 'Error',
              removeByTimeout: 3000
            });
          }
        });
      this.addSubscription(createAddressSubscription);
    } else {
      const updateAddressSubscription = this.addressBookService
        .updateAddress({ ...newAddress, id: this.data.id })
        .subscribe(() => {
          this.dialog.close();
          this.loggingService.logBusinessAction({
            message: "Address's been successfully updated",
            title: 'Success',
            removeByTimeout: 3000
          });
        });
      this.addSubscription(updateAddressSubscription);
    }
  }

  get addOrUpdate() {
    return Object.keys(this.data).length ? 'SAVE' : 'ADD';
  }

  formIsInvalid() {
    const formIsInvalid = this.form.invalid;
    if (!Object.keys(this.data).length) {
      return formIsInvalid;
    } else {
      return this.form.untouched || formIsInvalid;
    }
  }
}
