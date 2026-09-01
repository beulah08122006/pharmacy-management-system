import type { Medicine } from "./medicine.types";

export interface InventoryItem {
  id: number;
  medicine: Medicine;
  quantity: number;
  minimumStock: number;
}

export interface InventoryFormValues {
  medicine: { id: number };
  quantity: number;
  minimumStock: number;
}