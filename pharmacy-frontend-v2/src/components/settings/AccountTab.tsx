import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Grid, Avatar, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import employeeService from "../../services/employeeService";

const getInitials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const AccountTab = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await employeeService.update(user.id, {
        fullName,
        email: user.email,
        role: user.role as any,
        active: true,
        phone,
        address: "",
        salary: 0,
        shift: "",
        emergencyContact: "",
        notes: "",
      });
      setSnackbar({ open: true, message: "Profile updated successfully.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update profile.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Account</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: "#1565C0", fontSize: 22 }}>{getInitials(user.fullName)}</Avatar>
        <Typography sx={{ fontSize: 13, color: "#666" }}>Profile photo upload isn't wired to storage yet — avatar shows your initials.</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Email" value={user.email} disabled />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Role" value={user.role} disabled />
        </Grid>
      </Grid>

      <Button variant="contained" onClick={handleUpdate} disabled={saving} sx={{ mt: 3 }}>
        {saving ? <CircularProgress size={20} color="inherit" /> : "Update Profile"}
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountTab;