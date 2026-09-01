import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  Skeleton,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Add,
  Visibility,
  Edit,
  Delete,
  MedicationOutlined,
} from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import MedicineStatusChip from "../components/medicines/MedicineStatusChip";
import MedicineFormDialog from "../components/medicines/MedicineFormDialog";
import DeleteConfirmDialog from "../components/medicines/DeleteConfirmDialog";
import medicineService from "../services/medicineService";
import type { Medicine, MedicineFormValues } from "../types/medicine.types";

type StatusFilter = "all" | "in" | "low" | "out";

const getStatus = (quantity: number): StatusFilter extends "all" ? never : "in" | "low" | "out" => {
  if (quantity === 0) return "out";
  if (quantity < 20) return "low";
  return "in";
};

const Medicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [viewing, setViewing] = useState<Medicine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getAll();
      setMedicines(data);
    } catch {
      setSnackbar({ open: true, message: "Failed to load medicines.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(medicines.map((m) => m.category));
    return Array.from(set);
  }, [medicines]);

  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch = m.medicineName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || m.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || getStatus(m.quantity) === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [medicines, search, categoryFilter, statusFilter]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleAddClick = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setEditing(medicine);
    setFormOpen(true);
  };

  const handleSave = async (data: MedicineFormValues) => {
    try {
      if (editing) {
        await medicineService.update(editing.id, data);
        setSnackbar({ open: true, message: "Medicine updated successfully.", severity: "success" });
      } else {
        await medicineService.create(data);
        setSnackbar({ open: true, message: "Medicine added successfully.", severity: "success" });
      }
      await loadMedicines();
    } catch (err: any) {
      const message =
        err?.response?.data?.messages
          ? Object.values(err.response.data.messages).join(", ")
          : "Failed to save medicine.";
      setSnackbar({ open: true, message, severity: "error" });
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await medicineService.remove(deleteTarget.id);
      setSnackbar({ open: true, message: "Medicine deleted successfully.", severity: "success" });
      setDeleteTarget(null);
      await loadMedicines();
    } catch {
      setSnackbar({ open: true, message: "Failed to delete medicine.", severity: "error" });
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <MedicationOutlined color="primary" fontSize="large" />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Medicines</Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
          <TextField
            placeholder="Search medicine..."
            size="small"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
            sx={{ minWidth: 240 }}
          />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Select
              size="small"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(0); }}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="in">In Stock</MenuItem>
              <MenuItem value="low">Low Stock</MenuItem>
              <MenuItem value="out">Out of Stock</MenuItem>
            </Select>

            <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
              Add Medicine
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F4F6F9" }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell></TableCell>
              <TableCell><b>Medicine</b></TableCell>
              <TableCell><b>Manufacturer</b></TableCell>
              <TableCell align="right"><b>Stock</b></TableCell>
              <TableCell align="right"><b>Price</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}><Skeleton height={40} /></TableCell>
                </TableRow>
              ))}

            {!loading && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>No medicines found.</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && paginated.map((medicine) => (
              <TableRow key={medicine.id} hover>
                <TableCell>{medicine.id}</TableCell>
                <TableCell>
                  <MedicationOutlined sx={{ color: "#90A4AE" }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{medicine.medicineName}</TableCell>
                <TableCell sx={{ color: "#666" }}>{medicine.manufacturer}</TableCell>
                <TableCell align="right">{medicine.quantity}</TableCell>
                <TableCell align="right">₹{medicine.price}</TableCell>
                <TableCell><MedicineStatusChip quantity={medicine.quantity} /></TableCell>
                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => setViewing(medicine)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditClick(medicine)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => setDeleteTarget(medicine)}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <MedicineFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editing}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Medicine"
        message={`Are you sure you want to delete "${deleteTarget?.medicineName}"? This cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default Medicines;