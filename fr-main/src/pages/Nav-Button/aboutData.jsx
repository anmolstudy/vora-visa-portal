/**
 * aboutData.jsx
 *
 * All static content for the About page lives here —
 * stats, timeline, team members, testimonials, FAQs, and "why us" points.
 * To update content, just edit this file; no need to touch the page component.
 */

import {
  EmojiEvents, Groups, Handshake, PeopleAlt, Public,
  RocketLaunch, Security, Speed, SupportAgent,
  ThumbUp, TravelExplore, Verified, WorkspacePremium,
} from "@mui/icons-material";

// Animated number counters at the top of the page
export const STATS = [
  { value: 5000, suffix: "+", label: "Happy Clients",    icon: <Groups /> },
  { value: 10,   suffix: "+", label: "Years Experience", icon: <EmojiEvents /> },
  { value: 25,   suffix: "+", label: "Countries",        icon: <Public /> },
  { value: 98,   suffix: "%", label: "Approval Rate",    icon: <Verified /> },
];

// Company history timeline
export const TIMELINE = [
  { year: "2014", title: "Company Founded",        icon: <RocketLaunch />, right: true,
    desc: "Started as a small passport consultancy in Ludhiana, Punjab, with a bold vision to simplify travel." },
  { year: "2016", title: "500 Happy Clients",      icon: <PeopleAlt />,    right: false,
    desc: "Crossed our first major milestone, earning trust across Punjab with flawless, personalised service." },
  { year: "2018", title: "Expanded Visa Services", icon: <TravelExplore />,right: true,
    desc: "Launched full-scale visa processing for 15+ countries — UK, Canada, Schengen and more." },
  { year: "2020", title: "Digital Platform",       icon: <Speed />,        right: false,
    desc: "Went digital — clients could now submit documents and track applications entirely online." },
  { year: "2022", title: "25+ Countries",          icon: <Public />,       right: true,
    desc: "Expanded our network to 25+ countries with a 98% visa approval rate." },
  { year: "2024", title: "5000+ Clients Served",   icon: <EmojiEvents />,  right: false,
    desc: "A trusted name across North India, serving thousands of happy travellers every day." },
];

// Team section
export const TEAM = [
  { name: "Rajesh Sharma", role: "Founder & CEO",  exp: "15 yrs", initials: "RS", grad: "linear-gradient(135deg,#002171,#1976D2)", color: "#0D47A1" },
  { name: "Priya Mehta",   role: "Head of Visas",  exp: "10 yrs", initials: "PM", grad: "linear-gradient(135deg,#0D47A1,#42A5F5)", color: "#1565C0" },
  { name: "Arjun Kapoor",  role: "Travel Expert",  exp: "8 yrs",  initials: "AK", grad: "linear-gradient(135deg,#1A237E,#1976D2)", color: "#283593" },
  { name: "Sneha Verma",   role: "Client Manager", exp: "6 yrs",  initials: "SV", grad: "linear-gradient(135deg,#01579B,#29B6F6)", color: "#0277BD" },
];

// Client testimonials carousel
export const TESTIMONIALS = [
  { name: "Gurpreet Singh", role: "Canada Tourist Visa", rating: 5,
    text: "Excellent service! My family's Canada tourist visa was approved in just 12 days. The team was incredibly helpful at every single step." },
  { name: "Anita Khanna",   role: "Student Visa – UK",   rating: 5,
    text: "I was nervous about my student visa but they guided me perfectly. Got my UK visa approved on the very first attempt — amazing!" },
  { name: "Hardeep Bains",  role: "Work Permit – UAE",   rating: 5,
    text: "Professional and lightning fast. They handled all my documents perfectly. Highly recommend for work visas." },
  { name: "Sunita Patel",   role: "Schengen Visa",       rating: 5,
    text: "Amazing experience. Visa approved in 8 working days. Their document checklist made everything so clear and stress-free." },
];

// "Why choose us" feature list
export const WHY_US = [
  { icon: <Speed />,            title: "Fast Processing",   desc: "Most applications processed well within standard timelines. Speed is our core promise." },
  { icon: <Security />,         title: "100% Secure",       desc: "Your documents and personal data are handled with complete confidentiality always." },
  { icon: <ThumbUp />,          title: "98% Success Rate",  desc: "Accurate, complete applications that minimise the risk of rejection." },
  { icon: <SupportAgent />,     title: "24/7 Support",      desc: "Available on call, WhatsApp, and email — any time you need us." },
  { icon: <WorkspacePremium />, title: "Certified Experts", desc: "Trained consultants up-to-date with the latest immigration laws and policies." },
  { icon: <Handshake />,        title: "Full Transparency", desc: "No hidden fees. Clear timelines. You always know where your application stands." },
];

// FAQ accordion items
export const FAQS = [
  { q: "How long does visa processing take?",
    a: "Tourist visas: 5–15 working days. Work/student visas: 15–45 days. We always aim for the fastest possible turnaround." },
  { q: "Which countries do you cover?",
    a: "25+ countries including UK, USA, Canada, Australia, UAE, all Schengen countries, Singapore, and New Zealand." },
  { q: "Can you help with passport renewal?",
    a: "Yes — new applications, renewals, and Tatkal passports with full document assistance included." },
  { q: "What if my visa gets rejected?",
    a: "We provide full rejection analysis and re-application support. Premium plan includes re-application at no extra charge." },
  { q: "Is the first consultation free?",
    a: "Yes! First telephonic consultation is completely free. In-office assessment: ₹500, adjusted against your package." },
  { q: "Do you provide flight & hotel booking?",
    a: "Absolutely. Flights, hotels, and complete tour packages — domestic and international, all in one place." },
];
