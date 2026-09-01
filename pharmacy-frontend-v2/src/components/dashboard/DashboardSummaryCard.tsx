import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Skeleton,
} from "@mui/material";

import {
  CurrencyRupeeOutlined,
  PeopleAltOutlined,
  MedicationOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";

import type { DashboardSummary } from "../../types/dashboard.types";

type Props = {
  summary: DashboardSummary | null;
  loading: boolean;
};

const SummaryItem = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: "#fafafa",
      border: "1px solid #eeeeee",
      height: "100%",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 1,
      }}
    >
      <Box sx={{ color }}>{icon}</Box>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
    </Box>

    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const DashboardSummary = ({ summary, loading }: Props) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Dashboard Summary
        </Typography>

        {loading ? (
          <Skeleton height={180} />
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <SummaryItem
                icon={<CurrencyRupeeOutlined />}
                title="Revenue"
                value={`₹${summary?.totalRevenue?.toLocaleString("en-IN") ?? 0}`}
                color="#00838F"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <SummaryItem
                icon={<PeopleAltOutlined />}
                title="Customers"
                value={summary?.totalCustomers ?? 0}
                color="#2E7D32"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <SummaryItem
                icon={<MedicationOutlined />}
                title="Medicines"
                value={summary?.totalMedicines ?? 0}
                color="#1565C0"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <SummaryItem
                icon={<ReceiptLongOutlined />}
                title="Invoices"
                value={summary?.totalInvoices ?? 0}
                color="#C62828"
              />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;