import { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, TextField, InputAdornment, Select, MenuItem, Button, Grid,
  Card, CardContent, Avatar, Chip, IconButton, Snackbar, Alert, Skeleton, Tooltip, Paper,
} from "@mui/material";
import { Search, Add, Visibility, Edit, LockReset, Delete, PeopleAltOutlined } from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import EmployeeFormDialog from "../components/employees/EmployeeFormDialog";
import EmployeeViewDialog from "../components/employees/EmployeeViewDialog";
import ResetPasswordDialog from "../components/employees/ResetPasswordDialog";
import DeleteConfirmDialog from "../components/medicines/DeleteConfirmDialog";
import employeeService from "../services/employeeService";
import type { Employee, EmployeeFormValues } from "../types/employee.types";

const getInitials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);
  const [resetTarget, setResetTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch {
      setSnackbar({ open: true, message: "Failed to load employees.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, []);

  const summary = useMemo(() => ({
    total: employees.length,
    pharmacists: employees.filter((e) => e.role === "PHARMACIST").length,
    cashiers: employees.filter((e) => e.role === "CASHIER").length,
    active: employees.filter((e) => e.active).length,
  }), [employees]);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch = e.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || e.role === roleFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? e.active : !e.active);
      const matchesShift = shiftFilter === "all" || e.shift === shiftFilter;
      return matchesSearch && matchesRole && matchesStatus && matchesShift;
    });
  }, [employees, search, roleFilter, statusFilter, shiftFilter]);

  const handleSave = async (data: EmployeeFormValues) => {
    try {
      if (editing) {
        await employeeService.update(editing.id, data);
        setSnackbar({ open: true, message: "Employee updated successfully.", severity: "success" });
      } else {
        await employeeService.create(data);
        setSnackbar({ open: true, message: "Employee added successfully.", severity: "success" });
      }
      await loadEmployees();
    } catch (err: any) {
      const message = typeof err?.response?.data === "string" ? err.response.data : "Failed to save employee.";
      setSnackbar({ open: true, message, severity: "error" });
      throw err;
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!resetTarget) return;
    try {
      await employeeService.resetPassword(resetTarget.id, newPassword);
      setSnackbar({ open: true, message: `Password reset for ${resetTarget.fullName}.`, severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to reset password.", severity: "error" });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await employeeService.remove(deleteTarget.id);
      setSnackbar({ open: true, message: "Employee deleted.", severity: "success" });
      setDeleteTarget(null);
      await loadEmployees();
    } catch {
      setSnackbar({ open: true, message: "Failed to delete employee.", severity: "error" });
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PeopleAltOutlined color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Employee Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Add Employee
        </Button>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Total Staff</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.total}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Pharmacists</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.pharmacists}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Cashiers</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.cashiers}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Active</Typography>
            {loading ? <Skeleton width={60} height={32} /> : <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{summary.active}</Typography>}
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            placeholder="Search employee..." size="small" value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
            sx={{ minWidth: 220 }}
          />
          <Select size="small" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="PHARMACIST">Pharmacist</MenuItem>
            <MenuItem value="CASHIER">Cashier</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
          <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
          <Select size="small" value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="all">All Shifts</MenuItem>
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Evening">Evening</MenuItem>
            <MenuItem value="Night">Night</MenuItem>
          </Select>
        </Box>
      </Paper>

      {loading && (
        <Grid container spacing={2.5}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Skeleton variant="rounded" height={180} sx={{ borderRadius: 4 }} /></Grid>
          ))}
        </Grid>
      )}

      {!loading && filtered.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>No employees found.</Typography>
      )}

      {!loading && (
        <Grid container spacing={2.5}>
          {filtered.map((employee) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={employee.id}>
              <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: "#1565C0" }}>{getInitials(employee.fullName)}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{employee.fullName}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#666" }}>{employee.role}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: "#666", mb: 0.5 }}>{employee.email}</Typography>
                  <Typography sx={{ fontSize: 13, color: "#666", mb: 1 }}>{employee.phone || "No phone"}</Typography>
                  <Chip
                    label={employee.active ? "Active" : "Inactive"}
                    size="small"
                    sx={{ bgcolor: employee.active ? "#E8F5E9" : "#FDECEA", color: employee.active ? "#2E7D32" : "#C62828", fontWeight: 600, mb: 1.5 }}
                  />
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="View"><IconButton size="small" onClick={() => setViewing(employee)}><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => { setEditing(employee); setFormOpen(true); }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Reset Password"><IconButton size="small" onClick={() => setResetTarget(employee)}><LockReset fontSize="small" color="warning" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteTarget(employee)}><Delete fontSize="small" color="error" /></IconButton></Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <EmployeeFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editing} />
      <EmployeeViewDialog open={Boolean(viewing)} onClose={() => setViewing(null)} employee={viewing} />
      <ResetPasswordDialog
        open={Boolean(resetTarget)}
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetPassword}
        employeeName={resetTarget?.fullName}
      />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Employee"
        message={`Delete "${deleteTarget?.fullName}"? This cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default Employees;