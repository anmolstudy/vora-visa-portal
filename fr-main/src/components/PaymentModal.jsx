import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import {
  Close,
  CreditCard,
  Lock,
  CheckCircle,
  Error as ErrorIcon,
  Security,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Login as LoginIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

// Stripe test public key (demo mode)
const STRIPE_TEST_KEY = "pk_test_demo";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SERVICES = [
  {
    id: "tourist",
    name: "Tourist Visa Consultation",
    price: 999,
    originalPrice: 1499,
    description: "Basic consultation for tourist visa applications",
    features: ["Document checklist", "Application review", "Basic guidance"],
  },
  {
    id: "student",
    name: "Student Visa Package",
    price: 2999,
    originalPrice: 4999,
    description: "Complete student visa assistance",
    features: ["University guidance", "SOP review", "Interview prep", "Document verification"],
    popular: true,
  },
  {
    id: "work",
    name: "Work Visa Premium",
    price: 4999,
    originalPrice: 7999,
    description: "Professional work visa processing",
    features: ["Employer liaison", "Full documentation", "Express processing", "Post-landing support"],
  },
];

export default function PaymentModal({ open, onClose, selectedService = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("select"); // select, payment, processing, success, error
  const [service, setService] = useState(selectedService?.id || "student");
  const [completedPayment, setCompletedPayment] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [error, setError] = useState("");

  const selectedPlan = SERVICES.find((s) => s.id === service);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setError("");

    // Basic validation
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid card number");
      return;
    }
    if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
      setError("Please enter a valid expiry date");
      return;
    }
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      setError("Please enter a valid CVC");
      return;
    }
    if (!cardDetails.name.trim()) {
      setError("Please enter the cardholder name");
      return;
    }

    setStep("processing");
    try {
      const token = sessionStorage.getItem("auth_token");

      const res = await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ serviceId: service, cardNumber: cardDetails.number, cardHolderName: cardDetails.name }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCompletedPayment(data.payment);
        setStep("success");
      } else {
        setError(data.message || "Payment failed.");
        setStep("error");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      setStep("error");
    }
  }

  const handleLoginRedirect = () => {
    onClose();
    navigate("/login", { state: { from: "/home", openPayment: true } });
  };

  const handleClose = () => {
    setStep("select");
    setCardDetails({ number: "", expiry: "", cvc: "", name: "" });
    setError("");
    setCompletedPayment(null); // ← new
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "white",
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {step === "success" ? "Payment Successful!" : step === "error" ? "Payment Failed" : "Choose Your Plan"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
            {step === "select" && "Select a consultation package"}
            {step === "payment" && "Enter your payment details"}
            {step === "processing" && "Processing your payment..."}
            {step === "success" && "Your booking is confirmed"}
            {step === "error" && "Please try again"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* ── NOT LOGGED IN ── */}
        {!user && (
          <Box sx={{ p: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textAlign: "center" }}>
            <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LoginIcon sx={{ fontSize: 40, color: "#F97316" }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Login Required</Typography>
              <Typography variant="body2" color="text.secondary">
                You need to be logged in to proceed with payment. Please sign in to your account first.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Button fullWidth variant="outlined" onClick={handleClose} sx={{ py: 1.5, borderRadius: 3 }}>Cancel</Button>
              <Button fullWidth variant="contained" startIcon={<LoginIcon />} onClick={handleLoginRedirect}
                sx={{ py: 1.5, bgcolor: "#F97316", borderRadius: 3, fontWeight: 700, "&:hover": { bgcolor: "#EA580C" } }}>
                Login to Continue
              </Button>
            </Box>
          </Box>
        )}


        {/* Service Selection */}
        {user && step === "select" && (
          <Box sx={{ p: 3 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <RadioGroup
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {SERVICES.map((svc) => (
                  <Paper
                    key={svc.id}
                    elevation={0}
                    onClick={() => setService(svc.id)}
                    sx={{
                      p: 2.5,
                      mb: 2,
                      border: "2px solid",
                      borderColor: service === svc.id ? "#F97316" : "#E2E8F0",
                      borderRadius: 3,
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.2s ease",
                      bgcolor: service === svc.id ? "#FFF7ED" : "white",
                      "&:hover": {
                        borderColor: "#F97316",
                      },
                    }}
                  >
                    {svc.popular && (
                      <Chip
                        label="MOST POPULAR"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -12,
                          right: 16,
                          bgcolor: "#F97316",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                        }}
                      />
                    )}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Radio
                        value={svc.id}
                        checked={service === svc.id}
                        sx={{
                          color: "#E2E8F0",
                          "&.Mui-checked": { color: "#F97316" },
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="h6" fontWeight={700}>
                            {svc.name}
                          </Typography>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                              }}
                            >
                              ₹{svc.originalPrice}
                            </Typography>
                            <Typography variant="h5" fontWeight={800} color="#F97316">
                              ₹{svc.price}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          {svc.description}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {svc.features.map((f, i) => (
                            <Chip
                              key={i}
                              label={f}
                              size="small"
                              sx={{
                                bgcolor: "#F1F5F9",
                                fontSize: "0.7rem",
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => setStep("payment")}
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: "#F97316",
                borderRadius: 3,
                fontWeight: 700,
                "&:hover": { bgcolor: "#EA580C" },
              }}
            >
              Continue to Payment - ₹{selectedPlan?.price}
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 2 }}>
              <Lock sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Secure payment powered by Stripe (Test Mode)
              </Typography>
            </Box>
          </Box>
        )}

        {/* Payment Form */}
        {user && step === "payment" && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Test Mode:</strong> Use card number <code>4242 4242 4242 4242</code> for successful payment.
              </Typography>
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: "#F8FAFC",
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {selectedPlan?.name}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Total: ₹{selectedPlan?.price}
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => setStep("select")}
                sx={{ textTransform: "none" }}
              >
                Change
              </Button>
            </Paper>

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Card Details
            </Typography>

            <TextField
              fullWidth
              label="Card Number"
              placeholder="4242 4242 4242 4242"
              value={cardDetails.number}
              onChange={(e) =>
                setCardDetails({
                  ...cardDetails,
                  number: formatCardNumber(e.target.value),
                })
              }
              inputProps={{ maxLength: 19 }}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <CreditCard sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) =>
                  setCardDetails({
                    ...cardDetails,
                    expiry: formatExpiry(e.target.value),
                  })
                }
                inputProps={{ maxLength: 5 }}
              />
              <TextField
                fullWidth
                label="CVC"
                placeholder="123"
                value={cardDetails.cvc}
                onChange={(e) =>
                  setCardDetails({
                    ...cardDetails,
                    cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                  })
                }
                inputProps={{ maxLength: 4 }}
              />
            </Box>

            <TextField
              fullWidth
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, name: e.target.value })
              }
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePayment}
              startIcon={<Lock />}
              sx={{
                py: 1.5,
                bgcolor: "#F97316",
                borderRadius: 3,
                fontWeight: 700,
                "&:hover": { bgcolor: "#EA580C" },
              }}
            >
              Pay ₹{selectedPlan?.price}
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mt: 3 }}>
              <Security sx={{ fontSize: 20, color: "#22C55E" }} />
              <Typography variant="caption" color="text.secondary">
                Your payment is secured with 256-bit SSL encryption
              </Typography>
            </Box>
          </Box>
        )}

        {/* Processing */}
        {user && step === "processing" && (
          <Box
            sx={{
              p: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <CircularProgress size={64} sx={{ color: "#F97316" }} />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight={600}>
                Processing Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we process your payment...
              </Typography>
            </Box>
          </Box>
        )}

        {/* Success */}
        {user && step === "success" && (
          <Box
            sx={{
              p: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: "#22C55E" }} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ textAlign: "center" }}>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
              Thank you for your purchase. We've sent a confirmation email with your booking details.
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "#F8FAFC",
                borderRadius: 2,
                width: "100%",
                mt: 2,
              }}
            >
              {/* <Typography variant="body2" color="text.secondary">
                Order ID: <strong>#VCC{Date.now().toString().slice(-8)}</strong>
              </Typography> */}

              <Typography variant="body2" color="text.secondary">Order ID: <strong>#{completedPayment?.orderId}</strong></Typography>
              <Typography variant="body2" color="text.secondary">
                Service: <strong>{selectedPlan?.name}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amount Paid: <strong>₹{selectedPlan?.price}</strong>
              </Typography>
            </Paper>
            <Button
              fullWidth
              variant="contained"
              onClick={handleClose}
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: "#22C55E",
                borderRadius: 3,
                fontWeight: 700,
                "&:hover": { bgcolor: "#16A34A" },
              }}
            >
              Done
            </Button>
          </Box>
        )}

        {/* Error */}
        {user && step === "error" && (
          <Box
            sx={{
              p: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ErrorIcon sx={{ fontSize: 48, color: "#EF4444" }} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ textAlign: "center" }}>
              Payment Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
              {error || "Something went wrong. Please try again."}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{ py: 1.5, borderRadius: 3 }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setStep("payment");
                  setError("");
                }}
                sx={{
                  py: 1.5,
                  bgcolor: "#F97316",
                  borderRadius: 3,
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#EA580C" },
                }}
              >
                Try Again
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
