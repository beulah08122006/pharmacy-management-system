import api from "./api";
import type { Invoice } from "../types/invoice.types";

const createForSale = async (saleId: number): Promise<Invoice> => {
  const response = await api.post<Invoice>(`/invoices/${saleId}`);
  return response.data;
};

const getAll = async (): Promise<Invoice[]> => {
  const response = await api.get<Invoice[]>("/invoices");
  return response.data;
};

const invoiceService = { createForSale, getAll };
export default invoiceService;