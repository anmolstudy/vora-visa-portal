/**
 * servicesData.jsx
 * 
 * All static data for the Services page lives here.
 * Keeping data separate from the UI makes both files easier to read.
 * To add or edit a service, just update this file.
 */

import {
  Description, Work, School, Assignment, SupportAgent, Flight,
  TravelExplore, Business, Groups, EmojiEvents, Public, Verified,
  Speed, CardTravel,
} from "@mui/icons-material";

export const SERVICES = [
  {
    id: 1, category: "Passport", color: "#0D47A1",
    icon: <Description sx={{ fontSize: 40 }} />,
    title: "Passport Services",
    short: "New passport, renewal & Tatkal — fast, verified assistance.",
    description: "We handle everything from new passport applications to renewals and Tatkal (urgent) passports. Our team ensures your documents are complete and submitted correctly.",
    docs: ["Aadhar Card", "Passport size photos (x4)", "Birth certificate", "Address proof", "PAN Card"],
    time: "7–21 working days",
    price: "₹2,500",
    sub: ["New Passport", "Passport Renewal", "Tatkal Passport", "Minor Passport", "Document Verification"],
  },
  {
    id: 2, category: "Visa", color: "#1565C0",
    icon: <TravelExplore sx={{ fontSize: 40 }} />,
    title: "Tourist Visa",
    short: "Explore the world — fast tourist visa processing for 25+ countries.",
    description: "Planning a holiday? We process tourist visas for the UK, USA, Canada, Europe (Schengen), Australia, and more.",
    docs: ["Valid Passport", "Bank Statement (6 months)", "Photos", "Travel Itinerary", "Hotel Booking proof"],
    time: "5–15 working days",
    price: "₹3,500",
    sub: ["Single Entry", "Multiple Entry", "Schengen Visa", "On Arrival Support", "Family Tourist Visa"],
  },
  {
    id: 3, category: "Visa", color: "#283593",
    icon: <Work sx={{ fontSize: 40 }} />,
    title: "Work Visa",
    short: "International work permits with expert guidance & documentation.",
    description: "Looking to work abroad? We assist with work permit applications for Canada, Germany, UAE, UK, and more.",
    docs: ["Offer Letter", "Valid Passport", "Educational Certificates", "Work Experience Proof", "Medical Certificate"],
    time: "15–30 working days",
    price: "₹8,000",
    sub: ["Employment Visa", "Skilled Worker Visa", "Intra-Company Transfer", "Sponsored Work Permit", "LMIA Assistance"],
  },
  {
    id: 4, category: "Visa", color: "#1A237E",
    icon: <Business sx={{ fontSize: 40 }} />,
    title: "Training Visa",
    short: "Visas for corporate training & professional development abroad.",
    description: "Need to attend corporate training internationally? We process training and business visas for skill development programs.",
    docs: ["Training Letter", "Valid Passport", "Sponsorship Letter", "Bank Statement", "Return Ticket"],
    time: "7–14 working days",
    price: "₹5,000",
    sub: ["Corporate Training Visa", "Professional Development", "Short-term Training", "Exchange Program Visa"],
  },
  {
    id: 5, category: "Visa", color: "#0277BD",
    icon: <School sx={{ fontSize: 40 }} />,
    title: "Student Visa",
    short: "Study abroad with confidence — student visa support for top universities.",
    description: "Dreaming of studying in Canada, UK, or Australia? We provide end-to-end student visa assistance.",
    docs: ["Admission Letter", "Valid Passport", "Financial Proof", "Academic Records", "IELTS / TOEFL Score"],
    time: "20–45 working days",
    price: "₹10,000",
    sub: ["Canada Study Permit", "UK Student Visa", "Australia Student Visa", "USA F-1 Visa", "Interview Coaching"],
  },
  {
    id: 6, category: "Travel", color: "#00695C",
    icon: <Flight sx={{ fontSize: 40 }} />,
    title: "Travel Booking",
    short: "Flights, hotels & tour packages — all in one place.",
    description: "We book domestic and international flights, hotels, and complete travel packages tailored to your budget.",
    docs: ["Aadhar / Passport", "Travel Preferences", "Budget Details"],
    time: "1–3 working days",
    price: "₹500 (Service Fee)",
    sub: ["Flight Booking", "Hotel Booking", "Tour Packages", "Honeymoon Packages", "Group Travel"],
  },
  {
    id: 7, category: "Passport", color: "#4527A0",
    icon: <Assignment sx={{ fontSize: 40 }} />,
    title: "Document Assistance",
    short: "Notarization, attestation, apostille & document translation.",
    description: "We provide document attestation, notarization, apostille certification, and certified translation services.",
    docs: ["Original Documents", "Copy of Passport", "Photos"],
    time: "3–7 working days",
    price: "₹1,500",
    sub: ["Document Attestation", "Apostille Services", "Notarization", "Translation Services", "Police Clearance"],
  },
  {
    id: 8, category: "Consultation", color: "#6A1B9A",
    icon: <SupportAgent sx={{ fontSize: 40 }} />,
    title: "Visa Consultation",
    short: "One-on-one expert consultation for all your visa queries.",
    description: "Not sure which visa to apply for? Book a consultation with our expert. We assess your profile and guide your application.",
    docs: ["Passport Copy", "Purpose of Travel"],
    time: "Same day / Next day",
    price: "₹500",
    sub: ["Profile Assessment", "Document Review", "Visa Category Guidance", "Rejection Recovery", "Immigration Planning"],
  },
];

