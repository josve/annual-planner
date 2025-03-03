// app/themes/[id]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Adjust the import path based on your project structure
import { getThemeById } from "@/data/Theme";
import { Theme } from "@/types/Theme";
import Link from "next/link";
import {
    Container,
    Typography,
    Box,
    Chip,
    Button,
    Grid,
} from "@mui/material";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ViewThemePage({ params }: PageProps) {
    const { id } = await params;
    const themeId = parseInt(id, 10);

    // Fetch the specific theme
    const theme: Theme | null = await getThemeById(themeId);

    if (!theme) {
        notFound();
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Theme Details
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        color="secondary"
                        component={Link}
                        href={`/themes/${theme.id}/edit`}
                        sx={{ mr: 2 }}
                    >
                        Edit Theme
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        component={Link}
                        href={`/themes`}
                    >
                        Back to Themes
                    </Button>
                </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {theme.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {theme.description || "No description provided."}
                </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Colors
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <Chip
                            label="Month Arc Color"
                            sx={{
                                backgroundColor: theme.monthArcColor,
                                color: getContrastColor(theme.monthArcColor),
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Chip
                            label="Event Arc Color"
                            sx={{
                                backgroundColor: theme.eventArcColor,
                                color: getContrastColor(theme.eventArcColor),
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Chip
                            label="Label Color"
                            sx={{
                                backgroundColor: theme.labelColor,
                                color: getContrastColor(theme.labelColor),
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Chip
                            label="Background Color"
                            sx={{
                                backgroundColor: theme.backgroundColor,
                                color: getContrastColor(theme.backgroundColor),
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box>
                <Typography variant="h6" gutterBottom>
                    Category Colors
                </Typography>
                <Grid container spacing={2}>
                    {theme.categoryColors && theme.categoryColors.length > 0 ? (
                        theme.categoryColors.map((color, index) => (
                            <Grid item key={index}>
                                <Chip
                                    label={`Category ${index + 1}`}
                                    sx={{
                                        backgroundColor: color,
                                        color: getContrastColor(color),
                                    }}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body2">No category colors defined.</Typography>
                    )}
                </Grid>
            </Box>
        </Container>
    );
}

// Utility function to determine text color based on background color for readability
function getContrastColor(hexColor: string): string {
    // Remove '#' if present
    hexColor = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
}