import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Toolbar,
} from "@mui/material";
import {
  DashboardOutlined,
  MedicationOutlined,
  PeopleAltOutlined,
  LocalShippingOutlined,
  Inventory2Outlined,
  PointOfSaleOutlined,
  ReceiptLongOutlined,
  BarChartOutlined,
  LocalPharmacyRounded,
  AssessmentRounded,
  SettingsRounded,
  LogoutRounded,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

export const SIDEBAR_WIDTH = 260;

const navItems = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardOutlined /> },
  { text: "Medicines", path: "/medicines", icon: <MedicationOutlined /> },
  { text: "Inventory", path: "/inventory", icon: <Inventory2Outlined /> },
  { text: "Sales", path: "/sales", icon: <PointOfSaleOutlined /> },
  { text: "Customers", path: "/customers", icon: <PeopleAltOutlined /> },
  { text: "Suppliers", path: "/suppliers", icon: <LocalShippingOutlined /> },
  { text: "Billing", path: "/billing", icon: <ReceiptLongOutlined /> },
  { text: "Employees", path: "/employees", icon: <PeopleAltOutlined /> },
  { text: "Reports", path: "/reports", icon: <AssessmentRounded /> },
  { text: "Settings", path: "/settings", icon: <SettingsRounded /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          bgcolor: "#1565C0",
          color: "#fff",
          border: "none",
        },
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <LocalPharmacyRounded />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          PharmaCare
        </Typography>
      </Toolbar>

      <List sx={{ px: 1.5, mt: 1, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": { bgcolor: "#0D47A1" },
                "&.Mui-selected:hover": { bgcolor: "#0D47A1" },
                "&:hover": { bgcolor: "#1976D2" },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <List sx={{ px: 1.5, mb: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            "&:hover": { bgcolor: "#1976D2" },
          }}
        >
          <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
            <LogoutRounded />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;