export const CATEGORIES = ["All", "Passport", "Visa", "Travel", "Consultation"];

// Steps shown in the "How it works" section
export const PROCESS_STEPS = [
  { label: "Consultation",           icon: <SupportAgent />, desc: "Book a free consultation. We assess your requirements and suggest the best path forward." },
  { label: "Document Collection",    icon: <Assignment />,   desc: "We provide a complete checklist of required documents. Upload or submit at our office." },
  { label: "Application Submission", icon: <Description />,  desc: "Our team prepares and submits your application to the embassy or passport office." },
  { label: "Tracking & Follow-up",   icon: <Speed />,        desc: "We track your application status and follow up with authorities for timely processing." },
  { label: "Delivery",               icon: <CardTravel />,   desc: "Your passport / visa is delivered to your doorstep or ready for pickup at our office." },
];

// Pricing tiers
export const PACKAGES = [
  {
    title: "Basic",    price: "₹2,000", color: "#1565C0", popular: false,
    features: ["Application Form Assistance", "Document Checklist", "Basic Verification", "Email Support"],
  },
  {
    title: "Standard", price: "₹4,500", color: "#FF6F00", popular: true,
    features: ["Everything in Basic", "Full Document Preparation", "Application Submission", "Status Tracking", "Phone Support"],
  },
  {
    title: "Premium",  price: "₹8,000", color: "#283593", popular: false,
    features: ["Everything in Standard", "Priority Processing", "Interview Coaching", "Rejection Support", "Doorstep Document Pickup", "Dedicated Manager"],
  },
];

export const STATS = [
  { value: "5,000+", label: "Happy Clients",    icon: <Groups /> },
  { value: "10+",    label: "Years Experience", icon: <EmojiEvents /> },
  { value: "25+",    label: "Countries",        icon: <Public /> },
  { value: "98%",    label: "Success Rate",     icon: <Verified /> },
];

export const FAQS = [
  { q: "How long does visa processing take?",  a: "Tourist visas: 5–15 working days. Work and student visas: 15–45 days. We aim for the fastest possible turnaround." },
  { q: "Do you provide passport renewal?",     a: "Yes — new applications, renewals, and Tatkal (urgent) passport services." },
  { q: "Which countries do you support?",      a: "25+ countries including Canada, UK, USA, Australia, UAE, all Schengen countries, Singapore, and New Zealand." },
  { q: "What if my visa is rejected?",         a: "Premium clients get full rejection support and free re-application assistance." },
  { q: "Can I track my application status?",   a: "Yes — real-time updates via WhatsApp and email. Premium clients get a dedicated relationship manager." },
  { q: "Is your consultation free?",           a: "First telephonic consultation is free. In-office assessment: ₹500 (adjusted against your package)." },
];
