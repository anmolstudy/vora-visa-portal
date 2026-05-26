import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  Avatar,
  Fade,
  Zoom,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  SmartToy,
  Close,
  Send,
  Person,
  AutoAwesome,
} from "@mui/icons-material";

// Visa knowledge base for AI responses
const VISA_KNOWLEDGE = {
  student: {
    keywords: ["student", "study", "education", "university", "college", "course", "scholarship"],
    response: `**Student Visa Information:**

For a student visa, you typically need:
- Valid passport (6+ months validity)
- Acceptance letter from recognized institution
- Proof of financial support
- Academic transcripts & certificates
- English proficiency test (IELTS/TOEFL)
- Statement of Purpose (SOP)
- Medical examination report

**Processing Time:** 4-8 weeks
**Our Fee:** Starting from ₹15,000

Popular destinations: Canada, USA, UK, Australia, Germany

Would you like to book a free consultation?`
  },
  work: {
    keywords: ["work", "job", "employment", "career", "professional", "h1b", "skilled"],
    response: `**Work Visa Information:**

For a work visa, requirements include:
- Valid job offer from employer
- Educational qualifications proof
- Work experience letters
- Professional certifications
- Police clearance certificate
- Medical examination
- Sponsorship documents

**Processing Time:** 6-12 weeks
**Our Fee:** Starting from ₹25,000

Popular work visa types: H-1B (USA), Skilled Worker (UK), 482 (Australia)

Would you like us to help with your work visa application?`
  },
  tourist: {
    keywords: ["tourist", "travel", "visit", "vacation", "holiday", "trip", "tour"],
    response: `**Tourist Visa Information:**

For a tourist visa, you'll need:
- Valid passport
- Recent passport-size photographs
- Travel itinerary
- Hotel bookings
- Return flight tickets
- Bank statements (3-6 months)
- Travel insurance
- Cover letter

**Processing Time:** 2-4 weeks
**Our Fee:** Starting from ₹5,000

We handle tourist visas for 50+ countries!

Would you like to plan your trip?`
  },
  pr: {
    keywords: ["pr", "permanent", "residency", "immigration", "settle", "migrate", "citizen"],
    response: `**Permanent Residency (PR) Information:**

PR requirements vary by country, but generally include:
- Points-based assessment (age, education, experience)
- Language proficiency (IELTS/PTE)
- Educational Credential Assessment (ECA)
- Police clearance
- Medical examination
- Proof of funds
- Express Entry profile (Canada)

**Processing Time:** 6-18 months
**Our Fee:** Starting from ₹75,000

Top PR destinations: Canada, Australia, New Zealand, UK

Ready to start your immigration journey?`
  },
  documents: {
    keywords: ["document", "paper", "requirement", "need", "checklist", "prepare"],
    response: `**General Document Checklist:**

**Basic Documents:**
- Valid passport (6+ months validity)
- Passport-size photographs
- Birth certificate
- Educational certificates
- Employment letters

**Financial Documents:**
- Bank statements (6 months)
- Income tax returns
- Salary slips
- Property documents

**Supporting Documents:**
- Cover letter
- Travel insurance
- Medical reports
- Police clearance

Need help preparing your documents? Book a consultation!`
  },
  cost: {
    keywords: ["cost", "fee", "price", "charge", "payment", "expensive", "cheap", "money"],
    response: `**Our Service Fees:**

**Tourist Visa:** ₹5,000 - ₹15,000
**Student Visa:** ₹15,000 - ₹35,000
**Work Visa:** ₹25,000 - ₹50,000
**PR/Immigration:** ₹75,000 - ₹1,50,000

*Note: Embassy/Government fees are separate*

**Payment Options:**
- UPI / Net Banking
- Credit/Debit Cards
- EMI Available
- Flexible payment plans

All fees are transparent with no hidden charges!`
  },
  time: {
    keywords: ["time", "duration", "long", "fast", "quick", "process", "days", "weeks", "months"],
    response: `**Processing Times:**

**Tourist Visa:** 2-4 weeks
**Student Visa:** 4-8 weeks
**Work Visa:** 6-12 weeks
**PR Application:** 6-18 months

*Times may vary based on:*
- Country of destination
- Current visa backlogs
- Document completeness
- Time of year

We offer express processing for urgent cases!`
  },
  contact: {
    keywords: ["contact", "call", "phone", "email", "reach", "talk", "speak", "consultation"],
    response: `**Contact Us:**

📞 **Phone:** +91 98765 43210
📧 **Email:** support@voratravel.com
📍 **Office:** Punjab, India - 141001

**Office Hours:**
Mon - Sat: 9 AM - 6 PM
Sunday: Closed

💬 **WhatsApp:** Available for quick queries!

Book a FREE consultation on our Contact page!`
  }
};

