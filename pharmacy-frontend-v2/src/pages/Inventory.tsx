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
  Chip,
  Snackbar,
  Alert,
  Skeleton,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  Refresh,
  Inventory2Outlined,
} from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import InventoryFormDialog from "../components/inventory/InventoryFormDialog";
import DeleteConfirmDialog from "../components/medicines/DeleteConfirmDialog";
import inventoryService from "../services/inventoryService";
import type { InventoryItem, InventoryFormValues } from "../types/inventory.types";
import StockMovementLog from "../components/inventory/StockMovementLog";
import InventoryAlertsPanel from "../components/inventory/InventoryAlertsPanel";
import stockMovementService from "../services/stockMovementService";
import type { StockMovement } from "../types/stockMovement.types";

type StatusFilter = "all" | "in" | "low" | "out";

const getStatus = (item: InventoryItem): { key: "in" | "low" | "out"; label: string; bg: string; fg: string } => {
  if (item.quantity === 0) return { key: "out", label: "Out of Stock", bg: "#FDECEA", fg: "#C62828" };
  if (item.quantity <= item.minimumStock) return { key: "low", label: "Low Stock", bg: "#FFF8E1", fg: "#B26A00" };
  return { key: "in", label: "In Stock", bg: "#E8F5E9", fg: "#2E7D32" };
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const isExpiringSoon = (iso?: string, days = 30) => {
  if (!iso) return false;
  const diff = (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
};

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const loadInventory = async () => {
    setLoading(true);
    try {
      const [data, moves] = await Promise.all([
        inventoryService.getAll(),
        stockMovementService.getRecent(),
      ]);
      setItems(data);
      setMovements(moves);
    } catch {
      setSnackbar({ open: true, message: "Failed to load inventory.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.medicine?.category).filter(Boolean));
    return Array.from(set);
  }, [items]);

  const summary = useMemo(() => {
    const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
    const lowStock = items.filter((i) => getStatus(i).key === "low").length;
    const outOfStock = items.filter((i) => getStatus(i).key === "out").length;
    const expiringSoon = items.filter((i) => isExpiringSoon(i.medicine?.expiryDate)).length;
    return { totalUnits, lowStock, outOfStock, expiringSoon };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.medicine?.medicineName?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.medicine?.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || getStatus(item).key === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  const handleAddClick = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleRestock = async (item: InventoryItem) => {
    const amountStr = window.prompt(`Restock ${item.medicine?.medicineName} — how many units to add?`, "20");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (!amount || amount <= 0) return;

    try {
      await inventoryService.update(item.id, {
        medicine: { id: item.medicine.id },
        quantity: item.quantity + amount,
        minimumStock: item.minimumStock,
      });
      setSnackbar({ open: true, message: `Restocked ${item.medicine?.medicineName} by ${amount} units.`, severity: "success" });
      await loadInventory();
    } catch {
      setSnackbar({ open: true, message: "Failed to restock.", severity: "error" });
    }
  };

  const handleSave = async (data: InventoryFormValues) => {
    try {
      if (editing) {
        await inventoryService.update(editing.id, data);
        setSnackbar({ open: true, message: "Inventory updated successfully.", severity: "success" });
      } else {
        await inventoryService.create(data);
        setSnackbar({ open: true, message: "Inventory added successfully.", severity: "success" });
      }
      await loadInventory();
    } catch {
      setSnackbar({ open: true, message: "Failed to save inventory.", severity: "error" });
      throw new Error("save failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await inventoryService.remove(deleteTarget.id);
      setSnackbar({ open: true, message: "Inventory record deleted.", severity: "success" });
      setDeleteTarget(null);
      await loadInventory();
    } catch {
      setSnackbar({ open: true, message: "Failed to delete inventory record.", severity: "error" });
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Inventory2Outlined color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Inventory</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          Add Inventory
        </Button>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Total Units</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.totalUnits}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#FFF8E1", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#B26A00" }}>Low Stock</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#B26A00" }}>{summary.lowStock}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#FDECEA", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#C62828" }}>Out of Stock</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#C62828" }}>{summary.outOfStock}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Expiring Soon</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.expiringSoon}</Typography>}
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            placeholder="Search medicine..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
            sx={{ minWidth: 240 }}
          />
          <Select size="small" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
          <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="in">In Stock</MenuItem>
            <MenuItem value="low">Low Stock</MenuItem>
            <MenuItem value="out">Out of Stock</MenuItem>
          </Select>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F4F6F9" }}>
              <TableCell><b>Medicine</b></TableCell>
              <TableCell align="right"><b>Qty</b></TableCell>
              <TableCell align="right"><b>Min Stock</b></TableCell>
              <TableCell><b>Expiry</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton height={40} /></TableCell></TableRow>
              ))}

            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>No inventory records found.</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && filtered.map((item) => {
              const status = getStatus(item);
              return (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.medicine?.medicineName ?? "—"}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.minimumStock}</TableCell>
                  <TableCell sx={{ color: "#666" }}>{formatDate(item.medicine?.expiryDate)}</TableCell>
                  <TableCell>
                    <Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.fg, fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="right">
                    {status.key !== "in" && (
                      <Tooltip title="Restock">
                        <IconButton size="small" onClick={() => handleRestock(item)}>
                          <Refresh fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditClick(item)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleteTarget(item)}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <InventoryFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editing}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Inventory Record"
        message={`Remove inventory tracking for "${deleteTarget?.medicine?.medicineName}"?`}
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

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <StockMovementLog movements={movements} items={items} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <InventoryAlertsPanel items={items} />
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Inventory;