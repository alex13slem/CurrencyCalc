import { error } from '@sveltejs/kit';
import axios from 'axios';
import 'dotenv/config';
import type { CurrenciesData } from '../lib/types/CurrenciesData';
import type { CurrencyLatest } from '../lib/types/CurrencyLatest';
import type { FCAStatus } from '../lib/types/FCAStatus';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const baseCurrency = url.searchParams.get('base_currency') || 'USD';
	try {
		const currencies = await axios.get<CurrenciesData>(process.env.FCA_URL + '/currencies', {
			params: {
				apikey: process.env.FCA_API_KEY
			}
		});
		const defaultCurrencyLatest = await axios.get<CurrencyLatest>(process.env.FCA_URL + '/latest', {
			params: {
				apikey: process.env.FCA_API_KEY,
				base_currency: baseCurrency
			}
		});
		const status = await axios.get<FCAStatus>(process.env.FCA_URL + '/status', {
			params: {
				apikey: process.env.FCA_API_KEY
			}
		});
		return {
			currencies: currencies.data.data,
			defaultCurrencyLatest: defaultCurrencyLatest.data.data,
			baseCurrency,
			status: status.data
		};
	} catch (err) {
		return error(500, JSON.stringify(err));
	}
};
