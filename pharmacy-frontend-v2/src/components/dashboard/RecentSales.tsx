/*import { Card, CardContent, Typography, Box, Avatar, Skeleton } from "@mui/material";
import type { Sale } from "../../types/sale.types";

const formatCurrency = (v: number) => `₹${v.toLocaleString("en-IN")}`;

const getInitials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const RecentSales = ({ sales, loading }: { sales: Sale[]; loading: boolean }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Sales</Typography>
        {loading && <Skeleton height={120} />}
        {!loading && sales.length === 0 && (
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>No sales yet.</Typography>
        )}
        {!loading && sales.map((sale, i) => (
          <Box key={sale.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.2, borderBottom: i < sales.length - 1 ? "1px solid #EDF1F5" : "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: "#1565C0", fontSize: 12 }}>
                {getInitials(sale.customer?.customerName ?? "?")}
              </Avatar>
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{sale.customer?.customerName ?? "—"}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: "#666" }}>{sale.medicine?.medicineName ?? "—"}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(sale.totalPrice)}</Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentSales;*/