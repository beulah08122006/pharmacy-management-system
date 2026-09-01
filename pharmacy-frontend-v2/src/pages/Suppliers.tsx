import { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, TextField, InputAdornment, Button, Paper, Grid,
  Card, CardContent, Avatar, IconButton, Snackbar, Alert, Skeleton, Tooltip,
} from "@mui/material";
import { Search, Add, Edit, Delete, LocalShippingOutlined, Place, Phone, Email } from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import SupplierFormDialog from "../components/suppliers/SupplierFormDialog";
import DeleteConfirmDialog from "../components/medicines/DeleteConfirmDialog";
import supplierService from "../services/supplierService";
import type { Supplier, SupplierFormValues } from "../types/supplier.types";

const getInitials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch {
      setSnackbar({ open: true, message: "Failed to load suppliers.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filtered = useMemo(() => {
    return suppliers.filter((s) =>
      s.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      s.companyName.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const handleSave = async (data: SupplierFormValues) => {
    try {
      if (editing) {
        await supplierService.update(editing.id, data);
        setSnackbar({ open: true, message: "Supplier updated successfully.", severity: "success" });
      } else {
        await supplierService.create(data);
        setSnackbar({ open: true, message: "Supplier added successfully.", severity: "success" });
      }
      await loadSuppliers();
    } catch {
      setSnackbar({ open: true, message: "Failed to save supplier.", severity: "error" });
      throw new Error("save failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await supplierService.remove(deleteTarget.id);
      setSnackbar({ open: true, message: "Supplier deleted.", severity: "success" });
      setDeleteTarget(null);
      await loadSuppliers();
    } catch {
      setSnackbar({ open: true, message: "Failed to delete supplier.", severity: "error" });
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalShippingOutlined color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Supplier Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Add Supplier
        </Button>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Total Suppliers</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{suppliers.length}</Typography>}
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", mb: 3 }}>
        <TextField
          placeholder="Search supplier or company..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
          sx={{ minWidth: 280 }}
        />
      </Paper>

      <Typography sx={{ fontWeight: 700, mb: 2 }}>Supplier Directory</Typography>

      {loading && (
        <Grid container spacing={2.5}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filtered.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>No suppliers found.</Typography>
      )}

      {!loading && (
        <Grid container spacing={2.5}>
          {filtered.map((supplier) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={supplier.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", height: "100%",
                  transition: "0.25s",
                  "&:hover": { boxShadow: "0 16px 40px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: "#1565C0" }}>
                      {getInitials(supplier.supplierName)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{supplier.supplierName}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#666" }}>{supplier.companyName}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Place sx={{ fontSize: 16, color: "#999" }} />
                    <Typography sx={{ fontSize: 13, color: "#666" }}>{supplier.address}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Phone sx={{ fontSize: 16, color: "#999" }} />
                    <Typography sx={{ fontSize: 13, color: "#666" }}>{supplier.phone}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Email sx={{ fontSize: 16, color: "#999" }} />
                    <Typography sx={{ fontSize: 13, color: "#666" }}>{supplier.email}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => { setEditing(supplier); setFormOpen(true); }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleteTarget(supplier)}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <SupplierFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editing} />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Supplier"
        message={`Delete "${deleteTarget?.supplierName}"? This cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default Suppliers;