// api/payment.js
export default async function handler(req, res) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Укажи свой домен, например "https://japopa7-prog.github.io"
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
    const { invoiceNumber, amount, currency, email } = req.body;

    if (!invoiceNumber || !amount || !currency) {
      res.setHeader("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
      return res.status(400).json({
        result: false,
        error: "Missing invoiceNumber, amount, or currency"
      });
    }

    // ТВОЙ ПРОДОВЫЙ ТОКЕН
    const token = "HJLs_lGCcJzZ2UGQFgW65OSpYf3ebGxHsA19de1p";
    const apiBase = "https://pgate.bxb.delivery";

    // По документации: amount строго с 2 знаками после запятой и это число/строка (API принимает оба)
    const numericAmount = Number(amount).toFixed(2);

    const bxbRes = await fetch(`${apiBase}/api/v1/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      // Строго по документации для type_form: 1 (обычная оплата картой)
      body: JSON.stringify({
        invoiceNumber: String(invoiceNumber).slice(0, 20),
        amount: numericAmount,
        currency: currency || "USD",
        type_form: 1
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
