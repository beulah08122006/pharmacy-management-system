import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import customerService from "../../services/customerService";
import medicineService from "../../services/medicineService";
import salesService from "../../services/salesService";
import type { Customer } from "../../types/customer.types";
import type { Medicine } from "../../types/medicine.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateSaleDialog = ({ open, onClose, onSuccess }: Props) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedCustomer(null);
      setSelectedMedicine(null);
      setQuantity(1);
      setError(null);
      setLoadingOptions(true);
      Promise.all([customerService.getAll(), medicineService.getAll()])
        .then(([c, m]) => {
          setCustomers(c);
          setMedicines(m);
        })
        .catch(() => setError("Failed to load customers/medicines."))
        .finally(() => setLoadingOptions(false));
    }
  }, [open]);

  const estimatedTotal = useMemo(() => {
    if (!selectedMedicine || quantity <= 0) return 0;
    return selectedMedicine.price * quantity;
  }, [selectedMedicine, quantity]);

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedMedicine || quantity <= 0) {
      setError("Please select a customer, medicine, and a valid quantity.");
      return;
    }
    if (quantity > selectedMedicine.quantity) {
      setError(`Only ${selectedMedicine.quantity} units of ${selectedMedicine.medicineName} are in stock.`);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await salesService.create({
        customer: { id: selectedCustomer.id },
        medicine: { id: selectedMedicine.id },
        quantity,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Failed to create sale.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Create Sale</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loadingOptions ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Autocomplete
              options={customers}
              getOptionLabel={(c) => c.customerName}
              value={selectedCustomer}
              onChange={(_, value) => setSelectedCustomer(value)}
              renderInput={(params) => <TextField {...params} label="Customer" />}
            />

            <Autocomplete
              options={medicines}
              getOptionLabel={(m) => `${m.medicineName} (${m.quantity} in stock)`}
              value={selectedMedicine}
              onChange={(_, value) => setSelectedMedicine(value)}
              renderInput={(params) => <TextField {...params} label="Medicine" />}
            />

            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              slotProps={{ htmlInput: { min: 1 } }}
            />

            {selectedMedicine && (
              <Box sx={{ bgcolor: "#F4F6F9", borderRadius: 2, p: 2 }}>
                <Typography sx={{ fontSize: 13, color: "#666" }}>
                  Unit price: ₹{selectedMedicine.price}
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, mt: 0.5 }}>
                  Total: ₹{estimatedTotal.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving || loadingOptions}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Confirm Sale"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSaleDialog;