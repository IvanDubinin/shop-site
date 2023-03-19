import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ICountry } from 'src/app/types/country.interface';

export function countryValidator(countries: ICountry[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputVal: string = control.value;
    const result = countries.find(
      (country) => country.name.toLowerCase() === inputVal.toLowerCase()
    );
    return result ? null : { custom: 'no db countries matches value' };
  };
}

export function cityValidator(getCityValidatorParams: Function): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cities = getCityValidatorParams();
    const inputVal: string = control.value;
    const result = cities.find((city: string) => city.toLowerCase() === inputVal.toLowerCase());
    return result ? null : { custom: 'no db cities matches value' };
  };
}
export const VALIDATOR_VALUES: { [K in ErrorKeys]: { [key: string]: any } } = {
  pattern: {
    country: 'country',
    city: 'city',
    zip: 'zip'
  },
  minLength: {
    country: 2,
    city: 2,
    zip: 6
  },
  required: {},
  custom: {
    city: 'please, choose city from list below',
    country: 'please, choose country from list below'
  }
};

const validatorsForStrings = [
  Validators.required,
  Validators.minLength(2),
  Validators.pattern('[a-zA-Z ]*')
];
const validatorsForZip = [
  Validators.required,
  Validators.minLength(6),
  Validators.pattern('[a-zA-Z0-9]*')
];
const validatorsForBuildingFlat = [Validators.required, Validators.pattern('[0-9/]*')];

export const VALIDATORS: { [key: string]: ValidatorFn[] } = {
  zip: validatorsForZip,
  flat: validatorsForBuildingFlat,
  building: validatorsForBuildingFlat,
  strings: validatorsForStrings
};
/* maybe it will be needed, i'll try to write standard mat-error component soon */
export type ErrorKeys = 'required' | 'minLength' | 'pattern' | 'custom';
export type ErrorFunc = (p: any) => string;
export const STD_ERR_KEYS_BY_IMPORTANCE: ErrorKeys[] = ['required', 'minLength', 'pattern'];
export const STD_ERROR_MSGS: { [K in ErrorKeys]: string | ErrorFunc } = {
  required: 'this field is required',
  minLength: (minLength: any) => `minimum length is ${minLength}`,
  pattern: (patterName: any) => `Entered value doesn't match ${patterName} pattern`,
  custom: (controlname: string) => VALIDATOR_VALUES.custom[controlname]
};
