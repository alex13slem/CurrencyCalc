import type { CurrencyLatest } from '$lib/types/CurrencyLatest';
import axios from 'axios';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const baseCurrency = url.searchParams.get('base_currency') || 'USD';
	try {
		const defaultCurrencyLatest = await axios.get<CurrencyLatest>(process.env.FCA_URL + '/latest', {
			params: {
				apikey: process.env.FCA_API_KEY,
				base_currency: baseCurrency
			}
		});

		return new Response(JSON.stringify(defaultCurrencyLatest.data));
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500
		});
	}
};
