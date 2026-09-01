import api from "./api";
import type { Sale } from "../types/sale.types";

export interface CreateSalePayload {
  customer: { id: number };
  medicine: { id: number };
  quantity: number;
}

const getAll = async (): Promise<Sale[]> => {
  const response = await api.get<Sale[]>("/sales");
  return response.data;
};

const create = async (payload: CreateSalePayload): Promise<Sale> => {
  const response = await api.post<Sale>("/sales", payload);
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  await api.delete(`/sales/${id}`);
};

const salesService = { getAll, create, remove };
export default salesService;