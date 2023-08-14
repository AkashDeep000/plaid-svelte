import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } from '$env/static/private';

const configuration = new Configuration({
	basePath:
		PLAID_ENV === 'production'
			? PlaidEnvironments.production
			: PLAID_ENV === 'development'
			? PlaidEnvironments.development
			: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET
		}
	}
});

const client = new PlaidApi(configuration);
export default client;
