import { useEffect, useState } from "react";
import { Box, Typography, FormControlLabel, Switch, Alert } from "@mui/material";

interface NotificationPrefs {
  lowStock: boolean;
  expiry: boolean;
  dailySummary: boolean;
  email: boolean;
  desktop: boolean;
}

const defaultPrefs: NotificationPrefs = {
  lowStock: true, expiry: true, dailySummary: false, email: false, desktop: true,
};

const STORAGE_KEY = "notificationPrefs";

const NotificationsTab = () => {
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPrefs(JSON.parse(stored));
  }, []);

  const update = (key: keyof NotificationPrefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Notifications</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        These preferences are saved on this browser only — they don't sync across devices and don't yet trigger real emails or push notifications.
      </Alert>
      <FormControlLabel control={<Switch checked={prefs.lowStock} onChange={(e) => update("lowStock", e.target.checked)} />} label="Low Stock Alerts" />
      <br />
      <FormControlLabel control={<Switch checked={prefs.expiry} onChange={(e) => update("expiry", e.target.checked)} />} label="Expiry Alerts" />
      <br />
      <FormControlLabel control={<Switch checked={prefs.dailySummary} onChange={(e) => update("dailySummary", e.target.checked)} />} label="Daily Sales Summary" />
      <br />
      <FormControlLabel control={<Switch checked={prefs.email} onChange={(e) => update("email", e.target.checked)} />} label="Email Notifications" />
      <br />
      <FormControlLabel control={<Switch checked={prefs.desktop} onChange={(e) => update("desktop", e.target.checked)} />} label="Desktop Notifications" />
    </Box>
  );
};

export default NotificationsTab;