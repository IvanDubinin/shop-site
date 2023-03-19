import { ISelect } from '../shared/components';

export function formatOptionsForDropDown(options: string[]): ISelect[] {
  return options.map((option) => ({ value: option, viewValue: option }));
}