const QUICK_QUESTIONS = [
  "Student visa requirements?",
  "Work visa process?",
  "Tourist visa cost?",
  "PR application steps?",
  "Processing time?",
];

const getAIResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // Check each category for matching keywords
  for (const [category, data] of Object.entries(VISA_KNOWLEDGE)) {
    for (const keyword of data.keywords) {
      if (lowerMessage.includes(keyword)) {
        return data.response;
      }
    }
  }

  // Default response
  return `Thank you for your query!

I can help you with:
- **Student Visas** - Study abroad guidance
- **Work Visas** - Employment-based immigration
- **Tourist Visas** - Travel & vacation planning
- **PR/Immigration** - Permanent residency applications
- **Document Preparation** - Checklist & verification

Please ask about any specific visa type or service, or contact us directly at **+91 98765 43210** for personalized assistance.

How can I help you today?`;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm your Visa Assistant. How can I help you today? Ask me about student visas, work permits, tourist visas, or immigration services!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Zoom in={!isOpen}>
        <Box
          onClick={() => setIsOpen(true)}
         sx={{
      position: "fixed",
      bottom: 24,
      right: 100, // ← shift left to avoid overlapping FABs (24 + 56 + 20 gap)
      zIndex: 1199,
      cursor: "pointer",
    }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(249, 115, 22, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 12px 40px rgba(249, 115, 22, 0.5)",
              },
            }}
          >
            <SmartToy sx={{ fontSize: 32, color: "white" }} />
          </Box>
          {/* Pulse animation */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2px solid #F97316",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", opacity: 1 },
                "100%": { transform: "scale(1.5)", opacity: 0 },
              },
            }}
          />
        </Box>
      </Zoom>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={24}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 100,
            width: { xs: "calc(100vw - 48px)", sm: 400 },
            height: { xs: "calc(100vh - 100px)", sm: 550 },
            maxHeight: 600,
            borderRadius: 4,
            overflow: "hidden",
            zIndex: 1001,
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
            boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "#F97316",
                  width: 40,
                  height: 40,
                }}
              >
                <SmartToy />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Visa Assistant
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#22C55E",
                    }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Online
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: "#F8FAFC",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: message.type === "user" ? "flex-end" : "flex-start",
                  gap: 1,
                }}
              >
                {message.type === "bot" && (
                  <Avatar
                    sx={{
                      bgcolor: "#F97316",
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: "80%",
                    borderRadius: 3,
                    bgcolor: message.type === "user" ? "#0F172A" : "white",
                    color: message.type === "user" ? "white" : "#1E293B",
                    border: message.type === "bot" ? "1px solid #E2E8F0" : "none",
                    whiteSpace: "pre-wrap",
                    "& strong": {
                      color: message.type === "user" ? "#F97316" : "#0F172A",
                      fontWeight: 700,
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.6, fontSize: "0.9rem" }}
                    dangerouslySetInnerHTML={{
                      __html: message.text
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </Paper>
                {message.type === "user" && (
                  <Avatar
                    sx={{
                      bgcolor: "#64748B",
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                    }}
                  >
                    <Person sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {isTyping && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "#F97316",
                    width: 32,
                    height: 32,
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: "white",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    gap: 0.5,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#94A3B8",
                        animation: "bounce 1.4s infinite",
                        animationDelay: `${i * 0.2}s`,
                        "@keyframes bounce": {
                          "0%, 60%, 100%": { transform: "translateY(0)" },
                          "30%": { transform: "translateY(-8px)" },
                        },
                      }}
                    />
                  ))}
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: "#F8FAFC",
                borderTop: "1px solid #E2E8F0",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Quick questions:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {QUICK_QUESTIONS.map((q, i) => (
                  <Chip
                    key={i}
                    label={q}
                    size="small"
                    onClick={() => {
                      setInput(q);
                    }}
                    sx={{
                      bgcolor: "white",
                      border: "1px solid #E2E8F0",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      "&:hover": {
                        bgcolor: "#FFF7ED",
                        borderColor: "#F97316",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about visas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "#F8FAFC",
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              sx={{
                bgcolor: "#F97316",
                color: "white",
                "&:hover": { bgcolor: "#EA580C" },
                "&:disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" },
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
