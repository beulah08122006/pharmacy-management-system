const axios = require("axios");

async function run() {
  // 1. Get all sales
  const salesRes = await axios.get("http://localhost:5050/api/sales");
  const sales = salesRes.data;

  // 2. Get all existing invoices, to know which sale IDs already have one
  const invoicesRes = await axios.get("http://localhost:5050/api/invoices");
  const invoicedSaleIds = new Set(
    invoicesRes.data.map((inv) => inv.sale?.id).filter(Boolean)
  );

  // 3. For every sale without an invoice yet, create one
  for (const sale of sales) {
    if (invoicedSaleIds.has(sale.id)) {
      console.log(`Sale ${sale.id}: already has an invoice, skipping`);
      continue;
    }
    try {
      const res = await axios.post(`http://localhost:5050/api/invoices/${sale.id}`);
      console.log(`Sale ${sale.id}: invoice created -> ${res.data.invoiceNumber}`);
    } catch (err) {
      console.log(`Sale ${sale.id}: FAILED ->`, err.response?.data || err.message);
    }
  }
}

run();