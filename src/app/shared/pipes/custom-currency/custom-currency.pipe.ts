import { Pipe, PipeTransform } from '@angular/core';
//TODO make universal pipe for all of the available currencies
// !!! Waring: pipe usage is only valid after it's stays in code after inbuilt currency pipe with 1  currency sign on the right, i.e. $, € will work. RUB, UAH, CHF won't work.
@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) {
      return '';
    }
    const decimalLen = 1;
    const decimalWithDelimiterLen = 2;
    const currencySign = value[0];
    const startIndexWithoutCurrencySign = 1;
    let decimals = value.substring(value.length - decimalLen, value.length).replace('0', '');
    let integers = value
      .substring(startIndexWithoutCurrencySign, value.length - decimalWithDelimiterLen)
      .replace(/,/g, ' ');
    return integers + `${decimals ? `,${decimals}0` : ''}` + ` ${currencySign}`;
  }
}
