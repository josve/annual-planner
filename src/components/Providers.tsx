"use client"; // Mark this as a client component

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/lib/theme";
import {Session} from "next-auth";
import {SessionProvider} from "next-auth/react"; // Adjust the path if necessary

interface ProvidersProps {
    children: React.ReactNode;
    session: Session | null;
}

const Providers: React.FC<ProvidersProps> = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
};

export default Providers;