import api from "./api";
import type { Supplier, SupplierFormValues } from "../types/supplier.types";

const getAll = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>("/suppliers");
  return response.data;
};

const create = async (data: SupplierFormValues): Promise<Supplier> => {
  const response = await api.post<Supplier>("/suppliers", data);
  return response.data;
};

const update = async (id: number, data: SupplierFormValues): Promise<Supplier> => {
  const response = await api.put<Supplier>(`/suppliers/${id}`, data);
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
};

const supplierService = { getAll, create, update, remove };
export default supplierService;