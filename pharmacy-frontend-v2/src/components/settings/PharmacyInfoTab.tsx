import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Grid, Snackbar, Alert, CircularProgress } from "@mui/material";
import pharmacySettingsService from "../../services/pharmacySettingsService";
import type { PharmacySettings } from "../../types/pharmacySettings.types";

const PharmacyInfoTab = () => {
  const [form, setForm] = useState<PharmacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  useEffect(() => {
    pharmacySettingsService.get()
      .then(setForm)
      .catch(() => setSnackbar({ open: true, message: "Failed to load pharmacy settings.", severity: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const updated = await pharmacySettingsService.update(form);
      setForm(updated);
      setSnackbar({ open: true, message: "Pharmacy information saved.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to save.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <CircularProgress size={28} sx={{ mt: 2 }} />;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Pharmacy Information</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Pharmacy Name" value={form.pharmacyName}
            onChange={(e) => setForm({ ...form, pharmacyName: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Phone Number" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Pharmacy Address" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Email Address" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="GST Number" value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="License Number" value={form.licenseNumber}
            onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField fullWidth type="time" label="Opening Time" value={form.openingTime}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => setForm({ ...form, openingTime: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField fullWidth type="time" label="Closing Time" value={form.closingTime}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => setForm({ ...form, closingTime: e.target.value })} />
        </Grid>
      </Grid>
      <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ mt: 3 }}>
        {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PharmacyInfoTab;