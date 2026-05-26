import Payment from "../models/Payment.js";
import { AppError } from "../middleware/error.middleware.js";

// ─── Service definitions (single source of truth) ──────────────────────────
const SERVICES = {
  tourist: { id: "tourist", name: "Tourist Visa Consultation", price: 999 },
  student: { id: "student", name: "Student Visa Package", price: 2999 },
  work:    { id: "work",    name: "Work Visa Premium",       price: 4999 },
};

// ─── Helper: generate unique order ID ──────────────────────────────────────
const generateOrderId = () =>
  `VCC${Date.now().toString().slice(-8)}${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;

// ─── CREATE payment  POST /api/payments ────────────────────────────────────
export const createPayment = async (req, res, next) => {
  try {
    const { serviceId, cardNumber, cardHolderName } = req.body;

    const service = SERVICES[serviceId];
    if (!service) {
      return next(new AppError("Invalid service selected.", 400));
    }

    // Simulate payment gateway — replace with real Stripe/Razorpay in production
    const cardStripped = (cardNumber || "").replace(/\s/g, "");
    const isDeclined = cardStripped.startsWith("4000");

    if (isDeclined) {
      const failedPayment = await Payment.create({
        userId: req.user._id,
        userName: req.user.name || `${req.user.firstName ?? ""} ${req.user.lastName ?? ""}`.trim(),
        userEmail: req.user.email,
        serviceId: service.id,
        serviceName: service.name,
        amount: service.price,
        currency: "INR",
        status: "failed",
        orderId: generateOrderId(),
        cardLast4: cardStripped.slice(-4),
        cardHolderName,
      });

      return res.status(402).json({
        success: false,
        message: "Payment declined. Please try a different card.",
        payment: failedPayment,
      });
    }

    const payment = await Payment.create({
      userId: req.user._id,
      userName: req.user.name || `${req.user.firstName ?? ""} ${req.user.lastName ?? ""}`.trim(),
      userEmail: req.user.email,
      serviceId: service.id,
      serviceName: service.name,
      amount: service.price,
      currency: "INR",
      status: "success",
      orderId: generateOrderId(),
      cardLast4: cardStripped.slice(-4),
      cardHolderName,
    });

    return res.status(201).json({ success: true, message: "Payment successful.", payment });
  } catch (error) {
    next(error); // use centralized error handler
  }
};

// ─── GET payments for logged-in user  GET /api/payments/my ────────────────
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    next(error);
  }
};

// ─── GET single payment  GET /api/payments/:id ────────────────────────────
export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) return next(new AppError("Payment not found.", 404));

    // Users can only see their own payments; admin can see all
    if (
      payment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Access denied.", 403));
    }

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: GET all payments  GET /api/payments/admin/all ────────────────
export const getAllPayments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: UPDATE payment status  PUT /api/payments/:id ─────────────────
export const updatePayment = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const allowedStatuses = ["pending", "success", "failed", "refunded"];
    if (status && !allowedStatuses.includes(status)) {
      return next(new AppError("Invalid status value.", 400));
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes && { notes }) },
      { new: true, runValidators: true }
    );

    if (!payment) return next(new AppError("Payment not found.", 404));

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: DELETE payment record  DELETE /api/payments/:id ──────────────
export const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return next(new AppError("Payment not found.", 404));
    return res.status(200).json({ success: true, message: "Payment record deleted." });
  } catch (error) {
    next(error);
  }
};
