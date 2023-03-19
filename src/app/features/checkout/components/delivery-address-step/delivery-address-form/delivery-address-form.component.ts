import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { first, map } from 'rxjs';
import { AddressBookService } from 'src/app/core/services/addressBook.service';
import { ICountry } from 'src/app/types/country.interface';
import { LocationOnly } from '../delivery-address-step.component';
import { VALIDATORS, countryValidator, cityValidator } from './delivery-address-form.validators';
const COUNTRY_FORMCTRL_NAME = 'country';
const CITY_FORMCTRL_NAME = 'city';
const STRING_TYPE_CONTROLS = [COUNTRY_FORMCTRL_NAME, CITY_FORMCTRL_NAME, 'street'];
const EMPTY_FORM_CONTROL_NAMES = [...STRING_TYPE_CONTROLS, 'zip', 'flat', 'building'];

@Component({
  selector: 'app-delivery-address-form',
  templateUrl: './delivery-address-form.component.html',
  styleUrls: ['./delivery-address-form.component.scss']
})
export class DeliveryAddressFormComponent implements OnInit {
  @Output() formSubmit: EventEmitter<LocationOnly> = new EventEmitter<LocationOnly>();

  countryCache: Array<ICountry> = new Array<ICountry>();
  cityCache: Map<number, string[]> = new Map<number, string[]>();
  chosenCountry: ICountry;

  addressForm = new FormGroup({ ...this.generateEmptyFormControls() });
  countryOptions$ = this.controls[COUNTRY_FORMCTRL_NAME].valueChanges.pipe(
    map((coutryInput) => {
      this.resetCityValueIfNotEmpty();
      return this.filterCountryOptions(coutryInput);
    })
  );
  cityOptions$ = this.controls[CITY_FORMCTRL_NAME].valueChanges.pipe(
    map((cityInput) => this.filterCityOptions(cityInput))
  );

  get isCityReadOnly(): boolean {
    const countryControl = this.addressForm.controls[COUNTRY_FORMCTRL_NAME];
    return !!countryControl.errors || countryControl.untouched;
  }

  get controls(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }
  constructor(private addressService: AddressBookService) {}

  ngOnInit(): void {
    this.addressService
      .getCountries()
      .pipe(first())
      .subscribe((countries) => this.countryCache.push(...countries));
  }

  filterCountryOptions(countryValue: string) {
    return this.countryCache.filter((country: ICountry) =>
      this.stringEntryNoRegister(country.name, countryValue)
    );
  }
  filterCityOptions(cityValue: string) {
    const cities = this.cityCache.get(this.chosenCountry?.id);
    return cities?.filter((city) => this.stringEntryNoRegister(city, cityValue)) || [];
  }

  stringEntryNoRegister(str1: string = '', str2: string = ''): boolean {
    return str1.toLowerCase().includes(str2.toLowerCase());
  }
  resetCityValueIfNotEmpty() {
    if (this.addressForm.controls[CITY_FORMCTRL_NAME].value) {
      this.addressForm.controls[CITY_FORMCTRL_NAME].reset('');
    }
  }

  pickCountryObjectByName() {
    const countryFormControl = this.addressForm.get(COUNTRY_FORMCTRL_NAME);
    if (countryFormControl?.errors === null) {
      this.chosenCountry = this.countryCache.find((country) =>
        this.stringEntryNoRegister(country.name, countryFormControl?.value)
      )!;
    }
  }

  isDirtyTouchedOrErrors(control: AbstractControl) {
    return control.dirty || control.touched || control.errors;
  }

  uploadCity() {
    const chosenCountryId = this.chosenCountry?.id;
    const chosenCityIdTypeValidation = typeof chosenCountryId === 'number';
    if (!chosenCityIdTypeValidation || this.cityCache.has(chosenCountryId)) {
      return;
    }
    this.addressService.getCityByCountryId(chosenCountryId).subscribe({
      next: (city) => {
        this.cityCache.set(chosenCountryId, city.name);
      }
    });
  }

  getCityValidatorParams(): string[] {
    return this.cityCache.get(this.chosenCountry?.id) || [];
  }

  generateEmptyFormControls(): { [key: string]: FormControl } {
    const container: { [key: string]: FormControl } = {};
    const commonStringValidator = VALIDATORS['strings'];
    const generatedControls = EMPTY_FORM_CONTROL_NAMES.reduce((acc, ctrlName: string) => {
      acc[ctrlName] = new FormControl(null, {
        validators: VALIDATORS[ctrlName] || commonStringValidator,
        updateOn: 'change'
      });
      return acc;
    }, container);

    generatedControls[CITY_FORMCTRL_NAME].setValidators([
      ...commonStringValidator,
      cityValidator(this.getCityValidatorParams.bind(this))
    ]);
    generatedControls[COUNTRY_FORMCTRL_NAME].setValidators([
      ...commonStringValidator,
      countryValidator(this.countryCache)
    ]);
    return generatedControls;
  }

  submit() {
    if (!this.addressForm.valid) {
      return;
    }
    this.formSubmit.emit(this.getFormattedFormValues());
  }

  getFormattedFormValues(): LocationOnly {
    const controls = this.addressForm.controls;
    const location: { [key: string]: any } = {};
    for (const control in controls) {
      const currControl = controls[control];
      const isFieldString = typeof controls[control].value === 'string';
      location[control] = isFieldString
        ? this.formatStringField(currControl.value)
        : controls[control].value;
    }
    return location as LocationOnly;
  }

  formatStringField(controlValue: string): string {
    const words = controlValue.split(' ');
    return words
      .map((word) => word[0].toUpperCase() + word.substring(1, word.length).toLowerCase())
      .join(' ');
  }
}
