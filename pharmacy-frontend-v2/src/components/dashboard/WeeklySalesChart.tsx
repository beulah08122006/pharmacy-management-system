import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Sale } from "../../types/sale.types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const buildWeeklyData = (sales: Sale[]) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const totals = new Array(7).fill(0);

  sales.forEach((sale) => {
    const saleDate = new Date(sale.saleDate);
    if (saleDate >= startOfWeek) {
      const dayIndex = saleDate.getDay();
      totals[dayIndex] += sale.totalPrice;
    }
  });

  return DAY_LABELS.map((day, i) => ({
    day,
    amount: Math.round(totals[i]),
    isToday: i === now.getDay(),
  }));
};

const WeeklySalesChart = ({ sales, loading }: { sales: Sale[]; loading: boolean }) => {
  const data = buildWeeklyData(sales);

  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Sales</Typography>
          <Typography sx={{ fontSize: 12, color: "#666", bgcolor: "#F4F6F9", px: 1.5, py: 0.5, borderRadius: 2 }}>
            This week
          </Typography>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={240} />
        ) : (
          <Box sx={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                   formatter={(value) => [`₹${Number(value ?? 0)}`, "Sales"]}
                />                
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.isToday ? "#1565C0" : "#90CAF9"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklySalesChart;