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

    // Убедимся, что сумма передаётся правильно
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        result: false,
        error: "Invalid amount"
      });
    }

    const requestBody = {
      invoiceNumber: String(invoiceNumber).slice(0, 20),
      amount: Math.round(parsedAmount * 100) / 100, // 2 знака после запятой
      currency: currency || "USD",
      type_form: 1
    };

    console.log("=== SENDING TO BXB ===");
    console.log("URL:", `${apiBase}/api/v1/payment`);
    console.log("Body:", JSON.stringify(requestBody, null, 2));

    const bxbRes = await fetch(`${apiBase}/api/v1/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    // Получаем текст ответа
    const responseText = await bxbRes.text();
    console.log("=== BXB RAW RESPONSE ===");
    console.log("Status:", bxbRes.status);
    console.log("Raw:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      data = { result: false, error: "Invalid JSON response from BXB", raw: responseText };
    }

    res.setHeader("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
    return res.status(bxbRes.status).json(data);

  } catch (err) {
    console.error("=== CATCH ERROR ===");
    console.error(err);
    res.setHeader("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
    return res.status(500).json({
      result: false,
      error: String(err)
    });
  }
}
