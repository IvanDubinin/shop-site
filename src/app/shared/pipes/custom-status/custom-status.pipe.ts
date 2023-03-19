import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customStatus'
})
export class CustomStatusPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) {
      return '';
    }
    const status = value.replace(/_/g, ' ').toLowerCase();
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
