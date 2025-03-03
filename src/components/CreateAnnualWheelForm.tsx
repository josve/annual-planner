// components/CreateAnnualWheelForm.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    TextField,
    Button,
    Box,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { Theme } from "@/types/Theme";
import {createAnnualWheelAction} from "@/app/lib/annualWheelsActions";

interface CreateAnnualWheelFormProps {
    themes: Theme[];
}

const CreateAnnualWheelForm: React.FC<CreateAnnualWheelFormProps> = ({ themes }) => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [themeId, setThemeId] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!name.trim() || !year || !themeId) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await createAnnualWheelAction({
                name,
                description: description || undefined,
                year,
                themeId: Number(themeId),
            });

            if (response.status === 201) {
                setSuccess("Annual Wheel created successfully!");
                // Optionally, redirect after a short delay
                setTimeout(() => {
                    router.push("/annual-wheels");
                }, 1500);
            }
        } catch (err: any) {
            console.error("Error creating Annual Wheel:", err);
            setError(
                err.response?.data?.message ||
                "Failed to create Annual Wheel. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Namn"
                    variant="outlined"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Beskrivning"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="År"
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    sx={{ mb: 3 }}
                />
                <FormControl fullWidth required sx={{ mb: 3 }}>
                    <InputLabel id="theme-select-label">Tema</InputLabel>
                    <Select
                        labelId="theme-select-label"
                        id="theme-select"
                        value={themeId}
                        label="Tema"
                        onChange={(e) => setThemeId(e.target.value as number)}
                    >
                        {themes.map((theme) => (
                            <MenuItem key={theme.id} value={theme.id}>
                                {theme.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Skapar..." : "Skapa"}
                </Button>
            </Box>
        </>
    );
};

export default CreateAnnualWheelForm;