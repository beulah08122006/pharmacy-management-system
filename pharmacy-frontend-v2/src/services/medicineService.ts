import api from "./api";
import type { Medicine, MedicineFormValues } from "../types/medicine.types";

const getAll = async (): Promise<Medicine[]> => {
  const response = await api.get<Medicine[]>("/medicines");
  return response.data;
};

const create = async (data: MedicineFormValues): Promise<Medicine> => {
  const response = await api.post<Medicine>("/medicines", data);
  return response.data;
};

const update = async (id: number, data: MedicineFormValues): Promise<Medicine> => {
  const response = await api.put<Medicine>(`/medicines/${id}`, data);
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  await api.delete(`/medicines/${id}`);
};

const medicineService = { getAll, create, update, remove };
export default medicineService;