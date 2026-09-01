import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { Business, Person, Lock, Notifications, Palette, Info } from "@mui/icons-material";

export type SettingsTab = "pharmacy" | "account" | "security" | "notifications" | "appearance" | "about";

const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "pharmacy", label: "Pharmacy Information", icon: <Business /> },
  { key: "account", label: "Account", icon: <Person /> },
  { key: "security", label: "Security", icon: <Lock /> },
  { key: "notifications", label: "Notifications", icon: <Notifications /> },
  { key: "appearance", label: "Appearance", icon: <Palette /> },
  { key: "about", label: "About", icon: <Info /> },
];

const SettingsSidebar = ({ active, onSelect }: { active: SettingsTab; onSelect: (tab: SettingsTab) => void }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <List>
        {tabs.map((tab) => (
          <ListItemButton
            key={tab.key}
            selected={active === tab.key}
            onClick={() => onSelect(tab.key)}
            sx={{
              "&.Mui-selected": { bgcolor: "#E3F2FD", borderRight: "3px solid #1565C0" },
              "&.Mui-selected:hover": { bgcolor: "#E3F2FD" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: active === tab.key ? "#1565C0" : "inherit" }}>{tab.icon}</ListItemIcon>
            <ListItemText primary={tab.label} slotProps={{ primary: { sx: { fontSize: 14, fontWeight: active === tab.key ? 700 : 500 } } }} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default SettingsSidebar;