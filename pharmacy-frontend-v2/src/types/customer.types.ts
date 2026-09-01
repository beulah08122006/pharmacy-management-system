export interface Customer {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
}

export interface CustomerFormValues {
  customerName: string;
  email: string;
  phone: string;
  address: string;
}