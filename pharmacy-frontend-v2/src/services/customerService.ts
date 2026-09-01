import api from "./api";
import type { Customer, CustomerFormValues } from "../types/customer.types";

const getAll = async (): Promise<Customer[]> => {
  const response = await api.get<Customer[]>("/customers");
  return response.data;
};

const create = async (data: CustomerFormValues): Promise<Customer> => {
  const response = await api.post<Customer>("/customers", data);
  return response.data;
};

const update = async (id: number, data: CustomerFormValues): Promise<Customer> => {
  const response = await api.put<Customer>(`/customers/${id}`, data);
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}`);
};

const customerService = { getAll, create, update, remove };
export default customerService;