import * as React from "react";
import API from "../services/api/axios.config.js";

import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Container,
  Paper,
} from "@mui/material";

export default function ContactUsForm() {
  // 🔹 Controlled States
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/contact", {
        name,
        email,
        phone,
        subject,
        reason: subject,
        message,
      });

      alert("Message sent successfully!");

      // 🔹 Clear form after success
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#f8fafc" }}>
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Contact Us
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Name */}
            <TextField
              label="Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email */}
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Phone */}
            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Subject */}
            <TextField
              label="Subject"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            {/* Reason Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Reason</InputLabel>
              <Select
                value={subject}
                label="Reason"
                onChange={(e) => setSubject(e.target.value)}
              >
                <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                <MenuItem value="Visa">Visa</MenuItem>
                <MenuItem value="Training">Training</MenuItem>
                <MenuItem value="Assistance">Assistance</MenuItem>
                <MenuItem value="Feedback">Feedback</MenuItem>
              </Select>
            </FormControl>

            {/* Message */}
            <TextField
              label="Message"
              multiline
              rows={5}
              fullWidth
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                }}
              >
                Send Message
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
