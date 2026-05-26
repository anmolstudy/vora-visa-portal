/**
 * FAQ.jsx
 *
 * Interactive FAQ page with:
 *   - Live search bar with autocomplete suggestions
 *   - Category filter tabs (sticky header)
 *   - Expand / collapse all buttons
 *   - "Was this helpful?" thumbs on each answer
 *   - Copy answer + share via WhatsApp / email actions
 *
 * All FAQ data is imported from faqData.jsx
 */

import { useState, useEffect, useMemo } from "react";
import {
  Alert, Box, Button, Chip, Container, Divider, IconButton,
  InputBase, Paper, Snackbar, Tooltip, Typography,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import {
  Close, ContentCopy, Email, ExpandMore, HelpOutline,
  LocalFireDepartment, LocationOn, Phone, Search, SupportAgent,
  ThumbDown, ThumbUp, WhatsApp,
} from "@mui/icons-material";
import { CATS, CAT_ICONS, FAQ_DATA } from "./faqData";

// ── Theme ────────────────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    primary:    { main: "#0D47A1", light: "#1976D2", dark: "#002171" },
    secondary:  { main: "#FF6F00", light: "#FFA000", dark: "#E65100" },
    background: { default: "#F8FAFF" },
  },
  typography: {
    fontFamily: "'Playfair Display', Georgia, serif",
    body1:  { fontFamily: "'Lato', sans-serif" },
    body2:  { fontFamily: "'Lato', sans-serif" },
    button: { fontFamily: "'Lato', sans-serif", fontWeight: 700 },
    caption:{ fontFamily: "'Lato', sans-serif" },
  },
});

// Scroll-reveal CSS injected once
const REVEAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@300;400;700&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .rv { opacity:0; transform:translateY(22px); transition: opacity .6s ease, transform .6s ease; }
  .rv.on { opacity:1; transform:translateY(0); }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────

