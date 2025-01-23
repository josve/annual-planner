// lib/theme.ts

import { createTheme } from "@mui/material/styles";

// Define the color palette
const theme = createTheme({
    palette: {
        primary: {
            main: "#53A045", // Main color 1
            light: "#58CD83", // Main color 2
        },
        secondary: {
            main: "#55559C", // Base color
        },
        background: {
            default: "#FFFFFF", // Base background color
            paper: "#FFFFFF", // Paper background color
        },
        success: {
            main: "#ADFFAA", // Accent color
        },
        info: {
            main: "#005530", // Accent color
        },
        warning: {
            main: "#F6E400", // Accent color
        },
        error: {
            main: "#E85429", // Accent color
        },
        // Additional custom colors can be added here
    },
    typography: {
        fontFamily: '"Karla", sans-serif', // Default font
        h1: {
            fontFamily: '"Karla", sans-serif',
            letterSpacing: "-0.02em", // Adjusted letter spacing
            lineHeight: 1.2, // 90% of point size
            fontWeight: 700,
        },
        h2: {
            fontFamily: '"Karla", sans-serif',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
        },
        h3: {
            fontFamily: '"Karla", sans-serif',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
        },
        h4: {
            fontFamily: '"MPDisplay", sans-serif',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
        },
        h5: {
            fontFamily: '"Karla", sans-serif',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
        },
        h6: {
            fontFamily: '"Karla", sans-serif',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
        },
        body1: {
            fontFamily: '"Karla", sans-serif',
            lineHeight: 1.4, // 140% of point size
        },
        body2: {
            fontFamily: '"Karla", sans-serif',
            lineHeight: 1.4,
        },
        button: {
            fontFamily: '"Karla", sans-serif',
            textTransform: "none",
        },
        // You can customize other typography variants as needed
    },
    components: {
        MuiTypography: {
            defaultProps: {
                // Ensure all Typography variants use the theme settings
                variantMapping: {
                    h1: "h1",
                    h2: "h2",
                    h3: "h3",
                    h4: "h4",
                    h5: "h5",
                    h6: "h6",
                    subtitle1: "h6",
                    subtitle2: "h6",
                    body1: "p",
                    body2: "p",
                    button: "span",
                },
            },
        },
        // Additional component overrides can be added here
    },
});

export default theme;