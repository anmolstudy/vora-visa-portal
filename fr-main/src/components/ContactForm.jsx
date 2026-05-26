import React, { useState } from "react";
import API from "../services/api/axios.config.js";

const services = [
  "Passport Service",
  "Work Visa",
  "Tourist Visa",
  "Training Visa",
  "Travel Booking",
  "Document Verification",
];

const inputStyle = (focused, error) => ({
  width: "100%",
  padding: "16px 18px",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${error ? "#E5534B" : focused ? "var(--gold)" : "rgba(255,255,255,0.12)"}`,
  borderRadius: "6px",
  color: "var(--white)",
  fontSize: "15px",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  outline: "none",
  transition: "border-color 0.3s, box-shadow 0.3s",
  boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.12)" : "none",
});

const labelStyle = {
  display: "block",
  fontSize: "11px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "var(--gold)",
  fontWeight: 500,
  marginBottom: "8px",
  fontFamily: "'DM Sans', sans-serif",
};

const errorStyle = {
  fontSize: "12px",
  color: "#E5534B",
  marginTop: "6px",
  fontFamily: "'DM Sans', sans-serif",
};

function validate(fields) {
  const errs = {};
  if (!fields.name.trim()) errs.name = "Name is required.";
  if (!fields.email.trim()) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = "Enter a valid email.";
  if (!fields.phone.trim()) errs.phone = "Phone is required.";
  else if (!/^[0-9+\s\-]{7,15}$/.test(fields.phone)) errs.phone = "Enter a valid phone number.";
  if (!fields.service) errs.service = "Please select a service.";
  if (!fields.message.trim()) errs.message = "Message cannot be empty.";
  else if (fields.message.trim().length < 20) errs.message = "Message must be at least 20 characters.";
  return errs;
}

export default function ContactForm() {
  const [fields, setFields] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // Send data to backend API
      const response = await API.post("/contact", {
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        subject: fields.service,
        reason: fields.service,
        message: fields.message,
      });

      if (response.data.success) {
        setStatus("success");
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Failed to send message. Please try again."
      );
    }
  };

  const handleReset = () => {
    setFields({ name: "", email: "", phone: "", service: "", message: "" });
    setErrors({});
    setStatus("idle");
    setErrorMessage("");
  };

  // ─── ERROR STATE ────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div style={{
        padding: "64px 48px",
        background: "var(--navy-mid)",
        borderRadius: "12px",
        border: "1px solid rgba(229,83,75,0.3)",
        textAlign: "center",
        animation: "fadeUp 0.6s ease forwards",
      }}>
        <div style={{ fontSize: "56px", marginBottom: "24px" }}>❌</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "32px", fontWeight: 400,
          color: "var(--white)", marginBottom: "12px",
        }}>
          Something went wrong
        </h3>
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "16px", lineHeight: 1.7,
          fontWeight: 300, marginBottom: "36px",
        }}>
          {errorMessage}
        </p>
        <button
          onClick={handleReset}
          style={{
            padding: "12px 32px",
            background: "var(--gold)", color: "var(--navy)",
            border: "none", borderRadius: "4px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px", fontWeight: 500,
            letterSpacing: "1px", textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ─── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div style={{
        padding: "64px 48px",
        background: "var(--navy-mid)",
        borderRadius: "12px",
        border: "1px solid rgba(201,168,76,0.2)",
        textAlign: "center",
        animation: "fadeUp 0.6s ease forwards",
      }}>
        <div style={{ fontSize: "56px", marginBottom: "24px" }}>✅</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "32px", fontWeight: 400,
          color: "var(--white)", marginBottom: "12px",
        }}>
          Message Sent!
        </h3>
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "16px", lineHeight: 1.7,
          fontWeight: 300, marginBottom: "36px",
        }}>
          Thank you for contacting us, <strong style={{ color: "var(--gold)" }}>{fields.name}</strong>.<br />
          Our team will reach out to you within 24 hours.
        </p>
        <button
          onClick={handleReset}
          style={{
            padding: "12px 32px",
            background: "var(--gold)", color: "var(--navy)",
            border: "none", borderRadius: "4px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px", fontWeight: 500,
            letterSpacing: "1px", textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  // ─── FORM STATE ─────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        padding: "48px",
        background: "var(--navy-mid)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "24px",
        marginBottom: "24px",
      }}>
        {/* Full Name */}
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            name="name"
            type="text"
            placeholder="Rajiv Sharma"
            value={fields.name}
            onChange={handleChange}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused("")}
            style={inputStyle(focused === "name", errors.name)}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={fields.email}
            onChange={handleChange}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused("")}
            style={inputStyle(focused === "email", errors.email)}
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>Phone Number</label>
          <input
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={fields.phone}
            onChange={handleChange}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused("")}
            style={inputStyle(focused === "phone", errors.phone)}
          />
          {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
        </div>

        {/* Service */}
        <div>
          <label style={labelStyle}>Service Type</label>
          <select
            name="service"
            value={fields.service}
            onChange={handleChange}
            onFocus={() => setFocused("service")}
            onBlur={() => setFocused("")}
            style={{
              ...inputStyle(focused === "service", errors.service),
              appearance: "none",
              cursor: "pointer",
              color: fields.service ? "var(--white)" : "rgba(255,255,255,0.3)",
            }}
          >
            <option value="" disabled style={{ background: "#1A2E45" }}>Select a service...</option>
            {services.map((s) => (
              <option key={s} value={s} style={{ background: "#1A2E45", color: "#fff" }}>{s}</option>
            ))}
          </select>
          {errors.service && <p style={errorStyle}>{errors.service}</p>}
        </div>
      </div>

      {/* Message */}
      <div style={{ marginBottom: "32px" }}>
        <label style={labelStyle}>Your Message</label>
        <textarea
          name="message"
          rows={5}
          placeholder="Describe how we can help you..."
          value={fields.message}
          onChange={handleChange}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused("")}
          style={{
            ...inputStyle(focused === "message", errors.message),
            resize: "vertical",
            minHeight: "130px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          {errors.message
            ? <p style={errorStyle}>{errors.message}</p>
            : <span />}
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
            {fields.message.length} chars
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          width: "100%",
          padding: "18px",
          background: status === "loading" ? "rgba(201,168,76,0.5)" : "var(--gold)",
          color: "var(--navy)",
          border: "none", borderRadius: "6px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px", fontWeight: 500,
          letterSpacing: "2px", textTransform: "uppercase",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
          transition: "background 0.3s, transform 0.15s",
        }}
        onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {status === "loading" ? (
          <>
            <span style={{
              display: "inline-block",
              width: "18px", height: "18px",
              border: "2px solid var(--navy)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            Sending...
          </>
        ) : "Send Message"}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        select option { background: #1A2E45; }
      `}</style>
    </form>
  );
}
