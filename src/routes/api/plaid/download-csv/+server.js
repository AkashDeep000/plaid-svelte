/*
import plaidClient from "$lib/server/plaidClient.js";
import db from "$lib/server/dbClient.js";

export const GET = async ({ url }) => {
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  const banks = url.searchParams.get("banksId");
  if (!startDate && !endDate && !banksId)
    return new Response("Missing parameters", { status: 500 });
  const session = await locals.getSession();
  const email = session?.user?.email;
  const banksInstitutionId = banksId.split(",");
  const banks = await db.get(email);
  const filteredBanks = banks.filter(
    (bank) => banksInstitutionId.indexOf(bank.institutionId) > -1
  );

const getTansactiosPromises = filteredBanks.map(bank => {
const getTansactios = async (bank) => {
  const request: TransactionsGetRequest = {
  access_token: bank.accessToken,
  start_date: startDate,
  end_date: endDate,
  options: {
    include_personal_finance_category: true
  }
};
try {
  const response = await plaidClient.transactionsGet(request);
  let transactions = response.data.transactions;
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
        include_personal_finance_category: true
      },
    };
    const paginatedResponse = await client.transactionsGet(paginatedRequest);
    transactions = transactions.concat(
      paginatedResponse.data.transactions,
    );
  }
  return transactions
} catch(err) => {
  console.log(err)
}
}
})

const getTansactiosAll = await Promise.all(getTansactiosPromises)

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition":
        // Use filename* instead of filename to support non-ASCII characters
        `attachment; filename=transactions.csv`,
    },
  });
};

*/
