"use client";

import React, { useState } from "react";
import { Theme } from "@/types/Theme";
import { deleteThemeAction } from "@/app/lib/themesActions";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Chip,
} from "@mui/material";

interface ThemeCardProps {
    theme: Theme;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme }) => {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDeleteError(null);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteThemeAction(theme.id);
            window.location.reload();
        } catch (error: any) {
            console.error("Error deleting theme:", error);
            setDeleteError(error.response?.data?.message || "Failed to delete theme.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {theme.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {theme.description || "No description provided."}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Colors:</Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                            <Chip
                                label="Month Arc"
                                sx={{
                                    backgroundColor: theme.monthArcColor,
                                    color: getContrastColor(theme.monthArcColor),
                                }}
                            />
                            <Chip
                                label="Event Arc"
                                sx={{
                                    backgroundColor: theme.eventArcColor,
                                    color: getContrastColor(theme.eventArcColor),
                                }}
                            />
                            <Chip
                                label="Label"
                                sx={{
                                    backgroundColor: theme.labelColor,
                                    color: getContrastColor(theme.labelColor),
                                }}
                            />
                            <Chip
                                label="Background"
                                sx={{
                                    backgroundColor: theme.backgroundColor,
                                    color: getContrastColor(theme.backgroundColor),
                                }}
                            />
                        </Box>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        component={Link}
                        href={`/themes/${theme.id}`}
                    >
                        View
                    </Button>
                    <Button
                        size="small"
                        color="secondary"
                        component={Link}
                        href={`/themes/${theme.id}/edit`}
                    >
                        Edit
                    </Button>
                    <Button size="small" color="error" onClick={handleDeleteClick}>
                        Delete
                    </Button>
                </CardActions>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <DialogTitle id="delete-dialog-title">Delete Theme</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            Are you sure you want to delete the theme "{theme.name}"? This action cannot be undone.
                        </DialogContentText>
                        {deleteError && (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                {deleteError}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting} autoFocus>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </Grid>
    );
};

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

export default ThemeCard;