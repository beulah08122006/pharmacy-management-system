import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import type { StockMovement } from "../../types/stockMovement.types";
import type { InventoryItem } from "../../types/inventory.types";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const StockMovementLog = ({ movements, items, loading }: { movements: StockMovement[]; items: InventoryItem[]; loading: boolean }) => {
  const getMedicineName = (medicineId: number) =>
    items.find((i) => i.medicine.id === medicineId)?.medicine.medicineName ?? `Medicine #${medicineId}`;

  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Stock Movement</Typography>

        {loading && <Skeleton height={120} />}
        {!loading && movements.length === 0 && (
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>No recent stock movement.</Typography>
        )}

        {!loading && movements.map((m, i) => {
          const positive = m.changeAmount > 0;
          return (
            <Box
              key={m.id}
              sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                py: 1.2, borderBottom: i < movements.length - 1 ? "1px solid #EDF1F5" : "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {positive ? (
                  <ArrowUpward sx={{ fontSize: 16, color: "#2E7D32" }} />
                ) : (
                  <ArrowDownward sx={{ fontSize: 16, color: "#C62828" }} />
                )}
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: positive ? "#2E7D32" : "#C62828" }}>
                  {positive ? "+" : ""}{m.changeAmount}
                </Typography>
                <Typography sx={{ fontSize: 13 }}>{getMedicineName(m.medicineId)}</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: 12, color: "#666" }}>{m.reason}</Typography>
                <Typography sx={{ fontSize: 11, color: "#999" }}>{formatTime(m.movedAt)}</Typography>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default StockMovementLog;