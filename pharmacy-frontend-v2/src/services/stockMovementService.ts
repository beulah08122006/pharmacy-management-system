import api from "./api";
import type { StockMovement } from "../types/stockMovement.types";

const getRecent = async (): Promise<StockMovement[]> => {
  const response = await api.get<StockMovement[]>("/stock-movements");
  return response.data;
};

const stockMovementService = { getRecent };
export default stockMovementService;