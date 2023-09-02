import { error } from "@sveltejs/kit";
import plaidClient from "$lib/server/plaidClient.js";
import md5 from "md5";
import { json } from "@sveltejs/kit";

export async function GET({ url, locals }) {
  const session = await locals.getSession();
  if (session?.user?.email) {
    const request = {
      user: {
        client_user_id: md5(session?.user?.email),
      },
      client_name: "Plaid Test App",
      products: ["transactions"],
      country_codes: [
        "US",
        "GB",
        "ES",
        "NL",
        "FR",
        "IE",
        "CA",
        "DE",
        "IT",
        "PL",
        "DK",
        "NO",
        "SE",
        "EE",
        "LT",
        "LV",
        "PT",
      ],
      language: "en",
    };
    try {
      const response = await plaidClient.linkTokenCreate(request);
      const linkToken = response.data.link_token;
      //console.log({ linkToken });
      return json({ linkToken });
    } catch (err) {
      // Handle error
      console.log(err);
      throw error(404, "Failed to generate link token");
    }
  }
}
