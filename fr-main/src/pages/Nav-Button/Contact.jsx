/**
 * Contact.jsx
 *
 * The Contact page, assembled from smaller focused components:
 *   - HeroSection      — navy gradient header
 *   - InfoCards        — 4 hover cards (address, phone, email, hours)
 *   - FormSection      — sidebar + ContactForm component
 *   - MapSection       — Google Maps embed
 *   - OfficeHoursSection — weekly hours table with "Today" highlight
 *
 * The page uses plain CSS-in-JS (no MUI theme) with Cormorant Garamond
 * serif — giving it a distinct luxury feel vs the other blue-theme pages.
 */

import { useEffect, useRef, useState } from "react";
import ContactForm from "../../components/ContactForm";

// ── Global styles ─────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --gold:       #C9A84C;
    --gold-light: #E8C97A;
    --navy:       #0D1B2A;
    --navy-mid:   #1A2E45;
    --cream:      #F5F0E8;
    --cream-dark: #EDE6D6;
    --white:      #FFFFFF;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--navy);
    overflow-x: hidden;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
    50%       { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
  }
`;

// ── Reusable: Scroll-fade wrapper ─────────────────────────────────────────────
// Any child wrapped in <FadeSection> will fade up when it enters the viewport

function useFadeIn(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeSection({ children, style = {}, delay = 0 }) {
  const [ref, visible] = useFadeIn(0.1);
  return (
    <section
      ref={ref}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

// ── Reusable: Section label with gold line ─────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <div style={{ width: "40px", height: "1px", background: "var(--gold)" }} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--gold)", fontWeight: 500 }}>
        {children}
      </span>
    </div>
  );
}

// ── 1. Hero ───────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <div style={{
      minHeight: "60vh",
      background: `linear-gradient(150deg, var(--navy) 0%, var(--navy-mid) 55%, #1E3A5F 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: "80px 20px 100px",
    }}>
      {/* Floating rings */}
      {[300, 500, 700].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${size}px`, height: `${size}px`,
          border: `1px solid rgba(201,168,76,${0.07 - i * 0.02})`,
          borderRadius: "50%",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          animation: `float ${4 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }} />
      ))}

      <div style={{ textAlign: "center", zIndex: 2, animation: "fadeUp 1.1s ease forwards" }}>
        {/* Badge */}
        <div style={{
          display: "inline-block", padding: "5px 18px",
          border: "1px solid var(--gold)", borderRadius: "100px",
          color: "var(--gold)", fontSize: "11px", letterSpacing: "3px",
          textTransform: "uppercase", marginBottom: "28px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          We're here to help
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px, 7vw, 88px)", fontWeight: 300, color: "var(--white)", lineHeight: 1.05, marginBottom: "6px" }}>
          Get in Touch
        </h1>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(44px, 7vw, 88px)",
          fontWeight: 600, fontStyle: "italic",
          background: `linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold))`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
          lineHeight: 1.05, marginBottom: "28px",
        }}>
          With Us
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "17px", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto", fontWeight: 300 }}>
          We are here to help you with visa, passport, and travel services. Reach out and let us plan your journey abroad.
        </p>
      </div>

      {/* Bottom cream fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to bottom, transparent, var(--cream))" }} />
    </div>
  );
}

// ── 2. Contact info cards ─────────────────────────────────────────────────────

const CONTACT_CARDS = [
  { icon: "📍", label: "Office Address", lines: ["Vora Travel Agency", "Punjab, India — 141001"] },
  { icon: "📞", label: "Phone",          lines: ["+91 98765 43210", "+91 91234 56789"] },
  { icon: "📧", label: "Email",          lines: ["support@voratravel.com", "info@voratravel.com"] },
  { icon: "🕒", label: "Office Hours",   lines: ["Mon – Sat : 9 AM – 6 PM", "Sunday : Closed"] },
];

function InfoCards() {
  const [hovered, setHovered] = useState(null);
  return (
    <FadeSection style={{ padding: "0 20px 80px", marginTop: "-40px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        {CONTACT_CARDS.map((card, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === i ? "var(--navy)" : "var(--white)",
              border: "1px solid", borderColor: hovered === i ? "var(--navy)" : "#E8E0D0",
              borderRadius: "10px", padding: "36px 28px",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              transform: hovered === i ? "translateY(-8px)" : "translateY(0)",
              boxShadow: hovered === i ? "0 20px 40px rgba(13,27,42,0.18)" : "0 4px 16px rgba(0,0,0,0.05)",
              cursor: "default",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>{card.icon}</div>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: "10px" }}>{card.label}</div>
            {card.lines.map((line, j) => (
              <div key={j} style={{ fontSize: "15px", color: hovered === i ? "rgba(255,255,255,0.75)" : "#4A5568", fontWeight: j === 0 ? 500 : 300, lineHeight: 1.7, transition: "color 0.3s" }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </FadeSection>
  );
}

// ── 3. Contact form section ────────────────────────────────────────────────────

const PHONE_NUMBER = "+919876543210";
const WHATSAPP_NUMBER = "919876543210";
const EMAIL_ADDRESS = "support@voratravel.com";

const QUICK_BUTTONS = [
  { icon: "📞", label: "Call Now",    value: "+91 98765 43210",      color: "#4CAF50", action: "phone" },
  { icon: "💬", label: "WhatsApp",   value: "Chat with us",          color: "#25D366", action: "whatsapp" },
  { icon: "✉️", label: "Email Us",  value: "support@voratravel.com", color: "var(--gold)", action: "email" },
];

function FormSection() {
  const handleQuickButtonClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === "phone") {
      window.location.href = `tel:${PHONE_NUMBER}`;
    } else if (action === "whatsapp") {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'm interested in your visa services.`, "_blank");
    } else if (action === "email") {
      window.location.href = `mailto:${EMAIL_ADDRESS}`;
    }
  };

  return (
    <FadeSection style={{ padding: "80px 20px", background: "var(--navy)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "64px", alignItems: "start" }}>

          {/* Left sidebar */}
          <div>
            <SectionLabel>Contact Form</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, color: "var(--white)", lineHeight: 1.15, marginBottom: "24px" }}>
              Send Us a<br />
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Message</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", lineHeight: 1.9, fontWeight: 300, marginBottom: "40px" }}>
              Fill in the form and our team will get back to you within 24 hours with a personalised consultation.
            </p>

            {/* Quick-contact buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {QUICK_BUTTONS.map((btn, i) => (
                <div
                  key={i}
                  onClick={(e) => handleQuickButtonClick(e, btn.action)}
                  style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${btn.color}22`, border: `1px solid ${btn.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, animation: i === 0 ? "pulse 2s infinite" : "none" }}>
                    {btn.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: btn.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "2px" }}>{btn.label}</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>{btn.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social icon row */}
            <div style={{ marginTop: "36px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Follow Us</div>
              <div style={{ display: "flex", gap: "12px" }}>
                {["f", "in", "ig", "yt"].map((icon, i) => (
                  <div
                    key={i}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: the shared ContactForm component */}
          <ContactForm />
        </div>
      </div>
    </FadeSection>
  );
}

// ── 4. Map ─────────────────────────────────────────────────────────────────────

function MapSection() {
  return (
    <FadeSection style={{ background: "var(--cream-dark)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <SectionLabel>Find Us</SectionLabel>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 400, color: "var(--navy)" }}>
            Our <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Location</em>
          </h2>
        </div>
        <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #E8E0D0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109744.35510554975!2d75.74715795820311!3d30.900964999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a837462345a7b%3A0xb8db22c70f2f9b71!2sLudhiana%2C%20Punjab!5e0!3m2!1sen!2sin!4v1710000000000"
            width="100%" height="400"
            style={{ border: "none", display: "block" }}
            allowFullScreen loading="lazy"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", color: "#6B7280", fontSize: "14px" }}>
          <span>📍</span>
          <span style={{ fontWeight: 300 }}>Vora Travel Agency, Punjab, India — 141001</span>
        </div>
      </div>
    </FadeSection>
  );
}

// ── 5. Office hours ────────────────────────────────────────────────────────────

const OFFICE_HOURS = [
  { day: "Monday",    time: "9:00 AM – 6:00 PM", open: true },
  { day: "Tuesday",   time: "9:00 AM – 6:00 PM", open: true },
  { day: "Wednesday", time: "9:00 AM – 6:00 PM", open: true },
  { day: "Thursday",  time: "9:00 AM – 6:00 PM", open: true },
  { day: "Friday",    time: "9:00 AM – 6:00 PM", open: true },
  { day: "Saturday",  time: "10:00 AM – 4:00 PM", open: true },
  { day: "Sunday",    time: "Closed",              open: false },
];

function OfficeHoursSection() {
  // Detect today's day name so we can highlight it
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <FadeSection style={{ padding: "100px 20px", background: "var(--cream)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <SectionLabel>Availability</SectionLabel>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 400, color: "var(--navy)" }}>
            Office <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Hours</em>
          </h2>
        </div>
        <div style={{ background: "var(--white)", borderRadius: "12px", overflow: "hidden", border: "1px solid #E8E0D0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
          {OFFICE_HOURS.map((row, i) => {
            const isToday = row.day === today;
            return (
              <div
                key={i}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 28px",
                  background: isToday ? "rgba(201,168,76,0.08)" : "transparent",
                  borderBottom: i < OFFICE_HOURS.length - 1 ? "1px solid #F0EAE0" : "none",
                  borderLeft: isToday ? "3px solid var(--gold)" : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "15px", fontWeight: isToday ? 500 : 400, color: isToday ? "var(--navy)" : "#4A5568" }}>
                    {row.day}
                  </span>
                  {isToday && (
                    <span style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", background: "var(--gold)", color: "var(--navy)", padding: "2px 8px", borderRadius: "100px", fontWeight: 500 }}>
                      Today
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "14px", color: row.open ? (isToday ? "var(--navy)" : "#6B7280") : "#E5534B", fontWeight: row.open ? 400 : 500 }}>
                  {row.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </FadeSection>
  );
}

// ── Page assembly ──────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <main>
        <HeroSection />
        <InfoCards />
        <FormSection />
        <MapSection />
        <OfficeHoursSection />
      </main>
    </>
  );
}
