// app/themes/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getThemeById, updateTheme } from "@/data/Theme";
import { Theme } from "@/types/Theme";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
} from "@mui/material";

interface PageProps {
    params: {
        id: string;
    };
}

export default function EditThemePage({ params }: PageProps) {
    const { id } = params;
    const themeId = parseInt(id, 10);
    const router = useRouter();

    const [theme, setTheme] = useState<Theme | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [monthArcColor, setMonthArcColor] = useState("#53A045");
    const [eventArcColor, setEventArcColor] = useState("#F6E400");
    const [labelColor, setLabelColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
    const [categoryColors, setCategoryColors] = useState<string[]>(["#FF5733", "#33FF57", "#3357FF"]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the theme details when the component mounts
        const fetchTheme = async () => {
            try {
                const fetchedTheme = await getThemeById(themeId);
                if (fetchedTheme) {
                    setTheme(fetchedTheme);
                    setName(fetchedTheme.name);
                    setDescription(fetchedTheme.description || "");
                    setMonthArcColor(fetchedTheme.monthArcColor);
                    setEventArcColor(fetchedTheme.eventArcColor);
                    setLabelColor(fetchedTheme.labelColor);
                    setBackgroundColor(fetchedTheme.backgroundColor);
                    setCategoryColors(fetchedTheme.categoryColors || []);
                } else {
                    setError("Theme not found.");
                }
            } catch (err) {
                console.error("Error fetching theme:", err);
                setError("Failed to fetch theme details.");
            }
        };

        fetchTheme();
    }, [themeId]);

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

        // Basic validation
        if (!name) {
            setError("Theme name is required.");
            return;
        }

        try {
            await updateTheme(themeId, {
                name,
                description: description || undefined,
                monthArcColor,
                eventArcColor,
                labelColor,
                backgroundColor,
                categoryColors,
            });
            router.push("/themes");
        } catch (err) {
            console.error("Error updating theme:", err);
            setError("Failed to update theme. Please try again.");
        }
    };

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Typography variant="h6" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => router.push("/themes")}>
                    Back to Themes
                </Button>
            </Container>
        );
    }

    if (!theme) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Theme
            </Typography>
            {error && (
                <Typography variant="body1" color="error" gutterBottom>
                    {error}
                </Typography>
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
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}
                    <Button variant="contained" color="primary" onClick={handleAddCategoryColor}>
                        Add Category Color
                    </Button>
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Update Theme
                </Button>
            </Box>
        </Container>
    );
}