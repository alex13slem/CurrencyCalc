import type { Currency } from './Currency';

export interface CurrenciesData {
	data: { [key: string]: Currency };
}
