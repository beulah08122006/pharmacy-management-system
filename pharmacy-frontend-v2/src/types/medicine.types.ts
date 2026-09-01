export interface Medicine {
  id: number;
  medicineName: string;
  category: string;
  manufacturer: string;
  price: number;
  quantity: number;
  expiryDate: string;
}

export interface MedicineFormValues {
  medicineName: string;
  category: string;
  manufacturer: string;
  price: number;
  quantity: number;
  expiryDate: string;
}