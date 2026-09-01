import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import type { Medicine, MedicineFormValues } from "../../types/medicine.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: MedicineFormValues) => Promise<void>;
  initialData?: Medicine | null;
}

const emptyForm: MedicineFormValues = {
  medicineName: "",
  category: "",
  manufacturer: "",
  price: 0,
  quantity: 0,
  expiryDate: "",
};

const MedicineFormDialog = ({ open, onClose, onSave, initialData }: Props) => {
  const [form, setForm] = useState<MedicineFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof MedicineFormValues, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              medicineName: initialData.medicineName,
              category: initialData.category,
              manufacturer: initialData.manufacturer,
              price: initialData.price,
              quantity: initialData.quantity,
              expiryDate: initialData.expiryDate,
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof MedicineFormValues, string>> = {};
    if (!form.medicineName.trim()) next.medicineName = "Medicine name is required";
    if (!form.category.trim()) next.category = "Category is required";
    if (!form.manufacturer.trim()) next.manufacturer = "Manufacturer is required";
    if (!(form.price > 0)) next.price = "Price must be greater than 0";
    if (form.quantity < 0) next.quantity = "Quantity cannot be negative";
    if (!form.expiryDate) next.expiryDate = "Expiry date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? "Edit Medicine" : "Add Medicine"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Medicine Name"
              value={form.medicineName}
              onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
              error={Boolean(errors.medicineName)}
              helperText={errors.medicineName}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              error={Boolean(errors.category)}
              helperText={errors.category}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Manufacturer"
              value={form.manufacturer}
              onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
              error={Boolean(errors.manufacturer)}
              helperText={errors.manufacturer}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Price (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              error={Boolean(errors.price)}
              helperText={errors.price}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              error={Boolean(errors.quantity)}
              helperText={errors.quantity}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="date"
              label="Expiry Date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              error={Boolean(errors.expiryDate)}
              helperText={errors.expiryDate}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicineFormDialog;