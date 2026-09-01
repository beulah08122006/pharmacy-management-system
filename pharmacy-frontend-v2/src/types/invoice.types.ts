export interface InvoiceCustomer {
  id: number;
  customerName: string;
}

export interface InvoiceSaleMedicine {
  id: number;
  medicineName: string;
}

export interface InvoiceSale {
  id: number;
  medicine: InvoiceSaleMedicine;
  quantity: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customer: InvoiceCustomer;
  sale: InvoiceSale;
  totalAmount: number;
  invoiceDate: string;
}