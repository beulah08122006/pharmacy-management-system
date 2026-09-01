import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  totalMedicines: number;
  lowStockCount: number;
  expiringCount: number;
  loading: boolean;
}

const InventoryDonutChart = ({ totalMedicines, lowStockCount, expiringCount, loading }: Props) => {
  const healthyCount = Math.max(totalMedicines - lowStockCount - expiringCount, 0);

  const data = [
    { name: "Healthy stock", value: healthyCount, color: "#1565C0" },
    { name: "Low stock", value: lowStockCount, color: "#F9A825" },
    { name: "Expiring soon", value: expiringCount, color: "#C62828" },
  ];

  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Inventory</Typography>

        {loading ? (
          <Skeleton variant="circular" width={160} height={160} sx={{ mx: "auto" }} />
        ) : (
          <>
            <Box sx={{ width: "100%", height: 180 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {data.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 1 }}>
              {data.map((item) => (
                <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                  <Typography sx={{ fontSize: 12, color: "#666" }}>{item.name}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, ml: "auto" }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryDonutChart;