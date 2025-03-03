// components/EditThemeForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Alert,
} from "@mui/material";
import axios from "axios";
import { Theme } from "@/types/Theme";
import {updateThemeAction} from "@/app/lib/themesActions";

interface EditThemeFormProps {
    mode: "create" | "edit";
    theme?: Theme; // Optional; required only in 'edit' mode
}

const EditThemeForm: React.FC<EditThemeFormProps> = ({ mode, theme }) => {
    const router = useRouter();

    // Initialize state based on mode
    const [name, setName] = useState(mode === "edit" && theme ? theme.name : "");
    const [description, setDescription] = useState(mode === "edit" && theme ? theme.description || "" : "");
    const [monthArcColor, setMonthArcColor] = useState(
        mode === "edit" && theme ? theme.monthArcColor : "#53A045"
    );
    const [eventArcColor, setEventArcColor] = useState(
        mode === "edit" && theme ? theme.eventArcColor : "#F6E400"
    );
    const [labelColor, setLabelColor] = useState(
        mode === "edit" && theme ? theme.labelColor : "#000000"
    );
    const [backgroundColor, setBackgroundColor] = useState(
        mode === "edit" && theme ? theme.backgroundColor : "#FFFFFF"
    );
    const [categoryColors, setCategoryColors] = useState<string[]>(
        mode === "edit" && theme && theme.categoryColors && theme.categoryColors.length > 0
            ? theme.categoryColors
            : ["#FF5733", "#33FF57", "#3357FF"]
    );
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (mode === "edit" && theme) {
            setName(theme.name);
            setDescription(theme.description || "");
            setMonthArcColor(theme.monthArcColor);
            setEventArcColor(theme.eventArcColor);
            setLabelColor(theme.labelColor);
            setBackgroundColor(theme.backgroundColor);
            setCategoryColors(theme.categoryColors || []);
        }
    }, [mode, theme]);

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
        if (!name.trim()) {
            setError("Theme name is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            let response;
            if (mode === "edit" && theme) {
                // Update existing theme
                await updateThemeAction(theme.id, {
                    name,
                    description: description || undefined,
                    monthArcColor,
                    eventArcColor,
                    labelColor,
                    backgroundColor,
                    categoryColors,
                });
                response = {
                    status: 201
                };
            } else {
                // Create new theme
                response = await axios.post(`/api/themes`, {
                    name,
                    description: description || undefined,
                    monthArcColor,
                    eventArcColor,
                    labelColor,
                    backgroundColor,
                    categoryColors,
                });
            }

            if (response.status === 200 || response.status === 201) {
                setSuccess(
                    mode === "edit"
                        ? "Theme updated successfully!"
                        : "Theme created successfully!"
                );
                // Optionally, redirect after a short delay
                setTimeout(() => {
                    router.push("/themes");
                }, 1500);
            }
        } catch (err: any) {
            console.error("Error submitting form:", err);
            setError(
                err.response?.data?.message ||
                "Failed to submit the form. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {error && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{mb: 3}}>
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
                    sx={{mb: 3}}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{mb: 3}}
                />
                <Grid container spacing={2} sx={{mb: 3}}>
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
                <Box sx={{mb: 3}}>
                    <Typography variant="h6" gutterBottom>
                        Category Colors
                    </Typography>
                    {categoryColors.map((color, index) => (
                        <Box key={index} display="flex" alignItems="center" sx={{mb: 1}}>
                            <TextField
                                label={`Color ${index + 1}`}
                                variant="outlined"
                                type="color"
                                value={color}
                                onChange={(e) =>
                                    handleCategoryColorChange(index, e.target.value)
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{mr: 2, minWidth: 100}}
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? mode === "edit"
                            ? "Updating..."
                            : "Creating..."
                        : mode === "edit"
                            ? "Update Theme"
                            : "Create Theme"}
                </Button>
            </Box>
        </>
    );
}

export default EditThemeForm;