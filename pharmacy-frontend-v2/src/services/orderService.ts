import api from "./api";
import type { Order, OrderRequest } from "../types/order.types";

const create = async (data: OrderRequest): Promise<Order> => {
  const response = await api.post<Order>("/orders", data);
  return response.data;
};

const getAll = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/orders");
  return response.data;
};

const orderService = { create, getAll };
export default orderService;