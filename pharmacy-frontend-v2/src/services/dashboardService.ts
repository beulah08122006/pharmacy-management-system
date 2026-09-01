import api from "./api";
import type { DashboardSummary } from "../types/dashboard.types";
import type { Medicine } from "../types/medicine.types";
import type { InventoryItem } from "../types/inventory.types";
import type { Sale } from "../types/sale.types";
import type { Invoice } from "../types/invoice.types";

const getSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/dashboard");
  return response.data;
};

const getExpiringMedicines = async (): Promise<Medicine[]> => {
  const response = await api.get<Medicine[]>("/medicines/expiring");
  return response.data;
};

const getLowStockMedicines = async (): Promise<Medicine[]> => {
  const response = await api.get<InventoryItem[]>("/inventory/low-stock");
  return response.data.map((item) => ({
    ...item.medicine,
    quantity: item.quantity,
  }));
};

const getRecentSales = async (limit = 5): Promise<Sale[]> => {
  const response = await api.get<Sale[]>("/sales");
  const sorted = [...response.data].sort(
    (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
  );
  return sorted.slice(0, limit);
};

const getAllSales = async (): Promise<Sale[]> => {
  const response = await api.get<Sale[]>("/sales");
  return response.data;
};

const getRecentInvoices = async (limit = 5): Promise<Invoice[]> => {
  const response = await api.get<Invoice[]>("/invoices");
  const sorted = [...response.data].sort(
    (a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
  );
  return sorted.slice(0, limit);
};

const dashboardService = {
  getSummary,
  getExpiringMedicines,
  getLowStockMedicines,
  getRecentSales,
  getAllSales,
  getRecentInvoices,
};

export default dashboardService;