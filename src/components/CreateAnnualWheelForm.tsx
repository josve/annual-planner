"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    TextField,
    Button,
    Box,
    Alert,
} from "@mui/material";
import {createAnnualWheelAction} from "@/app/lib/annualWheelsActions";

interface CreateAnnualWheelFormProps {
}

const CreateAnnualWheelForm: React.FC<CreateAnnualWheelFormProps> = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!name.trim() || !year) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await createAnnualWheelAction({
                name,
                description: description || undefined,
                year,
            });

            if (response.status === 201) {
                setSuccess("Annual Wheel created successfully!");
                // Optionally, redirect after a short delay
                setTimeout(() => {
                    router.push("/annual-wheels/" + response?.annualWheel?.id);
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