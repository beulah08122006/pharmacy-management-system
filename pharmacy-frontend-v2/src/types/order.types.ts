import type { Customer } from "./customer.types";
import type { Medicine } from "./medicine.types";

export interface OrderItem {
  id: number;
  medicine: Medicine;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: Customer;
  orderDate: string;
  subtotal: number;
  discount: number;
  gst: number;
  grandTotal: number;
  paymentMode: string;
  items: OrderItem[];
}

export interface OrderItemRequest {
  medicineId: number;
  quantity: number;
}

export interface OrderRequest {
  customerId: number;
  items: OrderItemRequest[];
  discount: number;
  gst: number;
  paymentMode: string;
}