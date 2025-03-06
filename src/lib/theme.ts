import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#53A045",
            light: "#58CD83",
        },
        secondary: {
            main: "#55559C",
        },
        background: {
            default: "#FFFFFF",
            paper: "#FFFFFF",
        },
        success: {
            main: "#ADFFAA",
        },
        info: {
            main: "#005530",
        },
        warning: {
            main: "#F6E400",
        },
        error: {
            main: "#E85429",
        },
    },
    typography: {
        fontFamily: '"Karla", sans-serif',
        h1: {
            fontFamily: '"Karla", sans-serif',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
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
            lineHeight: 1.4,
        },
        body2: {
            fontFamily: '"Karla", sans-serif',
            lineHeight: 1.4,
        },
        button: {
            fontFamily: '"Karla", sans-serif',
            textTransform: "none",
        },
    },
    components: {
        MuiTypography: {
            defaultProps: {
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
    },
});

export default theme;