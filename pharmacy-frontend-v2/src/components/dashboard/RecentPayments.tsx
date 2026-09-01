import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Skeleton,
  Avatar,
  Box,
} from "@mui/material";
import type { Invoice } from "../../types/invoice.types";

const formatCurrency = (v: number) => `₹${v.toLocaleString("en-IN")}`;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const getInitials = (name: string) =>
  name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const RecentPayments = ({ invoices, loading }: { invoices: Invoice[]; loading: boolean }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Payments</Typography>

        {loading && <Skeleton height={180} />}

        {!loading && invoices.length === 0 && (
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>No payments yet.</Typography>
        )}

        {!loading && invoices.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Invoice No.</b></TableCell>
                <TableCell><b>Customer</b></TableCell>
                <TableCell><b>Medicine</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell align="right"><b>Amount</b></TableCell>
                <TableCell align="right"><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 26, height: 26, bgcolor: "#1565C0", fontSize: 11 }}>
                        {getInitials(invoice.customer?.customerName ?? "?")}
                      </Avatar>
                      {invoice.customer?.customerName ?? "—"}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#666" }}>
                    {invoice.sale?.medicine?.medicineName ?? "—"}
                  </TableCell>
                  <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                  <TableCell align="right">{formatCurrency(invoice.totalAmount)}</TableCell>
                  <TableCell align="right">
                    <Chip label="Paid" color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPayments;