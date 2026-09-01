import api from "./api";
import type { PharmacySettings } from "../types/pharmacySettings.types";

const get = async (): Promise<PharmacySettings> => {
  const response = await api.get<PharmacySettings>("/pharmacy-settings");
  return response.data;
};

const update = async (data: PharmacySettings): Promise<PharmacySettings> => {
  const response = await api.put<PharmacySettings>("/pharmacy-settings", data);
  return response.data;
};

const pharmacySettingsService = { get, update };
export default pharmacySettingsService;