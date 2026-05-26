import mongoose from 'mongoose';

const visaApplicationSchema = new mongoose.Schema({

  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  passport: { type: String, default: '', trim: true },   // FIX: passport number field
  visaType: { type: String, trim: true },
  country: { type: String, required: true, trim: true },
  message: { type: String, default: '' },

  // Pipeline status (admin tracking)
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Approved', 'Rejected', 'NEW',
      'CONTACTED', 'PROCESSING', 'PENDING', 'DOCUMENTS', 'VISA APPLIED', 'APPROVED', 'REJECTED'],
  },

  // Admin-managed fields
  ppStatus: {
    type: String,
    default: 'IN MAIL',
    enum: ['IN MAIL', 'IN OFFICE', 'COURIER', 'AT DELHI', 'COURIER TO MS OFFICE'],
  },
  ref: { type: String, default: '' },       // Agent / referral
  payment: { type: Number, default: 0 },        // Payment received (₹)
  paymentStatus: { type: String, default: 'PENDING', enum: ['PENDING', 'PAID', 'PARTIAL'] },
  ppExp: { type: String, default: null },     // Passport expiry date (YYYY-MM-DD)
  subDate: { type: String, default: null },     // Submission date (YYYY-MM-DD)

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('VisaApplication', visaApplicationSchema);