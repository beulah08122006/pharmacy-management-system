import api from "./api";
import type { Employee, EmployeeFormValues } from "../types/employee.types";

const getAll = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>("/users");
  return response.data;
};

const create = async (data: EmployeeFormValues): Promise<Employee> => {
  const response = await api.post<Employee>("/users/register", data);
  return response.data;
};

const update = async (id: number, data: EmployeeFormValues): Promise<Employee> => {
  const response = await api.put<Employee>(`/users/${id}`, data);
  return response.data;
};

const resetPassword = async (id: number, newPassword: string): Promise<void> => {
  await api.put(`/users/${id}/reset-password`, { newPassword });
};

const changePassword = async (id: number, currentPassword: string, newPassword: string): Promise<void> => {
  await api.put(`/users/${id}/change-password`, { currentPassword, newPassword });
};

const remove = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

const employeeService = { getAll, create, update, resetPassword, changePassword, remove };
export default employeeService;