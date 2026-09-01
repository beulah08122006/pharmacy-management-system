import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Badge, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { NotificationsNoneOutlined, LogoutOutlined } from "@mui/icons-material";
import { useState, type MouseEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { SIDEBAR_WIDTH } from "./Sidebar";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/medicines": "Medicines",
  "/inventory": "Inventory",
  "/sales": "Sales",
  "/customers": "Customers",
  "/suppliers": "Suppliers",
  "/billing": "Billing",
  "/employees": "Employees",
  "/reports": "Reports",
  "/settings": "Settings",
};

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentTitle = routeTitles[location.pathname] || "PharmaCare";

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.fullName?.slice(0, 2).toUpperCase() ?? "PH";

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        bgcolor: "#fff",
        color: "#000",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {currentTitle}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton>
            <Badge color="error" variant="dot">
              <NotificationsNoneOutlined />
            </Badge>
          </IconButton>
          <IconButton onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#1565C0", fontSize: 13 }}>
              {initials}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutOutlined fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;