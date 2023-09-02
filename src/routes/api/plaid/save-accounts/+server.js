import { error } from '@sveltejs/kit';
import plaidClient from '$lib/server/plaidClient.js';
import md5 from 'md5';
import { json } from '@sveltejs/kit';
import db from '$lib/server/dbClient.js';

export async function POST({ url, request, locals }) {
	const { publicToken } = await request.json();
	const session = await locals.getSession();
	const email = session.user.email;
	try {
		const response = await plaidClient.itemPublicTokenExchange({
			public_token: publicToken
		});
		const accessToken = response.data.access_token;
		const itemID = response.data.item_id;

		const itemRes = await plaidClient.itemGet({ access_token: accessToken });
		const item = itemRes.data.item;
		const bankInfoRes = await plaidClient.institutionsGetById({
			institution_id: item.institution_id,
			country_codes: [
				'US',
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
			options: {
				include_optional_metadata: true
			}
		});
		const bankInfo = bankInfoRes.data.institution;

		const oldBanks = (await db.get(email)) || [];
		const filteredBanks = [];
		//deleting previous bank if same
		for (let i = 0; i < oldBanks.length; i++) {
			if (oldBanks[i].institutionId === item.institution_id) {
				try {
					const deleteRes = await plaidClient.itemRemove({
						access_token: oldBanks[i].accessToken
					});
				} catch (err) {
					console.log(err);
				}
			} else {
				filteredBanks.push(oldBanks[i]);
			}
		}

		const newBanks = await db.set(email, [
			...filteredBanks,
			{
				institutionId: item.institution_id,
				name: bankInfo.name,
				logo: bankInfo.logo,
				itemID,
				accessToken
			}
		]);

		/* const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });
      console.log(accountsResponse.data);
      */
		return json({ success: true });
	} catch (err) {
		// Handle error
		console.log(err);
		throw error(400, { error: 'err.massage' });
	}
}

export async function DELETE({ url, request, locals }) {
	try {
		const { institutionId } = await request.json();
		const session = await locals.getSession();
		const email = session?.user?.email;
		const oldBanks = (await db.get(email)) || [];
		const filteredBanks = [];
		for (let i = 0; i < oldBanks.length; i++) {
			if (oldBanks[i].institutionId === institutionId) {
				try {
					const deleteRes = await plaidClient.itemRemove({
						access_token: oldBanks[i].accessToken
					});
				} catch (err) {
					console.log(err);
				}
			} else {
				filteredBanks.push(oldBanks[i]);
			}
		}
		const newBanks = await db.set(email, filteredBanks);
		return json({ success: true });
	} catch (err) {
		console.log(err);
		throw error(400, { error: 'err.massage' });
	}
}
