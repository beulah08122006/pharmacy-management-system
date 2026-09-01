import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar, Chip, Divider, Grid } from "@mui/material";
import type { Employee } from "../../types/employee.types";

const getInitials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const EmployeeViewDialog = ({ open, onClose, employee }: { open: boolean; onClose: () => void; employee: Employee | null }) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Employee Information</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "#1565C0", fontSize: 22 }}>{getInitials(employee.fullName)}</Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{employee.fullName}</Typography>
            <Chip
              label={employee.role}
              size="small"
              sx={{ bgcolor: "#E3F2FD", color: "#1565C0", fontWeight: 600, mt: 0.5 }}
            />
            <Chip
              label={employee.active ? "Active" : "Inactive"}
              size="small"
              sx={{ ml: 1, bgcolor: employee.active ? "#E8F5E9" : "#FDECEA", color: employee.active ? "#2E7D32" : "#C62828", fontWeight: 600, mt: 0.5 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Employee ID</Typography><Typography sx={{ fontWeight: 600 }}>#{employee.id}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Email</Typography><Typography sx={{ fontWeight: 600 }}>{employee.email}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Phone</Typography><Typography sx={{ fontWeight: 600 }}>{employee.phone || "—"}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Joining Date</Typography><Typography sx={{ fontWeight: 600 }}>{formatDate(employee.createdAt)}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Shift</Typography><Typography sx={{ fontWeight: 600 }}>{employee.shift || "—"}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Salary</Typography><Typography sx={{ fontWeight: 600 }}>{employee.salary ? `₹${employee.salary.toLocaleString("en-IN")}` : "—"}</Typography></Grid>
          <Grid size={{ xs: 12 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Address</Typography><Typography sx={{ fontWeight: 600 }}>{employee.address || "—"}</Typography></Grid>
          <Grid size={{ xs: 12 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Emergency Contact</Typography><Typography sx={{ fontWeight: 600 }}>{employee.emergencyContact || "—"}</Typography></Grid>
          <Grid size={{ xs: 12 }}><Typography sx={{ fontSize: 13, color: "#666" }}>Notes</Typography><Typography sx={{ fontWeight: 600 }}>{employee.notes || "—"}</Typography></Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;