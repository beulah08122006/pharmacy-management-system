import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Select, MenuItem, FormControlLabel, Switch, CircularProgress } from "@mui/material";
import type { Employee, EmployeeFormValues, EmployeeRole } from "../../types/employee.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: EmployeeFormValues) => Promise<void>;
  initialData?: Employee | null;
}

const emptyForm: EmployeeFormValues = {
  fullName: "", email: "", role: "PHARMACIST", active: true,
  phone: "", address: "", salary: 0, shift: "Morning", emergencyContact: "", notes: "", password: "",
};

const EmployeeFormDialog = ({ open, onClose, onSave, initialData }: Props) => {
  const [form, setForm] = useState<EmployeeFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormValues, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              fullName: initialData.fullName, email: initialData.email, role: initialData.role,
              active: initialData.active, phone: initialData.phone ?? "", address: initialData.address ?? "",
              salary: initialData.salary ?? 0, shift: initialData.shift ?? "Morning",
              emergencyContact: initialData.emergencyContact ?? "", notes: initialData.notes ?? "",
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!initialData && !form.password?.trim()) next.password = "Password is required for new employees";
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
      <DialogTitle sx={{ fontWeight: 700 }}>{initialData ? "Edit Employee" : "Add Employee"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Full Name" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              error={Boolean(errors.fullName)} helperText={errors.fullName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Select fullWidth value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as EmployeeRole })}>
              <MenuItem value="PHARMACIST">Pharmacist</MenuItem>
              <MenuItem value="CASHIER">Cashier</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Email" value={form.email} disabled={Boolean(initialData)}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={Boolean(errors.email)} helperText={errors.email} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Address" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth type="number" label="Salary (₹)" value={form.salary}
              onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Select fullWidth value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}>
              <MenuItem value="Morning">Morning</MenuItem>
              <MenuItem value="Evening">Evening</MenuItem>
              <MenuItem value="Night">Night</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Emergency Contact" value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Notes" multiline rows={2} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Grid>
          {!initialData && (
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth type="password" label="Password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={Boolean(errors.password)} helperText={errors.password} />
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />}
              label="Active"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFormDialog;