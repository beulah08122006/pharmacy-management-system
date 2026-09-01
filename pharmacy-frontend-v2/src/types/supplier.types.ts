export interface Supplier {
  id: number;
  supplierName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
}

export interface SupplierFormValues {
  supplierName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
}