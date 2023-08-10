import { error } from '@sveltejs/kit';
import plaidClient from '$lib/server/plaidClient.js';

export async function load({ params, url }) {
	const query = url.searchParams.get('search');
	const options = {
		query,
		country_codes: [
			'GB',
			'ES',
			'NL',
			'FR',
			'IE',
			'CA',
			'DE',
			'IT',
			'PL',
			'DK',
			'NO',
			'SE',
			'EE',
			'LT',
			'LV',
			'PT'
		],
		products: ['transactions'],
		options: {
			include_optional_metadata: true
		}
	};
	try {
		if (query) {
			const response = await plaidClient.institutionsSearch(options);
			const institutions = response.data.institutions;
			//console.log(institutions);
			return { query, data: institutions };
		} else {
			return { query: '', data: [] };
		}
	} catch (e) {
		// Handle error
		console.log(e);
		throw error(404, 'Not found');
	}
}
