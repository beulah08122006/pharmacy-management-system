import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, Alert } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string) => Promise<void>;
  employeeName?: string;
}

const ResetPasswordDialog = ({ open, onClose, onConfirm, employeeName }: Props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setSaving(true);
    try {
      await onConfirm(password);
      setPassword("");
      setError(null);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Reset Password{employeeName ? ` — ${employeeName}` : ""}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          fullWidth type="password" label="New Password" value={password}
          onChange={(e) => setPassword(e.target.value)} sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm} disabled={saving}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Reset Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;