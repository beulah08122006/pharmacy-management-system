import { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, TextField, InputAdornment, Select, MenuItem, Button,
  Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper,
  Snackbar, Alert, Skeleton, Tooltip, Grid, Avatar,
} from "@mui/material";
import { Search, Add, Visibility, Edit, Delete, PeopleAltOutlined } from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import CustomerFormDialog from "../components/customers/CustomerFormDialog";
import CustomerViewDialog from "../components/customers/CustomerViewDialog";
import DeleteConfirmDialog from "../components/medicines/DeleteConfirmDialog";
import customerService from "../services/customerService";
import invoiceService from "../services/invoiceService";
import type { Customer, CustomerFormValues } from "../types/customer.types";
import type { Invoice } from "../types/invoice.types";

type Segment = "all" | "new" | "returning" | "vip";
const VIP_THRESHOLD = 1000;

const getInitials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState<Segment>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [c, i] = await Promise.all([customerService.getAll(), invoiceService.getAll()]);
      setCustomers(c);
      setInvoices(i);
    } catch {
      setSnackbar({ open: true, message: "Failed to load customers.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const customerStats = useMemo(() => {
    const map = new Map<number, { visits: number; total: number; lastVisit: string | null; firstVisit: string | null }>();
    customers.forEach((c) => map.set(c.id, { visits: 0, total: 0, lastVisit: null, firstVisit: null }));
    invoices.forEach((inv) => {
      const custId = inv.customer?.id;
      if (custId == null || !map.has(custId)) return;
      const stat = map.get(custId)!;
      stat.visits += 1;
      stat.total += inv.totalAmount;
      if (!stat.lastVisit || new Date(inv.invoiceDate) > new Date(stat.lastVisit)) stat.lastVisit = inv.invoiceDate;
      if (!stat.firstVisit || new Date(inv.invoiceDate) < new Date(stat.firstVisit)) stat.firstVisit = inv.invoiceDate;
    });
    return map;
  }, [customers, invoices]);

  const summary = useMemo(() => {
    const now = new Date();
    let newThisMonth = 0, returning = 0, vip = 0;
    customerStats.forEach((stat) => {
      if (stat.firstVisit) {
        const d = new Date(stat.firstVisit);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) newThisMonth++;
      }
      if (stat.visits >= 2) returning++;
      if (stat.total > VIP_THRESHOLD) vip++;
    });
    return { total: customers.length, newThisMonth, returning, vip };
  }, [customers, customerStats]);

  const cities = useMemo(() => Array.from(new Set(customers.map((c) => c.address).filter(Boolean))), [customers]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const stat = customerStats.get(c.id);
      const matchesSearch = c.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter === "all" || c.address === cityFilter;
      let matchesSegment = true;
      if (segmentFilter === "returning") matchesSegment = (stat?.visits ?? 0) >= 2;
      if (segmentFilter === "vip") matchesSegment = (stat?.total ?? 0) > VIP_THRESHOLD;
      if (segmentFilter === "new") {
        const now = new Date();
        matchesSegment = stat?.firstVisit
          ? new Date(stat.firstVisit).getMonth() === now.getMonth() && new Date(stat.firstVisit).getFullYear() === now.getFullYear()
          : false;
      }
      return matchesSearch && matchesCity && matchesSegment;
    });
  }, [customers, customerStats, search, cityFilter, segmentFilter]);

  const handleSave = async (data: CustomerFormValues) => {
    try {
      if (editing) {
        await customerService.update(editing.id, data);
        setSnackbar({ open: true, message: "Customer updated successfully.", severity: "success" });
      } else {
        await customerService.create(data);
        setSnackbar({ open: true, message: "Customer added successfully.", severity: "success" });
      }
      await loadData();
    } catch {
      setSnackbar({ open: true, message: "Failed to save customer.", severity: "error" });
      throw new Error("save failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await customerService.remove(deleteTarget.id);
      setSnackbar({ open: true, message: "Customer deleted.", severity: "success" });
      setDeleteTarget(null);
      await loadData();
    } catch {
      setSnackbar({ open: true, message: "Failed to delete customer.", severity: "error" });
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PeopleAltOutlined color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Customer Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Add Customer
        </Button>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Total Customers</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.total}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>New This Month</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.newThisMonth}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Returning Customers</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.returning}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>VIP Customers</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.vip}</Typography>}
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            placeholder="Search customer..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
            sx={{ minWidth: 240 }}
          />
          <Select size="small" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">All Cities</MenuItem>
            {cities.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
          <Select size="small" value={segmentFilter} onChange={(e) => setSegmentFilter(e.target.value as Segment)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">All Segments</MenuItem>
            <MenuItem value="new">New This Month</MenuItem>
            <MenuItem value="returning">Returning</MenuItem>
            <MenuItem value="vip">VIP</MenuItem>
          </Select>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F4F6F9" }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>City</b></TableCell>
              <TableCell align="right"><b>Visits</b></TableCell>
              <TableCell><b>Last Visit</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={7}><Skeleton height={40} /></TableCell></TableRow>
            ))}

            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center"><Typography color="text.secondary" sx={{ py: 3 }}>No customers found.</Typography></TableCell></TableRow>
            )}

            {!loading && filtered.map((customer) => {
              const stat = customerStats.get(customer.id);
              return (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "#1565C0", fontSize: 12 }}>
                        {getInitials(customer.customerName)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600 }}>{customer.customerName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell sx={{ color: "#666" }}>{customer.email}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell align="right">{stat?.visits ?? 0}</TableCell>
                  <TableCell sx={{ color: "#666" }}>
                    {stat?.lastVisit ? new Date(stat.lastVisit).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View"><IconButton size="small" onClick={() => setViewing(customer)}><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => { setEditing(customer); setFormOpen(true); }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteTarget(customer)}><Delete fontSize="small" color="error" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <CustomerFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editing} />
      <CustomerViewDialog open={Boolean(viewing)} onClose={() => setViewing(null)} customer={viewing} invoices={invoices} />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Customer"
        message={`Delete "${deleteTarget?.customerName}"? This cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default Customers;