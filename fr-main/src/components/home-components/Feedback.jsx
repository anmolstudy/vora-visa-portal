import React from "react";
import { Box, Typography, Avatar, Paper, Container } from "@mui/material";
import { Star } from "@mui/icons-material";

const reviews = [
  {
    name: "Sukhi Maan",
    avatarUrl: "https://picsum.photos/50?random=1",
    time: "3 years ago",
    rating: 5,
    comment:
      "Best service ever in all over Punjab and they also gave me good guidance about my future.",
  },
  {
    name: "J00ar Singh",
    avatarUrl: "https://picsum.photos/50?random=2",
    time: "3 years ago",
    rating: 5,
    comment:
      "I have very good experience with Pathwayz Immigration. I totally satisfy with the services.",
  },
  {
    name: "Unti Goel",
    avatarUrl: "https://picsum.photos/50?random=3",
    time: "3 years ago",
    rating: 5,
    comment:
      "I need to express gratitude toward Entire group of Pathway Immigration for assisting me.",
  },
];

const ReviewsSlider = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#f8fafc", overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={700} align="center" gutterBottom>
          Feedback From Our Clients
        </Typography>

        <Box
          sx={{
            width: 80,
            height: 4,
            backgroundColor: "primary.main",
            mx: "auto",
            mb: 6,
            borderRadius: 2,
          }}
        />

        {/* Scrolling Wrapper */}
        <Box
          sx={{
            display: "flex",
            width: "max-content",
            animation: "scroll 25s linear infinite",
            "&:hover": {
              animationPlayState: "paused",
            },
            "@keyframes scroll": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-50%)" },
            },
          }}
        >
          {/* Duplicate reviews for seamless loop */}
          {[...reviews, ...reviews].map((review, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                width: 350,
                p: 4,
                borderRadius: 4,
                mx: 2,
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar src={review.avatarUrl} sx={{ mr: 2 }}>
                  {review.name[0]}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{review.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.time}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", mb: 2 }}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} sx={{ color: "#f59e0b" }} />
                ))}
              </Box>

              <Typography variant="body2" color="text.secondary">
                {review.comment}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ReviewsSlider;
