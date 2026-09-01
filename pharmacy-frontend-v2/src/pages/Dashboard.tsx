import { useEffect, useState } from "react";
import { Grid, Typography, Alert, Box } from "@mui/material";
import {
  MedicationOutlined,
  PeopleAltOutlined,
  LocalShippingOutlined,
  PointOfSaleOutlined,
  CurrencyRupeeOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import DashboardCard from "../components/dashboard/DashboardCard";
import NeedsAttention from "../components/dashboard/NeedsAttention";
import WeeklySalesChart from "../components/dashboard/WeeklySalesChart";
import InventoryDonutChart from "../components/dashboard/InventoryDonutChart";
import RecentPayments from "../components/dashboard/RecentPayments";
//import DashboardSummaryCard from "../components/dashboard/DashboardSummaryCard";
import dashboardService from "../services/dashboardService";
import type { DashboardSummary } from "../types/dashboard.types";
import type { Medicine } from "../types/medicine.types";
import type { Sale } from "../types/sale.types";
import type { Invoice } from "../types/invoice.types";

const formatCurrency = (v: number) => `₹${v.toLocaleString("en-IN")}`;

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [lowStock, setLowStock] = useState<Medicine[]>([]);
  const [expiring, setExpiring] = useState<Medicine[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [s, all, ls, ex, inv] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getAllSales(),
          dashboardService.getLowStockMedicines(),
          dashboardService.getExpiringMedicines(),
          dashboardService.getRecentInvoices(15),
        ]);
        setSummary(s);
        setAllSales(all);
        setLowStock(ls);
        setExpiring(ex);
        setInvoices(inv);
      } catch {
        setError("Could not load dashboard data. Check that the backend is running on port 5050.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <MainLayout>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Pharmacy Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard title="Medicines" value={summary?.totalMedicines ?? 0} icon={MedicationOutlined} color="#1565C0" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard title="Customers" value={summary?.totalCustomers ?? 0} icon={PeopleAltOutlined} color="#2E7D32" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard title="Suppliers" value={summary?.totalSuppliers ?? 0} icon={LocalShippingOutlined} color="#F9A825" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard title="Sales" value={summary?.totalSales ?? 0} icon={PointOfSaleOutlined} color="#6A1B9A" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard title="Revenue" value={summary ? formatCurrency(summary.totalRevenue) : 0} icon={CurrencyRupeeOutlined} color="#00838F" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard title="Invoices" value={summary?.totalInvoices ?? 0} icon={ReceiptLongOutlined} color="#C62828" loading={loading} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <WeeklySalesChart sales={allSales} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <InventoryDonutChart
            totalMedicines={summary?.totalMedicines ?? 0}
            lowStockCount={summary?.lowStockMedicines ?? 0}
            expiringCount={expiring.length}
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <RecentPayments invoices={invoices} loading={loading} />
        </Grid>
       <Grid size={{ xs: 12, lg: 5 }}>
  <NeedsAttention
    lowStock={lowStock}
    expiring={expiring}
    loading={loading}
  />
</Grid>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard;