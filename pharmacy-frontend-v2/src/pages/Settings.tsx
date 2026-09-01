import { useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { SettingsOutlined } from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import SettingsSidebar, { type SettingsTab } from "../components/settings/SettingsSidebar";
import PharmacyInfoTab from "../components/settings/PharmacyInfoTab";
import AccountTab from "../components/settings/AccountTab";
import SecurityTab from "../components/settings/SecurityTab";
import NotificationsTab from "../components/settings/NotificationsTab";
import AppearanceTab from "../components/settings/AppearanceTab";
import AboutTab from "../components/settings/AboutTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("pharmacy");

  return (
    <MainLayout>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <SettingsOutlined color="primary" fontSize="large" />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Settings</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <SettingsSidebar active={activeTab} onSelect={setActiveTab} />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            {activeTab === "pharmacy" && <PharmacyInfoTab />}
            {activeTab === "account" && <AccountTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "appearance" && <AppearanceTab />}
            {activeTab === "about" && <AboutTab />}
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Settings;