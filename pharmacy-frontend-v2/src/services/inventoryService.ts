import api from "./api";
import type { InventoryItem, InventoryFormValues } from "../types/inventory.types";

const getAll = async (): Promise<InventoryItem[]> => {
  const response = await api.get<InventoryItem[]>("/inventory");
  return response.data;
};

const create = async (data: InventoryFormValues): Promise<InventoryItem> => {
  const response = await api.post<InventoryItem>("/inventory", data);
  return response.data;
};

const update = async (id: number, data: InventoryFormValues): Promise<InventoryItem> => {
  const response = await api.put<InventoryItem>(`/inventory/${id}`, data);
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  await api.delete(`/inventory/${id}`);
};

const inventoryService = { getAll, create, update, remove };
export default inventoryService;