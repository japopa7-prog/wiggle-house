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

    const token = "HJLs_lGCcJzZ2UGQFgW65OSpYf3ebGxHsA19de1p"; // ПРОДОВЫЙ ТОКЕН
    const apiBase = "https://pgate.bxb.delivery";

    const numericAmount = Number(amount).toFixed(2);

    // ===== ЗДЕСЬ ГЛАВНОЕ ИЗМЕНЕНИЕ =====
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
        type_form: 2, // <--- ИЗМЕНИЛИ НА 2 (форма с доставкой)
        description: "Wiggle House order",
        email: email || "customer@example.com",
        customer_id: email || "cust_" + Date.now(),
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
          goodsCost: numericAmount, // <--- ДОБАВИЛИ СТОИМОСТЬ ТОВАРА
          deliveryCost: 0,
          deliveryService: "BXB"
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
