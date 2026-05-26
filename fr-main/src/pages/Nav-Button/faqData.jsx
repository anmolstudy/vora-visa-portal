/**
 * faqData.jsx
 *
 * Static data for the FAQ page.
 * Categories, their icons, and all FAQ items live here.
 * To add a new FAQ, add an entry to FAQ_DATA below.
 */

import {
  BookOnline, CreditCard, Description, FlightTakeoff,
  HelpOutline, SupportAgent, TravelExplore,
} from "@mui/icons-material";

// Filter category labels
export const CATS = ["All", "Visa Process", "Documents", "Passport", "Payment", "Travel", "Support"];

// Icon for each category (used in the filter tab buttons)
export const CAT_ICONS = {
  "All":          <HelpOutline />,
  "Visa Process": <TravelExplore />,
  "Documents":    <Description />,
  "Passport":     <BookOnline />,
  "Payment":      <CreditCard />,
  "Travel":       <FlightTakeoff />,
  "Support":      <SupportAgent />,
};

// Full list of FAQ items
// popular: true = shows a "Popular" badge on the item
export const FAQ_DATA = [
  { id:1,  cat:"Visa Process", popular:true,  icon:<TravelExplore />, q:"How long does visa processing take?",                a:"Tourist visas typically take 5–15 working days. Work permits and student visas: 15–45 days. We keep you informed at every stage." },
  { id:2,  cat:"Visa Process", popular:true,  icon:<TravelExplore />, q:"Which countries do you provide visa services for?",  a:"25+ countries including UK, USA, Canada, Australia, UAE, all Schengen countries, Singapore, and New Zealand. Contact us to confirm your destination." },
  { id:3,  cat:"Visa Process", popular:false, icon:<TravelExplore />, q:"What happens if my visa application is rejected?",   a:"We provide a full rejection analysis and re-application support. Our Premium package includes re-application assistance at no extra cost." },
  { id:4,  cat:"Visa Process", popular:false, icon:<TravelExplore />, q:"Can I apply for a multiple-entry visa?",             a:"Yes, we assist with both single and multiple-entry visa applications. Our consultants will advise on the best option for your travel plans." },
  { id:5,  cat:"Visa Process", popular:true,  icon:<TravelExplore />, q:"Do I need to visit the embassy myself?",            a:"In most cases, no — we handle the entire application on your behalf. Countries like the USA require a personal interview; we prepare you thoroughly." },
  { id:6,  cat:"Documents",   popular:true,  icon:<Description />,   q:"What documents are required for a tourist visa?",    a:"Typically: valid passport (6+ months), recent photos, 6-month bank statement, hotel booking, flight itinerary, travel insurance, and employment proof." },
  { id:7,  cat:"Documents",   popular:false, icon:<Description />,   q:"Do you help with document attestation and apostille?",a:"Yes. We provide complete attestation, apostille certification, notarization, and certified translation services for all requirements." },
  { id:8,  cat:"Documents",   popular:false, icon:<Description />,   q:"Can I submit documents online?",                    a:"Soft copies can be submitted via WhatsApp or email for initial review. Final applications may require original or notarized copies." },
  { id:9,  cat:"Documents",   popular:false, icon:<Description />,   q:"How long should my passport be valid?",             a:"Most countries require at least 6 months validity beyond your travel dates. We check this during document review and alert you if renewal is needed first." },
  { id:10, cat:"Passport",    popular:true,  icon:<BookOnline />,    q:"Do you assist with passport applications and renewals?", a:"Yes — new applications, renewals, Tatkal (urgent) passports, and minor passports. We handle documentation, form filling, and submission." },
  { id:11, cat:"Passport",    popular:false, icon:<BookOnline />,    q:"What is a Tatkal passport?",                        a:"Tatkal is an urgent passport service for travel within 1–3 working days. It carries an additional government fee." },
  { id:12, cat:"Passport",    popular:false, icon:<BookOnline />,    q:"Can you help with a minor's passport application?", a:"Yes. Both parents' consent documents, the child's birth certificate, Aadhar card, and school ID are typically needed." },
  { id:13, cat:"Payment",     popular:false, icon:<CreditCard />,    q:"What are your service charges?",                   a:"Fees start from ₹2,000 for basic assistance up to ₹10,000 for premium packages. Government and embassy fees are separate. No hidden charges." },
  { id:14, cat:"Payment",     popular:false, icon:<CreditCard />,    q:"What payment methods do you accept?",              a:"Cash, UPI (GPay, PhonePe, Paytm), Bank Transfer (NEFT/IMPS), and Cheque — at our office or transferred directly for online clients." },
  { id:15, cat:"Payment",     popular:false, icon:<CreditCard />,    q:"Do you offer refunds if my visa is rejected?",     a:"Our service fee is non-refundable as it covers work done by our team. Premium clients receive free re-application support." },
  { id:16, cat:"Travel",      popular:true,  icon:<FlightTakeoff />, q:"Do you provide flight and hotel booking?",         a:"Yes — domestic and international flights, hotels, and complete tour packages tailored to your budget. We also provide dummy ticket bookings." },
  { id:17, cat:"Travel",      popular:false, icon:<FlightTakeoff />, q:"Do you offer group or family travel packages?",   a:"Absolutely. We specialise in group travel, family packages, bulk flight bookings, and customised itineraries for any group size." },
  { id:18, cat:"Support",     popular:true,  icon:<SupportAgent />,  q:"Is the first consultation free?",                 a:"Yes — the initial telephonic consultation is completely free. In-office detailed profile assessment is ₹500, adjusted against your package." },
  { id:19, cat:"Support",     popular:false, icon:<SupportAgent />,  q:"Can I track my application status?",              a:"Yes. Real-time updates via WhatsApp and email throughout your application. Premium clients get a dedicated relationship manager." },
];
