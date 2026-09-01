import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import medicineService from "../../services/medicineService";
import type { Medicine } from "../../types/medicine.types";
import type { InventoryItem, InventoryFormValues } from "../../types/inventory.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: InventoryFormValues) => Promise<void>;
  initialData?: InventoryItem | null;
}

const InventoryFormDialog = ({ open, onClose, onSave, initialData }: Props) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [minimumStock, setMinimumStock] = useState<number>(0);
  const [errors, setErrors] = useState<{ medicine?: string; quantity?: string; minimumStock?: string }>({});
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      setLoadingOptions(true);
      medicineService.getAll()
        .then((data) => {
          setMedicines(data);
          if (initialData) {
            const match = data.find((m) => m.id === initialData.medicine.id) ?? null;
            setSelectedMedicine(match);
            setQuantity(initialData.quantity);
            setMinimumStock(initialData.minimumStock);
          } else {
            setSelectedMedicine(null);
            setQuantity(0);
            setMinimumStock(0);
          }
        })
        .finally(() => setLoadingOptions(false));
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!selectedMedicine) next.medicine = "Please select a medicine";
    if (quantity < 0) next.quantity = "Quantity cannot be negative";
    if (minimumStock < 0) next.minimumStock = "Minimum stock cannot be negative";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !selectedMedicine) return;
    setSaving(true);
    try {
      await onSave({ medicine: { id: selectedMedicine.id }, quantity, minimumStock });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? "Update Inventory" : "Add Inventory"}
      </DialogTitle>
      <DialogContent>
        {loadingOptions ? (
          <CircularProgress size={24} sx={{ mt: 2 }} />
        ) : (
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                options={medicines}
                getOptionLabel={(m) => m.medicineName}
                value={selectedMedicine}
                disabled={Boolean(initialData)}
                onChange={(_, value) => setSelectedMedicine(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Medicine" error={Boolean(errors.medicine)} helperText={errors.medicine} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Current Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Stock Threshold"
                value={minimumStock}
                onChange={(e) => setMinimumStock(Number(e.target.value))}
                error={Boolean(errors.minimumStock)}
                helperText={errors.minimumStock}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || loadingOptions}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryFormDialog;