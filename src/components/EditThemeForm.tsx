// components/EditThemeForm.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Alert,
} from "@mui/material";
import axios from "axios"; // Ensure axios is installed
import { Theme } from "@/types/Theme";

interface EditThemeFormProps {
    theme: Theme;
}

const EditThemeForm: React.FC<EditThemeFormProps> = ({ theme }) => {
    const router = useRouter();
    const [name, setName] = useState(theme.name);
    const [description, setDescription] = useState(theme.description || "");
    const [monthArcColor, setMonthArcColor] = useState(theme.monthArcColor);
    const [eventArcColor, setEventArcColor] = useState(theme.eventArcColor);
    const [labelColor, setLabelColor] = useState(theme.labelColor);
    const [backgroundColor, setBackgroundColor] = useState(theme.backgroundColor);
    const [categoryColors, setCategoryColors] = useState<string[]>(theme.categoryColors || []);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleCategoryColorChange = (index: number, value: string) => {
        const updatedColors = [...categoryColors];
        updatedColors[index] = value;
        setCategoryColors(updatedColors);
    };

    const handleAddCategoryColor = () => {
        setCategoryColors([...categoryColors, "#000000"]);
    };

    const handleRemoveCategoryColor = (index: number) => {
        const updatedColors = categoryColors.filter((_, i) => i !== index);
        setCategoryColors(updatedColors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!name) {
            setError("Theme name is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.put(`/api/themes/${theme.id}`, {
                name,
                description: description || undefined,
                monthArcColor,
                eventArcColor,
                labelColor,
                backgroundColor,
                categoryColors,
            });

            if (response.status === 200) {
                setSuccess("Theme updated successfully!");
                // Optionally, redirect after a short delay
                setTimeout(() => {
                    router.push("/themes");
                }, 1500);
            }
        } catch (err: any) {
            console.error("Error updating theme:", err);
            setError(err.response?.data?.message || "Failed to update theme. Please try again.");
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
                    label="Theme Name"
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
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                        <TextField
                            label="Month Arc Color"
                            variant="outlined"
                            type="color"
                            fullWidth
                            value={monthArcColor}
                            onChange={(e) => setMonthArcColor(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Event Arc Color"
                            variant="outlined"
                            type="color"
                            fullWidth
                            value={eventArcColor}
                            onChange={(e) => setEventArcColor(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Label Color"
                            variant="outlined"
                            type="color"
                            fullWidth
                            value={labelColor}
                            onChange={(e) => setLabelColor(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Background Color"
                            variant="outlined"
                            type="color"
                            fullWidth
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Category Colors
                    </Typography>
                    {categoryColors.map((color, index) => (
                        <Box key={index} display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <TextField
                                label={`Color ${index + 1}`}
                                variant="outlined"
                                type="color"
                                value={color}
                                onChange={(e) => handleCategoryColorChange(index, e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ mr: 2 }}
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleRemoveCategoryColor(index)}
                                disabled={categoryColors.length === 1} // Prevent removing all colors
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}
                    <Button variant="contained" color="primary" onClick={handleAddCategoryColor}>
                        Add Category Color
                    </Button>
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Theme"}
                </Button>
            </Box>
        </>
    );
};

export default EditThemeForm;