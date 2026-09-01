export interface StockMovement {
  id: number;
  medicineId: number;
  changeAmount: number;
  reason: string;
  movedAt: string;
}