// Wraps matching text in a yellow highlight mark
function Highlight({ text, query }) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <Box key={i} component="mark" sx={{ bgcolor: "#FFF3CD", color: "inherit", borderRadius: "3px", px: .3 }}>{part}</Box>
      : part
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [activeCat,  setActiveCat]  = useState("All");
  const [query,      setQuery]      = useState("");
  const [openItems,  setOpenItems]  = useState({ 1: true }); // item 1 open by default
  const [helpVotes,  setHelpVotes]  = useState({});          // { [id]: "yes" | "no" }
  const [snack,      setSnack]      = useState({ open: false, msg: "" });
  const [suggestions,setSuggestions]= useState([]);
  const [showSugg,   setShowSugg]   = useState(false);

  // Scroll-reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });

  // Live search suggestions
  useEffect(() => {
    if (query.trim().length > 1) {
      const matches = FAQ_DATA.filter((f) => f.q.toLowerCase().includes(query.toLowerCase())).slice(0, 4);
      setSuggestions(matches);
      setShowSugg(matches.length > 0);
    } else {
      setShowSugg(false);
    }
  }, [query]);

  // Filter items by category and search query
  const filtered = useMemo(() => {
    let list = activeCat === "All" ? FAQ_DATA : FAQ_DATA.filter((f) => f.cat === activeCat);
    if (query.trim()) {
      list = list.filter((f) =>
        f.q.toLowerCase().includes(query.toLowerCase()) ||
        f.a.toLowerCase().includes(query.toLowerCase())
      );
    }
    return list;
  }, [activeCat, query]);

  // ── Handlers ──
  const toggle      = (id) => setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  const expandAll   = () => { const o = {}; filtered.forEach((f) => (o[f.id] = true)); setOpenItems(o); };
  const collapseAll = () => setOpenItems({});
  const markHelp = (id, vote) => {
    setHelpVotes((prev) => ({ ...prev, [id]: vote }));
    setSnack({ open: true, msg: vote === "yes" ? "Thanks for your feedback! 👍" : "We'll work to improve this answer." });
  };
  const copyAnswer = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setSnack({ open: true, msg: "Answer copied to clipboard!" });
  };
  const pickSuggestion = (item) => {
    setQuery(item.q); setShowSugg(false); setActiveCat("All");
    setOpenItems((prev) => ({ ...prev, [item.id]: true }));
  };

  return (
    <ThemeProvider theme={theme}>
      <style>{REVEAL_CSS}</style>
      <Box sx={{ bgcolor: "#F8FAFF", minHeight: "100vh" }}>

        {/* ── Hero with search bar ── */}
        <Box sx={{ background: "linear-gradient(135deg, #002171 0%, #0D47A1 50%, #1565C0 100%)", color: "white", pt: { xs: 10, md: 13 }, pb: { xs: 8, md: 11 }, position: "relative", overflow: "hidden", textAlign: "center" }}>
          {/* Decorative rings */}
          {[400, 260, 140].map((size, i) => (
            <Box key={i} sx={{ position: "absolute", borderRadius: "50%", width: size, height: size, border: "1px solid rgba(255,255,255,0.07)", top: ["-130px", "-30px", "70px"][i], right: ["-130px", "40px", "200px"][i], pointerEvents: "none" }} />
          ))}
          <Box sx={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 64, background: "linear-gradient(to bottom right, transparent 49%, #F8FAFF 50%)" }} />

          <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 3, opacity: .6 }}>
              <LocationOn sx={{ fontSize: 15 }} />
              <Typography variant="caption" sx={{ fontFamily: "'Lato', sans-serif", letterSpacing: 2 }}>HOME / FAQ</Typography>
            </Box>

            <Box sx={{ animation: "fadeUp .8s ease both" }}>
              <Chip label="HELP CENTER" sx={{ mb: 2.5, bgcolor: "rgba(255,255,255,0.13)", color: "white", letterSpacing: 3, fontSize: ".72rem", fontFamily: "'Lato', sans-serif" }} />
              <Typography variant="h1" sx={{ fontSize: { xs: "2.4rem", md: "3.4rem" }, color: "white", lineHeight: 1.15, mb: 2 }}>
                Frequently Asked<br />
                <Box component="span" sx={{ color: "transparent", background: "linear-gradient(90deg,#FFB300,#FF6F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Questions
                </Box>
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,.82)", fontSize: "1.1rem", lineHeight: 1.85, mb: 5, maxWidth: 500, mx: "auto", fontFamily: "'Lato', sans-serif" }}>
                Quick answers to everything about our visa, passport, and travel services.
              </Typography>

              {/* Search bar with autocomplete suggestions */}
              <Box sx={{ position: "relative", maxWidth: 540, mx: "auto" }}>
                <Paper elevation={0} sx={{ display: "flex", alignItems: "center", px: 2.5, py: 1.2, borderRadius: "14px", bgcolor: "white", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
                  <Search sx={{ color: alpha("#0D47A1", .4), mr: 1.5, fontSize: 22 }} />
                  <InputBase
                    fullWidth
                    placeholder="Search your question…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => suggestions.length && setShowSugg(true)}
                    sx={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem", color: "#1a1a2e" }}
                  />
                  {query && (
                    <IconButton size="small" onClick={() => { setQuery(""); setShowSugg(false); }} sx={{ color: alpha("#1a1a2e", .3) }}>
                      <Close sx={{ fontSize: 17 }} />
                    </IconButton>
                  )}
                </Paper>

                {/* Suggestions dropdown */}
                {showSugg && (
                  <Paper elevation={8} sx={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, borderRadius: "12px", overflow: "hidden", zIndex: 200, border: "1px solid", borderColor: alpha("#0D47A1", .1) }}>
                    {suggestions.map((s, i) => (
                      <Box key={s.id} onClick={() => pickSuggestion(s)} sx={{ px: 3, py: 1.8, cursor: "pointer", display: "flex", alignItems: "center", gap: 2, borderBottom: i < suggestions.length - 1 ? "1px solid" : "none", borderColor: alpha("#0D47A1", .07), "&:hover": { bgcolor: alpha("#0D47A1", .04) } }}>
                        <Search sx={{ fontSize: 15, color: "text.disabled" }} />
                        <Typography variant="body2" sx={{ fontFamily: "'Lato', sans-serif", color: "#1a1a2e" }}>{s.q}</Typography>
                        <Chip label={s.cat} size="small" sx={{ ml: "auto", fontSize: ".65rem", height: 20 }} />
                      </Box>
                    ))}
                  </Paper>
                )}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ── Sticky category filter bar ── */}
        <Box sx={{ bgcolor: "white", py: 2.5, borderBottom: "1px solid", borderColor: alpha("#0D47A1", .08), position: "sticky", top: 0, zIndex: 100, boxShadow: `0 2px 12px ${alpha("#0D47A1", .06)}` }}>
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
              {CATS.map((cat) => {
                const isActive = activeCat === cat;
                const count    = cat === "All" ? FAQ_DATA.length : FAQ_DATA.filter((f) => f.cat === cat).length;
                return (
                  <Button
                    key={cat}
                    onClick={() => { setActiveCat(cat); setQuery(""); }}
                    startIcon={<Box sx={{ "& svg": { fontSize: "17px !important" }, display: "flex" }}>{CAT_ICONS[cat]}</Box>}
                    sx={{
                      fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: ".82rem",
                      borderRadius: "50px", px: 2.5, py: .9, textTransform: "none",
                      color: isActive ? "white" : "#444",
                      bgcolor: isActive ? "primary.main" : "transparent",
                      border: "1.5px solid",
                      borderColor: isActive ? "primary.main" : alpha("#0D47A1", .15),
                      transition: "all .2s ease",
                      "&:hover": { bgcolor: isActive ? "primary.dark" : alpha("#0D47A1", .06), borderColor: "primary.main" },
                    }}
                  >
                    {cat} <Box component="span" sx={{ ml: .75, fontSize: ".7rem", opacity: .7 }}>({count})</Box>
                  </Button>
                );
              })}
            </Box>
          </Container>
        </Box>

        {/* ── FAQ list ── */}
        <Container maxWidth="md" sx={{ py: { xs: 7, md: 9 } }}>

          {/* Toolbar row: result count + expand/collapse buttons */}
          <Box className="rv" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "1.8rem" } }}>
                {activeCat === "All" ? "All Questions" : activeCat}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mt: .4, fontFamily: "'Lato', sans-serif" }}>
                {filtered.length} question{filtered.length !== 1 ? "s" : ""}{query ? ` matching "${query}"` : ""}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button size="small" variant="outlined" color="primary" onClick={expandAll}
                sx={{ borderRadius: "8px", fontSize: ".8rem", px: 2.5, textTransform: "none", fontWeight: 700 }}>
                Expand All
              </Button>
              <Button size="small" variant="outlined" onClick={collapseAll}
                sx={{ borderRadius: "8px", fontSize: ".8rem", px: 2.5, textTransform: "none", fontWeight: 700, color: "#555", borderColor: alpha("#000", .12) }}>
                Collapse All
              </Button>
            </Box>
          </Box>

          {/* Empty state */}
          {filtered.length === 0 && (
            <Box className="rv" sx={{ textAlign: "center", py: 12 }}>
              <HelpOutline sx={{ fontSize: 52, color: alpha("#0D47A1", .15), mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1.5 }}>No results found</Typography>
              <Typography color="text.secondary" sx={{ mb: 4, fontFamily: "'Lato', sans-serif" }}>
                Try a different keyword or browse all categories above.
              </Typography>
              <Button variant="outlined" color="primary" onClick={() => { setQuery(""); setActiveCat("All"); }}>
                Clear Filters
              </Button>
            </Box>
          )}

          {/* FAQ accordion items */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map((faq, idx) => {
              const isOpen = !!openItems[faq.id];
              return (
                <Box key={faq.id} className="rv" style={{ transitionDelay: `${idx * 0.04}s` }}>
                  <Paper elevation={0} sx={{
                    borderRadius: "16px", overflow: "hidden", border: "2px solid",
                    borderColor: isOpen ? "primary.main" : alpha("#0D47A1", .1),
                    boxShadow: isOpen ? `0 6px 28px ${alpha("#0D47A1", .12)}` : "none",
                    bgcolor: "white", transition: "all .25s ease",
                  }}>
                    {/* Question header row — click to toggle */}
                    <Box
                      onClick={() => toggle(faq.id)}
                      sx={{ display: "flex", alignItems: "center", gap: 2.5, px: { xs: 3, md: 4 }, py: 3, cursor: "pointer", bgcolor: isOpen ? alpha("#0D47A1", .03) : "white", "&:hover": { bgcolor: alpha("#0D47A1", .03) } }}
                    >
                      {/* Category icon */}
                      <Box sx={{ width: 44, height: 44, borderRadius: "12px", flexShrink: 0, bgcolor: isOpen ? "primary.main" : alpha("#0D47A1", .07), display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s ease", "& svg": { fontSize: 22, color: isOpen ? "white" : alpha("#0D47A1", .5) } }}>
                        {faq.icon}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                          <Typography sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: { xs: "1rem", md: "1.05rem" }, color: isOpen ? "#002171" : "#1a1a2e", lineHeight: 1.55 }}>
                            <Highlight text={faq.q} query={query} />
                          </Typography>
                          {faq.popular && (
                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: .5, bgcolor: alpha("#FF6F00", .1), borderRadius: "6px", px: 1, py: .3, flexShrink: 0 }}>
                              <LocalFireDepartment sx={{ fontSize: 12, color: "#FF6F00" }} />
                              <Typography sx={{ fontSize: ".68rem", color: "#FF6F00", fontFamily: "'Lato', sans-serif", fontWeight: 700 }}>Popular</Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: "#888", fontFamily: "'Lato', sans-serif", mt: .3, fontSize: ".85rem" }}>{faq.cat}</Typography>
                      </Box>

                      {/* Expand / collapse icon button */}
                      <Box sx={{ width: 34, height: 34, borderRadius: "10px", flexShrink: 0, bgcolor: isOpen ? "primary.main" : alpha("#0D47A1", .07), display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s ease" }}>
                        <ExpandMore sx={{ fontSize: 20, color: isOpen ? "white" : alpha("#0D47A1", .5), transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .25s ease" }} />
                      </Box>
                    </Box>

                    {/* Answer section — shown when isOpen */}
                    {isOpen && (
                      <Box sx={{ px: { xs: 3, md: 4 }, pb: 3.5 }}>
                        <Divider sx={{ mb: 3, borderColor: alpha("#0D47A1", .08) }} />
                        <Typography sx={{ lineHeight: 1.95, color: "#333", mb: 3.5, fontFamily: "'Lato', sans-serif", fontSize: "1rem" }}>
                          <Highlight text={faq.a} query={query} />
                        </Typography>

                        {/* Feedback + share actions */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                          <Typography variant="body2" sx={{ color: "#888", fontFamily: "'Lato', sans-serif" }}>Was this helpful?</Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button size="small" startIcon={<ThumbUp sx={{ fontSize: "14px !important" }} />}
                              variant={helpVotes[faq.id] === "yes" ? "contained" : "outlined"} color="primary"
                              disabled={!!helpVotes[faq.id]} onClick={() => markHelp(faq.id, "yes")}
                              sx={{ borderRadius: "20px", px: 2, py: .5, fontSize: ".8rem", fontFamily: "'Lato', sans-serif", textTransform: "none", fontWeight: 700 }}>
                              Yes
                            </Button>
                            <Button size="small" startIcon={<ThumbDown sx={{ fontSize: "14px !important" }} />}
                              variant={helpVotes[faq.id] === "no" ? "contained" : "outlined"} color="inherit"
                              disabled={!!helpVotes[faq.id]} onClick={() => markHelp(faq.id, "no")}
                              sx={{ borderRadius: "20px", px: 2, py: .5, fontSize: ".8rem", fontFamily: "'Lato', sans-serif", textTransform: "none", fontWeight: 700, color: "#666" }}>
                              No
                            </Button>
                          </Box>

                          <Box sx={{ ml: "auto", display: "flex", gap: .5 }}>
                            <Tooltip title="Copy answer">
                              <IconButton size="small" onClick={() => copyAnswer(faq.a)} sx={{ color: "#bbb", "&:hover": { color: "primary.main" } }}>
                                <ContentCopy sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Share on WhatsApp">
                              <IconButton size="small"
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(faq.q + "\n\n" + faq.a)}`, "_blank")}
                                sx={{ color: "#bbb", "&:hover": { color: "#25D366" } }}>
                                <WhatsApp sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Share via Email">
                              <IconButton size="small"
                                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(faq.q)}&body=${encodeURIComponent(faq.a)}`, "_blank")}
                                sx={{ color: "#bbb", "&:hover": { color: "primary.main" } }}>
                                <Email sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Container>

        {/* ── CTA ── */}
        <Box sx={{ bgcolor: "#FFF8E1", py: { xs: 8, md: 10 } }}>
          <Container maxWidth="sm">
            <Box className="rv" sx={{ textAlign: "center", background: "linear-gradient(135deg,#E65100,#FF6F00,#FFB300)", borderRadius: "28px", py: { xs: 7, md: 8 }, px: { xs: 3, md: 5 }, color: "white", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(255,111,0,.3)" }}>
              <Box sx={{ position: "absolute", top: -50, right: -50, opacity: .08, pointerEvents: "none" }}>
                <SupportAgent sx={{ fontSize: 240 }} />
              </Box>
              <Chip label="STILL HAVE QUESTIONS?" sx={{ mb: 3, bgcolor: "rgba(255,255,255,.18)", color: "white", letterSpacing: 2, fontSize: ".68rem", fontFamily: "'Lato', sans-serif" }} />
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2 }}>Talk to Our Experts</Typography>
              <Typography sx={{ opacity: .9, mb: 4, lineHeight: 1.85, fontFamily: "'Lato', sans-serif" }}>
                Free consultation available. Our visa experts are here Monday–Saturday, 9 AM–7 PM.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Button variant="contained" size="large" startIcon={<Phone />}    sx={{ bgcolor: "white", color: "#FF6F00", px: 3.5, py: 1.4, borderRadius: "10px" }}>Call Us</Button>
                <Button variant="outlined"  size="large" startIcon={<WhatsApp />} sx={{ borderColor: "white", color: "white", px: 3.5, py: 1.4, borderRadius: "10px" }}>WhatsApp</Button>
                <Button variant="outlined"  size="large" startIcon={<Email />}    sx={{ borderColor: "white", color: "white", px: 3.5, py: 1.4, borderRadius: "10px" }}>Email Us</Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Feedback snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3500}
          onClose={() => setSnack({ open: false, msg: "" })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setSnack({ open: false, msg: "" })} severity="success" sx={{ borderRadius: "10px", fontFamily: "'Lato', sans-serif" }}>
            {snack.msg}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
}
