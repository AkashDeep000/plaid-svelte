import db from "$lib/server/dbClient.js";
import plaidClient from "$lib/server/plaidClient.js";

export async function load({ parent }) {
  const data = await parent();
  const banks = await db.get(data?.session?.user?.email);

  if (banks && banks.length > 0) {
    /*
    const fetchBanksPromises = banks.map((bank) => {
      const getBankDetails = async () => {
        const response = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        return response.data;
      };
      return getBankDetails();
    });

    const banksDetails = await Promise.all(fetchBanksPromises);

    const getBalance = (accounts) => {
      let total = 0;
      for (let i = 0; i < accounts.length; i++) {
        switch (accounts[i].type) {
          case "investment":
            total += accounts[i].balances.current;
            break;
          case "credit":
            break;
            total -= accounts[i].balances.current;
            break;
          case "depository":
            total += accounts[i].balances.current;
            break;
          case "loan":
            total -= accounts[i].balances.current;
            break;
        }
      }
      return total;
    };
    const data = [];
    for (let i = 0; i < banksDetails.length; i++) {
      const bankDetails = {};

      bankDetails.name = banks[i].name;
      bankDetails.institutionId = banks[i].institutionId;
      bankDetails.logo = banks[i].logo;
      bankDetails.balance = getBalance(banksDetails[i].accounts);
      // console.log(bankDetails);
      data.push(bankDetails);
    }
    //console.log(banksDetails);
    return { data: data };
  */
    banks.forEach(function(tmp) { delete tmp.accessToken });

    return { data: banks };
  }
}