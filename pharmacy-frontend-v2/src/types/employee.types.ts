export type EmployeeRole = "ADMIN" | "PHARMACIST" | "CASHIER";

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  role: EmployeeRole;
  active: boolean;
  createdAt: string;
  phone?: string;
  address?: string;
  salary?: number;
  shift?: string;
  emergencyContact?: string;
  notes?: string;
}

export interface EmployeeFormValues {
  fullName: string;
  email: string;
  role: EmployeeRole;
  active: boolean;
  phone: string;
  address: string;
  salary: number;
  shift: string;
  emergencyContact: string;
  notes: string;
  password?: string; // only used on create
}