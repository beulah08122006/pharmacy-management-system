import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, CircularProgress } from "@mui/material";
import type { Customer, CustomerFormValues } from "../../types/customer.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomerFormValues) => Promise<void>;
  initialData?: Customer | null;
}

const emptyForm: CustomerFormValues = { customerName: "", email: "", phone: "", address: "" };

const CustomerFormDialog = ({ open, onClose, onSave, initialData }: Props) => {
  const [form, setForm] = useState<CustomerFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormValues, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? { customerName: initialData.customerName, email: initialData.email, phone: initialData.phone, address: initialData.address }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.customerName.trim()) next.customerName = "Customer name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.address.trim()) next.address = "Address is required";
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
      <DialogTitle sx={{ fontWeight: 700 }}>{initialData ? "Edit Customer" : "Add Customer"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth label="Customer Name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              error={Boolean(errors.customerName)} helperText={errors.customerName}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth label="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              error={Boolean(errors.phone)} helperText={errors.phone}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={Boolean(errors.email)} helperText={errors.email}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth label="Address / City"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              error={Boolean(errors.address)} helperText={errors.address}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerFormDialog;