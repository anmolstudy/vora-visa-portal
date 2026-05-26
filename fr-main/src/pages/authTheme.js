// /**
//  * authTheme.js
//  *
//  * Shared MUI theme for Login and Signup pages.
//  * Edit this one file to update the look of all auth screens at once.
//  */

/**
 * authTheme.js
 *
 * Shared MUI theme for Login and Signup pages.
 * Updated to match main project green + dark theme.
 */

import { createTheme, alpha } from "@mui/material/styles";

export const authTheme = createTheme({
  palette: {
    primary: {
      main: "#285A48", // main green
      light: "#408A71",
      dark: "#1F4638",
    },
    secondary: {
      main: "#FF85BB", // soft pink accent (CTA)
      light: "#FFCEE3",
      dark: "#e96aa6",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#091413",
      secondary: "#5F6F6B",
    },
  },

  typography: {
    fontFamily: "'Playfair Display', Georgia, serif",
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    body1: { fontFamily: "'Lato', sans-serif" },
    body2: { fontFamily: "'Lato', sans-serif" },
    button: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      letterSpacing: 1.2,
    },
    caption: { fontFamily: "'Lato', sans-serif" },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "uppercase",
          letterSpacing: 1.5,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            fontFamily: "'Lato', sans-serif",

            "& fieldset": {
              borderColor: "#E5E7EB",
            },

            "&:hover fieldset": {
              borderColor: "#408A71",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#285A48",
              borderWidth: 2,
            },

            "&.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(40,90,72,0.15)",
            },
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontFamily: "'Lato', sans-serif",
        },
      },
    },
  },
});

// Updated Gradient Button (Green based)
export const submitButtonSx = {
  py: 1.6,
  background: "linear-gradient(135deg, #021A54 0%, #285A48 100%)",
  boxShadow: "0 8px 24px rgba(2,26,84,0.25)",

  "&:hover": {
    background: "linear-gradient(135deg, #01143F 0%, #1F4638 100%)",
    boxShadow: "0 12px 32px rgba(2,26,84,0.35)",
  },

  "&.Mui-disabled": {
    background: alpha("#285A48", 0.4),
  },
};
// import { createTheme, alpha } from "@mui/material/styles";

// export const authTheme = createTheme({
//   palette: {
//     primary: { main: "#0da150", light: "#19d228", dark: "#002171" },
//     secondary: { main: "#ea00ff", light: "#ff00f2", dark: "#e200e6" },
//     background: { default: "#F8FAFF", paper: "#FFFFFF" },
//   },
//   typography: {
//     fontFamily: "'Playfair Display', Georgia, serif",
//     h4: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
//     body1: { fontFamily: "'Lato', sans-serif" },
//     body2: { fontFamily: "'Lato', sans-serif" },
//     button: {
//       fontFamily: "'Lato', sans-serif",
//       fontWeight: 700,
//       letterSpacing: 1.2,
//     },
//     caption: { fontFamily: "'Lato', sans-serif" },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: "uppercase",
//           letterSpacing: 1.5,
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           "& .MuiOutlinedInput-root": {
//             borderRadius: 8,
//             fontFamily: "'Lato', sans-serif",
//             "&:hover fieldset": { borderColor: "#19d263" },
//             "&.Mui-focused fieldset": {
//               borderColor: "#324432",
//               borderWidth: 2,
//             },
//           },
//         },
//       },
//     },
//     MuiSelect: {
//       styleOverrides: {
//         root: { borderRadius: 8, fontFamily: "'Lato', sans-serif" },
//       },
//     },
//   },
// });

// // Gradient style used on submit buttons in Login + Signup
// export const submitButtonSx = {
//   py: 1.6,
//   background: "linear-gradient(90deg, #002171 0%, #0D47A1 100%)",
//   boxShadow: "0 8px 24px rgba(13,71,161,0.3)",
//   "&:hover": {
//     background: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
//     boxShadow: "0 12px 32px rgba(13,71,161,0.4)",
//   },
//   "&.Mui-disabled": { background: alpha("#0D47A1", 0.4) },
// };
