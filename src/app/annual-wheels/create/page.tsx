// app/annual-wheels/create/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Adjust the import path based on your project structure
import { getAllThemes } from "@/data/Theme";
import { Theme } from "@/types/Theme";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import CreateAnnualWheelForm from "@/components/CreateAnnualWheelForm"; // Client-side component to be created
import React from "react";

export default async function CreateAnnualWheelPage() {
    // Fetch all themes
    let themes: Theme[] = [];
    let error: string | null = null;

    try {
        themes = await getAllThemes();
    } catch (err) {
        console.error("Error fetching themes:", err);
        error = "Failed to fetch themes. Please try again later.";
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Annual Wheel
            </Typography>
            {error ? (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        href="/"
                        sx={{ mt: 2 }}
                    >
                        Back to Home
                    </Button>
                </Box>
            ) : (
                <CreateAnnualWheelForm themes={themes} />
            )}
        </Container>
    );
}