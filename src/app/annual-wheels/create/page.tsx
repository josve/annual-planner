// app/annual-wheels/create/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createAnnualWheel } from "@/data/AnnualWheel";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
} from "@mui/material";

export default function CreateAnnualWheelPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [themeId, setThemeId] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!name || !year || !themeId) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            // Replace with your actual user ID retrieval method
            // For server components, you should pass the user ID via props or context
            // Here, assuming that you have access to the user ID from the session
            // Alternatively, you can fetch the session within a client component using useSession
            // For simplicity, this example omits session retrieval
            const userId = 1; // Placeholder: Replace with actual user ID

            await createAnnualWheel(name, description || null, userId, year, Number(themeId));
            router.push("/"); // Redirect to the home page or Annual Wheels list
        } catch (err) {
            console.error("Error creating annual wheel:", err);
            setError("Failed to create Annual Wheel. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Annual Wheel
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Year"
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Theme ID"
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    value={themeId}
                    onChange={(e) => setThemeId(e.target.value ? Number(e.target.value) : "")}
                    sx={{ mb: 3 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Create Annual Wheel
                </Button>
            </Box>
        </Container>
    );
}