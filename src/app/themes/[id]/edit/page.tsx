// app/themes/[id]/edit/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Adjust the import path based on your project structure
import { getThemeById } from "@/data/Theme";
import { Theme } from "@/types/Theme";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import EditThemeForm from "@/components/EditThemeForm"; // Client-side component to be created

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditThemePage({ params }: PageProps) {
    const { id } = params;
    const themeId = parseInt(id, 10);

    // Fetch the current session
    const session: any = await getServerSession(authOptions);

    // If no session exists, prompt the user to log in
    if (!session) {
        return (
            <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Edit Theme
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please log in to edit your themes.
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

    // Fetch the specific theme
    let theme: Theme | null = null;
    let error: string | null = null;

    try {
        theme = await getThemeById(themeId);
        if (!theme) {
            error = "Theme not found.";
        }
    } catch (err) {
        console.error("Error fetching theme:", err);
        error = "Failed to fetch theme details.";
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Typography variant="h6" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button variant="contained" color="primary" component={Link} href="/themes">
                    Back to Themes
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Theme
            </Typography>
            <EditThemeForm theme={theme!} />
        </Container>
    );
}