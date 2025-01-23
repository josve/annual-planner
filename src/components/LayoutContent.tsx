"use client";

import React from "react";
import {Container, Box} from "@mui/material";

interface LayoutContentProps {
    children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
    return (
        <Container style={{
            marginTop: '70px',
            marginBottom: '70px',
            minHeight: 'calc(var(--vh, 1vh) * 100 - 140px)',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            boxSizing: 'border-box',
        }}>
            <Box
                sx={{
                    backgroundColor: "var(--white)", // Ensure this matches your theme's background
                    display: "flex",
                    paddingTop: "10px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    flexDirection: "column",
                    justifyContent: "top",
                }}
            >
                {children}
            </Box>
        </Container>
    );
};

export default LayoutContent;