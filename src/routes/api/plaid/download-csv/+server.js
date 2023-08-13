import plaidClient from '$lib/server/plaidClient.js';
import db from '$lib/server/dbClient.js';
import { json } from '@sveltejs/kit';
import { AsyncParser } from '@json2csv/node';

export const GET = async ({ url, locals }) => { 
	const startDate = url.searchParams.get('startDate');
	const endDate = url.searchParams.get('endDate');
	const banksId = url.searchParams.get('banksId');
	//console.log({ startDate, endDate, banksId });
	if (!startDate && !endDate && !banksId)
		return new Response('Missing parameters', { status: 500 });
	const session = await locals.getSession();
	const email = session?.user?.email;
	const banksInstitutionId = banksId.split(',');
	const banks = await db.get(email);
	const filteredBanks = banks.filter((bank) => banksInstitutionId.indexOf(bank.institutionId) > -1);
	let accounts = [];
	const getTansactiosPromises = filteredBanks.map((bank) => {
		const getTansactios = async (bank) => {
			const request = {
				access_token: bank.accessToken,
				start_date: startDate,
				end_date: endDate,
				options: {
					include_personal_finance_category: true,
					count: 500
				}
			};
			try {
				const response = await plaidClient.transactionsGet(request);
				let transactions = response.data.transactions;
				accounts.push(response.data.accounts);

				const total_transactions = response.data.total_transactions;

				// Manipulate the offset parameter to paginate
				// transactions and retrieve all available data
				while (transactions.length < total_transactions) {
					const paginatedRequest = {
						access_token: bank.accessToken,
						start_date: startDate,
						end_date: endDate,
						options: {
							offset: transactions.length,
							include_personal_finance_category: true,
							count: 500
						}
					};
					const paginatedResponse = await plaidClient.transactionsGet(paginatedRequest);
					transactions = transactions.concat(paginatedResponse.data.transactions);
				}
				return transactions;
			} catch (err) {
				console.log(err);
				return new Response('Error when fetching transactions', { status: 400 });
			}
		};
		return getTansactios(bank);
	});

	const getTansactiosAll = await Promise.all(getTansactiosPromises);
	const allTransactions = getTansactiosAll.flat(1);

	const accountsMap = new Map();

	for (let i = 0; i < accounts.length; i++) {
		for (let j = 0; j < accounts[i].length; j++) {
			const accountDetails = {};
			accountDetails.accountName = accounts[i][j].name;
			accountDetails.accountOfficialName = accounts[i][j].official_name;
			accountDetails.bankName = filteredBanks[i].name;
			accountDetails.bankId = filteredBanks[i].institutionId;

			accountsMap.set(accounts[i][j].account_id, accountDetails);
		}
	}

	for (let i = 0; i < allTransactions.length; i++) {
		const extraDetails = accountsMap.get(allTransactions[i].account_id);
		allTransactions[i] = { ...allTransactions[i], ...extraDetails };
	}

	allTransactions.sort((a, b) => {
		const aDate = a.authorized_datetime || a.date;
		const bDate = b.authorized_datetime || b.date;
		return bDate < aDate ? -1 : bDate > aDate ? 1 : 0;
	});

	const opts = {
		fields: [
			{
				label: 'Bank Name',
				value: 'bankName'
			},
			{
				label: 'Account Name',
				value: (record) => record.accountName || record.accountOfficialName
			},
			{
				label: 'Amount',
				value: (record) => -record.amount
			},
			{
				label: 'Transaction',
				value: (record) => (record.amount >= 0 ? 'Withdraw' : 'Deposit')
			},
			{
				label: 'Date',
				value: (record) => record.authorized_datetime || record.date
			},
			{
				label: 'Pending',
				value: 'pending'
			},
			{
				label: 'Name',
				value: (record) => record.name || record.merchant_name
			},
			{
				label: 'Payment Channel',
				value: 'payment_channel'
			},
			{
				label: 'Category',
				value: (record) => record.category.join(', ')
			},
			/*    
      {
        label: "Personal Finance Category",
        value: (record) =>
          record.personal_finance_category.detailed.replace("_", " "),
      },
      */
			{
				label: 'Payment Method',
				value: (record) => record.payment_meta.payment_method
			},
			{
				label: 'Payment Processor',
				value: (record) => record.payment_meta.payment_processor
			},
			{
				label: 'Location',
				value: (record) =>
					(record.location.address ? record.location.address + ', ' : '') +
					(record.location.city ? record.location.city + ', ' : '') +
					(record.location.country ? record.location.country : '')
			},
			{
				label: 'Transaction ID',
				value: 'transaction_id'
			}
		]
	};

	const parser = new AsyncParser(opts);
	const csv = await parser.parse(allTransactions).promise();
	//console.log(allTransactions);
	return json({ data: csv });
	/*
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition":
        // Use filename* instead of filename to support non-ASCII characters
        `attachment; filename=transactions-${startDate}-to-${endDate}.csv`,
    },
  });
  */
};
