export interface SaleCustomer {
  id: number;
  customerName: string;
}

export interface SaleMedicine {
  id: number;
  medicineName: string;
  category?: string;
  price?: number;
}

export interface Sale {
  id: number;
  customer: SaleCustomer;
  medicine: SaleMedicine;
  quantity: number;
  totalPrice: number;
  saleDate: string;
}