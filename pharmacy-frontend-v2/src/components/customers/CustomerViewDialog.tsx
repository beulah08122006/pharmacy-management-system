import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar, Table, TableHead, TableBody, TableRow, TableCell, Divider } from "@mui/material";
import type { Customer } from "../../types/customer.types";
import type { Invoice } from "../../types/invoice.types";

const formatCurrency = (v: number) => `₹${v.toLocaleString("en-IN")}`;
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const getInitials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

interface Props {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  invoices: Invoice[];
}

const CustomerViewDialog = ({ open, onClose, customer, invoices }: Props) => {
  if (!customer) return null;

  const customerInvoices = invoices
    .filter((inv) => inv.customer?.id === customer.id)
    .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());

  const totalPurchases = customerInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalVisits = customerInvoices.length;
  const lastPurchase = customerInvoices[0]?.invoiceDate;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Customer Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "#1565C0", fontSize: 20 }}>
            {getInitials(customer.customerName)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{customer.customerName}</Typography>
            <Typography sx={{ fontSize: 13, color: "#666" }}>{customer.email}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 2 }}>
          <Typography sx={{ fontSize: 13, color: "#666" }}>Phone: <b style={{ color: "#000" }}>{customer.phone}</b></Typography>
          <Typography sx={{ fontSize: 13, color: "#666" }}>Address: <b style={{ color: "#000" }}>{customer.address}</b></Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ fontWeight: 700, mb: 1 }}>Purchase History</Typography>
        {customerInvoices.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: "#666" }}>No purchases recorded yet.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Invoice</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell align="right"><b>Amount</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(inv.invoiceDate)}</TableCell>
                  <TableCell align="right">{formatCurrency(inv.totalAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 13 }}>Total Purchases: <b>{formatCurrency(totalPurchases)}</b></Typography>
          <Typography sx={{ fontSize: 13 }}>Total Visits: <b>{totalVisits}</b></Typography>
          <Typography sx={{ fontSize: 13 }}>Last Purchase: <b>{lastPurchase ? formatDate(lastPurchase) : "—"}</b></Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerViewDialog;