// app/themes/create/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Adjust the import path based on your project structure
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import EditThemeForm from "@/components/EditThemeForm"; // Client-side component to be created
import React from "react";

export default async function CreateThemePage() {
    // Fetch the current session
    const session: any = await getServerSession(authOptions);

    // If no session exists, prompt the user to log in
    if (!session) {
        return (
            <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Create Theme
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please log in to create a new theme.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href="/login"
                    sx={{ mt: 4 }}
                >
                    Log In
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Theme
            </Typography>
            <EditThemeForm mode="create" />
        </Container>
    );
}