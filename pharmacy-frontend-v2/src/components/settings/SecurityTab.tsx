import { useState } from "react";
import { Box, Typography, TextField, Button, FormControlLabel, Switch, Snackbar, Alert, CircularProgress, Divider } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import employeeService from "../../services/employeeService";

const SecurityTab = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requireLogin, setRequireLogin] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const handleChangePassword = async () => {
    if (!user) return;
    if (newPassword.length < 4) {
      setSnackbar({ open: true, message: "New password must be at least 4 characters.", severity: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSnackbar({ open: true, message: "New password and confirmation do not match.", severity: "error" });
      return;
    }
    setSaving(true);
    try {
      await employeeService.changePassword(user.id, currentPassword, newPassword);
      setSnackbar({ open: true, message: "Password changed successfully.", severity: "success" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      const message = typeof err?.response?.data === "string" ? err.response.data : "Failed to change password.";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Security</Typography>

      <TextField fullWidth type="password" label="Current Password" value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth type="password" label="New Password" value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth type="password" label="Confirm Password" value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)} sx={{ mb: 2 }} />

      <Button variant="contained" onClick={handleChangePassword} disabled={saving}>
        {saving ? <CircularProgress size={20} color="inherit" /> : "Change Password"}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography sx={{ fontSize: 13, color: "#666", mb: 1 }}>
        The two toggles below are session-behavior preferences saved on this device only — they aren't enforced by the backend yet.
      </Typography>
      <FormControlLabel control={<Switch checked={requireLogin} onChange={(e) => setRequireLogin(e.target.checked)} />} label="Require Login" />
      <br />
      <FormControlLabel control={<Switch checked={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.checked)} />} label="Session Timeout" />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SecurityTab;