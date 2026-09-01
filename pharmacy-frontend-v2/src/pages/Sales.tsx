import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Skeleton,
  Avatar,
} from "@mui/material";
import { Add, ReceiptOutlined, Delete, PointOfSaleOutlined } from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import CreateSaleDialog from "../components/sales/CreateSaleDialog";
import DeleteConfirmDialog from "../components/medicines/DeleteConfirmDialog";
import salesService from "../services/salesService";
import invoiceService from "../services/invoiceService";
import type { Sale } from "../types/sale.types";

const formatCurrency = (v: number) => `₹${v.toLocaleString("en-IN")}`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const getInitials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Sale | null>(null);
  const [invoicingId, setInvoicingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await salesService.getAll();
      const sorted = [...data].sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
      setSales(sorted);
    } catch {
      setSnackbar({ open: true, message: "Failed to load sales.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await salesService.remove(deleteTarget.id);
      setSnackbar({ open: true, message: "Sale deleted successfully.", severity: "success" });
      setDeleteTarget(null);
      await loadSales();
    } catch {
      setSnackbar({ open: true, message: "Failed to delete sale.", severity: "error" });
    }
  };

  const handleGenerateInvoice = async (sale: Sale) => {
    setInvoicingId(sale.id);
    try {
      await invoiceService.createForSale(sale.id);
      setSnackbar({ open: true, message: `Invoice generated for sale #${sale.id}.`, severity: "success" });
    } catch (err: any) {
      const message =
        typeof err?.response?.data === "string" ? err.response.data : "Failed to generate invoice.";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setInvoicingId(null);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PointOfSaleOutlined color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Sales</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          Create Sale
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F4F6F9" }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Medicine</b></TableCell>
              <TableCell align="right"><b>Qty</b></TableCell>
              <TableCell align="right"><b>Total</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7}><Skeleton height={40} /></TableCell></TableRow>
              ))}

            {!loading && sales.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>No sales recorded yet.</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && sales.map((sale) => (
              <TableRow key={sale.id} hover>
                <TableCell>{sale.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "#1565C0", fontSize: 12 }}>
                      {getInitials(sale.customer?.customerName ?? "?")}
                    </Avatar>
                    {sale.customer?.customerName ?? "—"}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "#666" }}>{sale.medicine?.medicineName ?? "—"}</TableCell>
                <TableCell align="right">{sale.quantity}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(sale.totalPrice)}</TableCell>
                <TableCell sx={{ color: "#666" }}>{formatDate(sale.saleDate)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Generate Invoice">
                    <IconButton size="small" onClick={() => handleGenerateInvoice(sale)} disabled={invoicingId === sale.id}>
                      <ReceiptOutlined fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => setDeleteTarget(sale)}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <CreateSaleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={loadSales}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Sale"
        message={`Delete sale #${deleteTarget?.id}? This cannot be undone (stock will not be restored automatically).`}
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

export default Sales;