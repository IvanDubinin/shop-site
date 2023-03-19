import { CustomCurrencyPipe } from './custom-currency/custom-currency.pipe';
import { CustomStatusPipe } from './custom-status/custom-status.pipe';

export const pipes: any[] = [CustomCurrencyPipe, CustomStatusPipe];

export * from './custom-currency/custom-currency.pipe';
export * from './custom-status/custom-status.pipe';
