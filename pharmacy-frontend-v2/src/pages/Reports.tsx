import { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, Paper, Grid, Button, Table, TableHead, TableBody, TableRow, TableCell,
Chip, Skeleton, Tooltip,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChartOutlined, PictureAsPdf, GridOn, InfoOutlined } from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import salesService from "../services/salesService";
import inventoryService from "../services/inventoryService";
import type { Sale } from "../types/sale.types";
import type { InventoryItem } from "../types/inventory.types";

const ASSUMED_MARGIN = 0.2; // 20% — no real cost-price data exists, this is an estimate only
const COLORS = ["#1565C0", "#2E7D32", "#F9A825", "#6A1B9A", "#00838F", "#C62828"];

const formatCurrency = (v: number) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const isSameMonth = (a: Date, b: Date) => a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const getInventoryStatus = (item: InventoryItem) => {
  if (item.quantity === 0) return { label: "Out of Stock", bg: "#FDECEA", fg: "#C62828" };
  if (item.quantity <= item.minimumStock) return { label: "Low Stock", bg: "#FFF8E1", fg: "#B26A00" };
  return { label: "In Stock", bg: "#E8F5E9", fg: "#2E7D32" };
};

const Reports = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([salesService.getAll(), inventoryService.getAll()])
      .then(([s, inv]) => { setSales(s); setInventory(inv); })
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();

  const revenueToday = useMemo(
    () => sales.filter((s) => isSameDay(new Date(s.saleDate), now)).reduce((sum, s) => sum + s.totalPrice, 0),
    [sales]
  );

  const revenueThisMonth = useMemo(
    () => sales.filter((s) => isSameMonth(new Date(s.saleDate), now)).reduce((sum, s) => sum + s.totalPrice, 0),
    [sales]
  );

  const medicinesSoldThisMonth = useMemo(
    () => sales.filter((s) => isSameMonth(new Date(s.saleDate), now)).reduce((sum, s) => sum + s.quantity, 0),
    [sales]
  );

  const estimatedProfit = revenueThisMonth * ASSUMED_MARGIN;

  const monthlySalesData = useMemo(() => {
    const months: { label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-IN", { month: "short" });
      const total = sales
        .filter((s) => {
          const sd = new Date(s.saleDate);
          return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
        })
        .reduce((sum, s) => sum + s.totalPrice, 0);
      months.push({ label, total: Math.round(total) });
    }
    return months;
  }, [sales]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    sales.forEach((s) => {
      const cat = s.medicine?.category ?? "Uncategorized";
      map.set(cat, (map.get(cat) ?? 0) + s.totalPrice);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [sales]);

  const topMedicines = useMemo(() => {
    const map = new Map<string, number>();
    sales.forEach((s) => {
      const name = s.medicine?.medicineName ?? "Unknown";
      map.set(name, (map.get(name) ?? 0) + s.quantity);
    });
    return Array.from(map.entries())
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [sales]);

  const lowStockItems = useMemo(
    () => inventory.filter((i) => i.quantity <= i.minimumStock),
    [inventory]
  );

  const handleExportCsv = () => {
    const rows = [
      ["Medicine", "Category", "Quantity Sold", "Revenue"],
      ...sales.map((s) => [s.medicine?.medicineName ?? "", s.medicine?.category ?? "", String(s.quantity), s.totalPrice.toFixed(2)]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BarChartOutlined color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Reports</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<GridOn />} onClick={handleExportCsv}>Export Excel</Button>
          <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={handleExportPdf}>Export PDF</Button>
        </Box>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Revenue Today</Typography>
            {loading ? <Skeleton width={80} height={32} /> : <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(revenueToday)}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Revenue This Month</Typography>
            {loading ? <Skeleton width={80} height={32} /> : <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(revenueThisMonth)}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontSize: 13, color: "#666" }}>Medicines Sold (Month)</Typography>
            {loading ? <Skeleton width={80} height={32} /> : <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{medicinesSoldThisMonth}</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: 13, color: "#666" }}>Estimated Profit</Typography>
              <Tooltip title="No cost-price data exists in the database — this assumes a flat 20% margin on revenue and is an estimate, not an actual figure.">
                <InfoOutlined sx={{ fontSize: 14, color: "#999" }} />
              </Tooltip>
            </Box>
            {loading ? <Skeleton width={80} height={32} /> : <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(estimatedProfit)}</Typography>}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", height: "100%" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Monthly Sales</Typography>
            <Box sx={{ width: "100%", height: 260 }}>
              {loading ? <Skeleton variant="rectangular" width="100%" height="100%" /> : (
                <ResponsiveContainer>
                  <BarChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <ChartTooltip
                    formatter={(v) => [`₹${Number(v ?? 0)}`, "Revenue"]}
                    />                    
                    <Bar dataKey="total" fill="#1565C0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", height: "100%" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Category Wise Sales</Typography>
            <Box sx={{ width: "100%", height: 220 }}>
              {loading ? <Skeleton variant="circular" width={160} height={160} sx={{ mx: "auto" }} /> : (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip
                      formatter={(v) => `₹${Number(v ?? 0)}`}
                    />                  
                    </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Top Selling Medicines</Typography>
            <Table size="small">
              <TableHead>
                <TableRow><TableCell><b>Medicine</b></TableCell><TableCell align="right"><b>Units Sold</b></TableCell></TableRow>
              </TableHead>
              <TableBody>
                {loading && Array.from({ length: 3 }).map((_, i) => <TableRow key={i}><TableCell colSpan={2}><Skeleton /></TableCell></TableRow>)}
                {!loading && topMedicines.length === 0 && <TableRow><TableCell colSpan={2}><Typography color="text.secondary" sx={{ py: 2 }}>No sales data yet.</Typography></TableCell></TableRow>}
                {!loading && topMedicines.map((m) => (
                  <TableRow key={m.name}><TableCell>{m.name}</TableCell><TableCell align="right">{m.qty}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #EEE" }}>
              <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Quick Summary</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography sx={{ fontSize: 14, color: "#666" }}>Total Medicines Tracked</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{topMedicines.length}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography sx={{ fontSize: 14, color: "#666" }}>Best Seller</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{topMedicines[0]?.name ?? "—"}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography sx={{ fontSize: 14, color: "#666" }}>Total Units Sold (Top 5)</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{topMedicines.reduce((sum, m) => sum + m.qty, 0)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography sx={{ fontSize: 14, color: "#666" }}>Revenue This Month</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{formatCurrency(revenueThisMonth)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography sx={{ fontSize: 14, color: "#666" }}>Low Stock Items</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#B26A00" }}>{lowStockItems.length}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography sx={{ fontSize: 14, color: "#666" }}>Out of Stock Items</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#C62828" }}>{lowStockItems.filter(i => i.quantity === 0).length}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Low Stock Report</Typography>
            <Table size="small">
              <TableHead>
                <TableRow><TableCell><b>Medicine</b></TableCell><TableCell align="right"><b>Qty</b></TableCell><TableCell><b>Status</b></TableCell></TableRow>
              </TableHead>
              <TableBody>
                {loading && Array.from({ length: 3 }).map((_, i) => <TableRow key={i}><TableCell colSpan={3}><Skeleton /></TableCell></TableRow>)}
                {!loading && lowStockItems.length === 0 && <TableRow><TableCell colSpan={3}><Typography color="text.secondary" sx={{ py: 2 }}>Everything is sufficiently stocked.</Typography></TableCell></TableRow>}
                {!loading && lowStockItems.map((item) => {
                  const status = getInventoryStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.medicine?.medicineName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell><Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.fg, fontWeight: 600 }} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Reports;