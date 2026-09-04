// api/payment.js
export default async function handler(req, res) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://japopa7-prog.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
    res.setHeader("Access-Control-Allow-Methods", corsHeaders["Access-Control-Allow-Methods"]);
    res.setHeader("Access-Control-Allow-Headers", corsHeaders["Access-Control-Allow-Headers"]);
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
    return res.status(405).json({ result: false, error: "Method not allowed" });
  }

  try {
    const { invoiceNumber, amount, currency } = req.body;

    if (!invoiceNumber || !amount || !currency) {
      res.setHeader("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
      return res.status(400).json({
        result: false,
        error: "Missing invoiceNumber, amount, or currency"
      });
    }

    const token = "ueyAcTSS_3k2cuv6aGf_n_E2_SjS-BkKdDKqpFb2";
    const apiBase = "https://pgate-dev.bxb.delivery";

    // ===== ГЛАВНОЕ ИЗМЕНЕНИЕ: amount как ЧИСЛО, а не строка =====
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);

    const bxbRes = await fetch(`${apiBase}/api/v1/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        invoiceNumber: String(invoiceNumber).slice(0, 20),
        amount: numericAmount,
        currency: currency || "USD",
        type_form: 1,
        description: "Wiggle House order",
        email: "customer@example.com",
        customer_id: "cust_" + Date.now(),
        billTo: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          countryCode: "840"
        },
        shipping: {
          goodsCost: numericAmount
        }
      }),
    });

    const data = await bxbRes.json();

    res.setHeader("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
    return res.status(bxbRes.status).json(data);

  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
    return res.status(500).json({
      result: false,
      error: String(err)
    });
  }
}
