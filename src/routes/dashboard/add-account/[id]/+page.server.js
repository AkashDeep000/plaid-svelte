import { error } from '@sveltejs/kit';
import plaidClient from '$lib/server/plaidClient.js';
import md5 from 'md5';

export async function load({ parent, params, url }) {
	const data = await parent();
	if (data?.session?.user?.email) {
		const request = {
			user: {
				client_user_id: md5(data?.session?.user?.email)
			},
			client_name: 'Plaid Test App',
			products: ['auth', 'transactions'],
			country_codes: ['US'],
			language: 'en',
			webhook: 'https://sample-web-hook.com',
			account_filters: {
				depository: {
					account_subtypes: ['checking', 'savings']
				}
			}
		};
		try {
			const response = await plaidClient.linkTokenCreate(request);
			const linkToken = response.data.link_token;
			console.log({ linkToken });
			return { linkToken };
		} catch (err) {
			// Handle error
			console.log(err);
		}
	} else {
		throw error(404, 'Not found');
	}
}
