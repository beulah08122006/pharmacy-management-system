import { Card, CardContent, Typography, Box } from "@mui/material";
import { WarningAmberOutlined } from "@mui/icons-material";
import type { InventoryItem } from "../../types/inventory.types";

const isExpiringSoon = (iso?: string, days = 30) => {
  if (!iso) return false;
  const diff = (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
};

const isExpiringToday = (iso?: string) => {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
};

const InventoryAlertsPanel = ({ items }: { items: InventoryItem[] }) => {
  const lowStockCount = items.filter((i) => i.quantity > 0 && i.quantity <= i.minimumStock).length;
  const outOfStockCount = items.filter((i) => i.quantity === 0).length;
  const expiringSoonCount = items.filter((i) => isExpiringSoon(i.medicine?.expiryDate)).length;
  const expiringTodayCount = items.filter((i) => isExpiringToday(i.medicine?.expiryDate)).length;

  const alerts = [
    lowStockCount > 0 && `${lowStockCount} medicine${lowStockCount > 1 ? "s" : ""} below minimum stock`,
    outOfStockCount > 0 && `${outOfStockCount} medicine${outOfStockCount > 1 ? "s are" : " is"} out of stock`,
    expiringSoonCount > 0 && `${expiringSoonCount} medicine${expiringSoonCount > 1 ? "s" : ""} expire within 30 days`,
    expiringTodayCount > 0 && `${expiringTodayCount} batch${expiringTodayCount > 1 ? "es" : ""} expire today`,
  ].filter(Boolean) as string[];

  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", bgcolor: "#FFF8E1" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <WarningAmberOutlined sx={{ color: "#B26A00" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#B26A00" }}>Inventory Alerts</Typography>
        </Box>

        {alerts.length === 0 && (
          <Typography sx={{ fontSize: 14, color: "#666" }}>No alerts right now — everything looks healthy.</Typography>
        )}

        {alerts.map((alert, i) => (
          <Typography key={i} sx={{ fontSize: 13, color: "#B26A00", mb: 0.5 }}>
            • {alert}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default InventoryAlertsPanel;