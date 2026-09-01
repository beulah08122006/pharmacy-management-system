import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Autocomplete,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";

import {
  Add,
  Delete,
  ReceiptLongOutlined,
  QrCode2Outlined,
  CreditCardOutlined,
  PaymentsOutlined,
  CheckCircleOutlined,
} from "@mui/icons-material";

import MainLayout from "../components/layout/MainLayout";
import customerService from "../services/customerService";
import medicineService from "../services/medicineService";
import orderService from "../services/orderService";

import type { Customer } from "../types/customer.types";
import type { Medicine } from "../types/medicine.types";
import type { Order } from "../types/order.types";

interface CartLine {
  medicine: Medicine;
  quantity: number;
}

type PaymentMode = "Cash" | "UPI" | "Card";

const formatCurrency = (v: number) => `₹${v.toFixed(2)}`;

const Billing = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [medicineSearch, setMedicineSearch] =
    useState<Medicine | null>(null);

  const [medicineQty, setMedicineQty] = useState<number>(1);

  const [cart, setCart] = useState<CartLine[]>([]);

  const [discount, setDiscount] = useState<number>(0);
  const [gst, setGst] = useState<number>(0);

  const [paymentMode, setPaymentMode] =
    useState<PaymentMode>("Cash");

  const [paymentDialog, setPaymentDialog] = useState(false);

  const [paymentCompleted, setPaymentCompleted] =
    useState(false);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [completedOrder, setCompletedOrder] =
    useState<Order | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  /*
   * Load customers and medicines
   */
  useEffect(() => {
    Promise.all([
      customerService.getAll(),
      medicineService.getAll(),
    ])
      .then(([customersData, medicinesData]) => {
        setCustomers(customersData);
        setMedicines(medicinesData);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to load customers/medicines.",
          severity: "error",
        });
      });
  }, []);

  /*
   * Calculate subtotal
   */
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, line) =>
          sum + line.medicine.price * line.quantity,
        0
      ),
    [cart]
  );

  /*
   * Calculate final amount
   */
  const grandTotal = Math.max(
    subtotal - discount + gst,
    0
  );

  /*
   * Add medicine to cart
   */
  const handleAddToCart = () => {
    if (!medicineSearch || medicineQty <= 0) {
      setSnackbar({
        open: true,
        message:
          "Please select a medicine and enter a valid quantity.",
        severity: "error",
      });
      return;
    }

    if (medicineQty > medicineSearch.quantity) {
      setSnackbar({
        open: true,
        message: `Only ${medicineSearch.quantity} units available.`,
        severity: "error",
      });
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (line) =>
          line.medicine.id === medicineSearch.id
      );

      if (existing) {
        const newQuantity =
          existing.quantity + medicineQty;

        if (newQuantity > medicineSearch.quantity) {
          return prev;
        }

        return prev.map((line) =>
          line.medicine.id === medicineSearch.id
            ? {
                ...line,
                quantity: newQuantity,
              }
            : line
        );
      }

      return [
        ...prev,
        {
          medicine: medicineSearch,
          quantity: medicineQty,
        },
      ];
    });

    setMedicineSearch(null);
    setMedicineQty(1);
  };

  /*
   * Remove medicine from cart
   */
  const handleRemoveLine = (medicineId: number) => {
    setCart((prev) =>
      prev.filter(
        (line) =>
          line.medicine.id !== medicineId
      )
    );
  };

  /*
   * Cancel current bill
   */
  const handleCancel = () => {
    setCart([]);
    setDiscount(0);
    setGst(0);
    setPaymentMode("Cash");
    setSelectedCustomer(null);
    setMedicineSearch(null);
    setMedicineQty(1);
    setPaymentCompleted(false);
    setPaymentDialog(false);
  };

  /*
   * STRIPE PAYMENT
   *
   * Calls Spring Boot backend:
   *
   * POST
   * http://localhost:5050/api/payments/create-checkout-session
   *
   * Expected backend response:
   *
   * {
   *   "url": "https://checkout.stripe.com/..."
   * }
   */
  const handleStripePayment = async () => {
    if (grandTotal <= 0) {
      setSnackbar({
        open: true,
        message: "Payment amount must be greater than ₹0.",
        severity: "error",
      });
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5050/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(grandTotal * 100),
            currency: "inr",
            customerId: selectedCustomer?.id ?? null,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Unable to start Stripe payment.";

        try {
          const errorData = await response.json();

          if (typeof errorData?.message === "string") {
            errorMessage = errorData.message;
          }
        } catch {
          // Ignore JSON parsing errors.
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data?.url) {
        throw new Error(
          "Stripe Checkout URL was not returned by the server."
        );
      }

      /*
       * Redirect customer to Stripe Checkout.
       */
      window.location.href = data.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start Stripe payment.";

      setPaymentLoading(false);

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    }
  };

  /*
   * Confirm payment
   */
  const handlePayment = () => {
    if (paymentMode === "Card") {
      handleStripePayment();
      return;
    }

    /*
     * Cash and UPI are confirmed locally.
     *
     * Stripe Card payment is handled by
     * handleStripePayment().
     */
    setPaymentCompleted(true);
    setPaymentDialog(false);

    setSnackbar({
      open: true,
      message: `${paymentMode} payment confirmed.`,
      severity: "success",
    });
  };

  /*
   * Complete sale
   */
  const handleCompleteSale = async () => {
    if (!selectedCustomer) {
      setSnackbar({
        open: true,
        message: "Please select a customer.",
        severity: "error",
      });
      return;
    }

    if (cart.length === 0) {
      setSnackbar({
        open: true,
        message: "Cart is empty.",
        severity: "error",
      });
      return;
    }

    /*
     * Ask for payment before creating the order.
     */
    if (!paymentCompleted) {
      setPaymentDialog(true);
      return;
    }

    try {
      const order = await orderService.create({
        customerId: selectedCustomer.id,

        items: cart.map((line) => ({
          medicineId: line.medicine.id,
          quantity: line.quantity,
        })),

        discount,
        gst,
        paymentMode,
      });

      setCompletedOrder(order);

      setSnackbar({
        open: true,
        message: `Sale completed — ${order.orderNumber}`,
        severity: "success",
      });

      /*
       * Reset billing form.
       */
      setCart([]);
      setDiscount(0);
      setGst(0);
      setPaymentCompleted(false);
      setPaymentDialog(false);

      /*
       * Refresh medicine stock.
       */
      const refreshedMedicines =
        await medicineService.getAll();

      setMedicines(refreshedMedicines);
    } catch (err: any) {
      const message =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message ||
            "Failed to complete sale.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    }
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ReceiptLongOutlined
            color="primary"
            fontSize="large"
          />

          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            Billing
          </Typography>
        </Box>

        {completedOrder && (
          <Typography
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Last Invoice:{" "}
            {completedOrder.orderNumber}
          </Typography>
        )}
      </Box>

      {/* CUSTOMER + MEDICINE */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* CUSTOMER */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Customer Details
            </Typography>

            <Autocomplete
              options={customers}
              getOptionLabel={(customer) =>
                customer.customerName
              }
              value={selectedCustomer}
              onChange={(_, value) =>
                setSelectedCustomer(value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Customer"
                />
              )}
            />

            {selectedCustomer && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#666",
                  }}
                >
                  Phone:{" "}
                  {selectedCustomer.phone}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#666",
                  }}
                >
                  Email:{" "}
                  {selectedCustomer.email}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* MEDICINE SEARCH */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Search Medicine
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Autocomplete
                sx={{ flex: 1 }}
                options={medicines}
                getOptionLabel={(medicine) =>
                  `${medicine.medicineName} (${medicine.quantity} in stock, ₹${medicine.price})`
                }
                value={medicineSearch}
                onChange={(_, value) =>
                  setMedicineSearch(value)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search medicine..."
                  />
                )}
              />

              <TextField
                type="number"
                label="Qty"
                value={medicineQty}
                onChange={(e) =>
                  setMedicineQty(
                    Number(e.target.value)
                  )
                }
                sx={{ width: 90 }}
                inputProps={{
                  min: 1,
                }}
              />

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddToCart}
              >
                Add
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* CURRENT BILL */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.06)",
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2.5, pb: 1 }}>
          <Typography
            sx={{ fontWeight: 700 }}
          >
            Current Bill
          </Typography>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F4F6F9" }}>
              <TableCell>
                <b>Medicine</b>
              </TableCell>

              <TableCell align="right">
                <b>Qty</b>
              </TableCell>

              <TableCell align="right">
                <b>Unit Price</b>
              </TableCell>

              <TableCell align="right">
                <b>Total</b>
              </TableCell>

              <TableCell align="right">
                <b>Remove</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cart.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    No items added yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {cart.map((line) => (
              <TableRow
                key={line.medicine.id}
                hover
              >
                <TableCell
                  sx={{ fontWeight: 600 }}
                >
                  {line.medicine.medicineName}
                </TableCell>

                <TableCell align="right">
                  {line.quantity}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    line.medicine.price
                  )}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ fontWeight: 700 }}
                >
                  {formatCurrency(
                    line.medicine.price *
                      line.quantity
                  )}
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleRemoveLine(
                        line.medicine.id
                      )
                    }
                  >
                    <Delete
                      fontSize="small"
                      color="error"
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* TOTAL + PAYMENT */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }} />

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            {/* SUBTOTAL */}
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 1,
              }}
            >
              <Typography sx={{ color: "#666" }}>
                Subtotal
              </Typography>

              <Typography
                sx={{ fontWeight: 600 }}
              >
                {formatCurrency(subtotal)}
              </Typography>
            </Box>

            {/* DISCOUNT */}
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography sx={{ color: "#666" }}>
                Discount
              </Typography>

              <TextField
                type="number"
                size="small"
                value={discount}
                onChange={(e) =>
                  setDiscount(
                    Math.max(
                      Number(e.target.value),
                      0
                    )
                  )
                }
                sx={{ width: 120 }}
              />
            </Box>

            {/* GST */}
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography sx={{ color: "#666" }}>
                GST
              </Typography>

              <TextField
                type="number"
                size="small"
                value={gst}
                onChange={(e) =>
                  setGst(
                    Math.max(
                      Number(e.target.value),
                      0
                    )
                  )
                }
                sx={{ width: 120 }}
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* GRAND TOTAL */}
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Grand Total
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {formatCurrency(grandTotal)}
              </Typography>
            </Box>

            {/* PAYMENT METHOD */}
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Payment Method
            </Typography>

            <Select
              fullWidth
              size="small"
              value={paymentMode}
              onChange={(e) =>
                setPaymentMode(
                  e.target.value as PaymentMode
                )
              }
              sx={{ mb: 2 }}
            >
              <MenuItem value="Cash">
                Cash
              </MenuItem>

              <MenuItem value="UPI">
                UPI / QR Code
              </MenuItem>

              <MenuItem value="Card">
                Card / Stripe
              </MenuItem>
            </Select>

            {paymentCompleted && (
              <Chip
                icon={
                  <CheckCircleOutlined />
                }
                label={`Payment Ready • ${paymentMode}`}
                color="success"
                sx={{ mb: 2 }}
              />
            )}

            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={handleCompleteSale}
              >
                Complete Sale
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* PAYMENT DIALOG */}
      <Dialog
        open={paymentDialog}
        onClose={() =>
          !paymentLoading &&
          setPaymentDialog(false)
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Complete Payment
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              textAlign: "center",
              py: 2,
            }}
          >
            <Typography
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Amount to Pay
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ mb: 3 }}
            >
              {formatCurrency(grandTotal)}
            </Typography>

            {/* CASH */}
            {paymentMode === "Cash" && (
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#F5F7FA",
                }}
              >
                <PaymentsOutlined
                  sx={{
                    fontSize: 55,
                    color: "primary.main",
                    mb: 1,
                  }}
                />

                <Typography fontWeight={700}>
                  Cash Payment
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={14}
                >
                  Collect the payment from the
                  customer and confirm below.
                </Typography>
              </Box>
            )}

            {/* UPI */}
            {paymentMode === "UPI" && (
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#F5F7FA",
                }}
              >
                <QrCode2Outlined
                  sx={{
                    fontSize: 60,
                    color: "primary.main",
                    mb: 1,
                  }}
                />

                <Typography
                  fontWeight={700}
                  sx={{ mb: 1 }}
                >
                  Scan to Pay
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={14}
                  sx={{ mb: 2 }}
                >
                  Scan the pharmacy QR code using
                  the customer's UPI application.
                </Typography>

                <Box
                  sx={{
                    display: "inline-flex",
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid #ddd",
                  }}
                >
                  <Typography
                    sx={{
                      width: 180,
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      color: "text.secondary",
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    Pharmacy
                    <br />
                    UPI QR Code
                  </Typography>
                </Box>
              </Box>
            )}

            {/* STRIPE */}
            {paymentMode === "Card" && (
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#F5F7FA",
                }}
              >
                <CreditCardOutlined
                  sx={{
                    fontSize: 60,
                    color: "primary.main",
                    mb: 1,
                  }}
                />

                <Typography
                  fontWeight={700}
                  sx={{ mb: 1 }}
                >
                  Stripe Card Payment
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={14}
                  sx={{ mb: 2 }}
                >
                  You will be redirected to
                  secure Stripe Checkout to
                  complete the card payment.
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  {formatCurrency(grandTotal)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() =>
              setPaymentDialog(false)
            }
            disabled={paymentLoading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={paymentLoading}
            startIcon={
              paymentMode === "Card" ? (
                <CreditCardOutlined />
              ) : paymentMode === "UPI" ? (
                <QrCode2Outlined />
              ) : (
                <PaymentsOutlined />
              )
            }
          >
            {paymentLoading
              ? "Connecting..."
              : paymentMode === "Card"
              ? "Pay with Stripe"
              : "Confirm Payment"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar({
              ...snackbar,
              open: false,
            })
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default Billing;