// components/AnnualWheelEditPanel.tsx

"use client";

import React, { useState, useEffect } from "react";
import { AnnualWheelWithCategories } from "@/types/AnnualWheel";
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton,
    Stack, Fab,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {CategoryWithEvents} from "@/types/Category"; // For generating unique IDs for new categories/events
import {Event} from "@/types/Event";

let currentValue = 0;
function getNewValue() {
    currentValue--;
    return currentValue;
}

interface AnnualWheelEditPanelProps {
    annualWheel: AnnualWheelWithCategories;
    onSave: (updatedWheel: AnnualWheelWithCategories) => void;
    onClose: () => void;
}

const AnnualWheelEditPanel: React.FC<AnnualWheelEditPanelProps> = ({ annualWheel, onSave, onClose }) => {
    const [name, setName] = useState(annualWheel.name);
    const [description, setDescription] = useState(annualWheel.description || "");
    const [year, setYear] = useState(annualWheel.year);
    const [categories, setCategories] = useState<CategoryWithEvents[]>(annualWheel.categories);
    const [error, setError] = useState<string | null>(null);

    const handleAddCategory = () => {
        const newCategory: CategoryWithEvents = {
            id: getNewValue(), // Temporary ID, replace with server-generated ID upon saving
            name: "New Category",
            defaultColor: "#000000",
            wheelId: annualWheel.id,
            events: [],
        };
        setCategories([...categories, newCategory]);
    };

    const handleRemoveCategory = (id: number) => {
        setCategories(categories.filter(category => category.id !== id));
    };

    const handleCategoryChange = (id: number, field: keyof CategoryWithEvents, value: string) => {
        setCategories(categories.map(category =>
            category.id === id ? { ...category, [field]: value } : category
        ));
    };

    const handleAddEvent = (categoryId: number) => {
        const newEvent: Event = {
            id: getNewValue(), // Temporary ID
            name: "New Event",
            wheelId: annualWheel.id,
            categoryId: categoryId,
            startDate: new Date(),
            endDate: undefined,
        };
        setCategories(categories.map(category =>
            category.id === categoryId ? { ...category, events: [...category.events, newEvent] } : category
        ));
    };

    const handleRemoveEvent = (categoryId: number, eventId: number) => {
        setCategories(categories.map(category =>
            category.id === categoryId ? { ...category, events: category.events.filter(event => event.id !== eventId) } : category
        ));
    };

    const handleEventChange = (categoryId: number, eventId: number, field: keyof Event, value: any) => {
        setCategories(categories.map(category =>
            category.id === categoryId ? {
                ...category,
                events: category.events.map(event =>
                    event.id === eventId ? { ...event, [field]: value } : event
                )
            } : category
        ));
    };

    const handleSubmit = () => {
        // Basic validation
        if (!name.trim()) {
            setError("Name is required.");
            return;
        }
        if (!year || isNaN(year)) {
            setError("Valid year is required.");
            return;
        }
        // Further validations can be added here

        const updatedWheel: AnnualWheelWithCategories = {
            ...annualWheel,
            name,
            description,
            year,
            categories,
        };

        onSave(updatedWheel);
    };

    return (
        <Box sx={{ p: 3, width: '100%', height: '100%', overflowY: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Edit Annual Wheel</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
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

            <Box>
                <Typography variant="h6" gutterBottom>
                    Categories
                </Typography>
                {categories.map((category) => (
                    <Box key={category.id} sx={{ mb: 3, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1">Category</Typography>
                            <Button variant="text" color="error" onClick={() => handleRemoveCategory(category.id)}>
                                Remove
                            </Button>
                        </Box>
                        <TextField
                            label="Category Name"
                            variant="outlined"
                            fullWidth
                            value={category.name}
                            onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Default Color"
                            variant="outlined"
                            type="color"
                            fullWidth
                            value={category.defaultColor}
                            onChange={(e) => handleCategoryChange(category.id, 'defaultColor', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ mb: 2 }}
                        />
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Events
                            </Typography>
                            {category.events.map((event) => (
                                <Box key={event.id} sx={{ mb: 2, border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2">Event</Typography>
                                        <Button variant="text" color="error" size="small" onClick={() => handleRemoveEvent(category.id, event.id)}>
                                            Remove
                                        </Button>
                                    </Box>
                                    <TextField
                                        label="Event Name"
                                        variant="outlined"
                                        fullWidth
                                        value={event.name}
                                        onChange={(e) => handleEventChange(category.id, event.id, 'name', e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Start Date"
                                        variant="outlined"
                                        fullWidth
                                        type="date"
                                        value={event.startDate.toISOString().substr(0, 10)}
                                        onChange={(e) => handleEventChange(category.id, event.id, 'startDate', new Date(e.target.value))}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                            ))}
                            <Button variant="outlined" onClick={() => handleAddEvent(category.id)}>
                                Add Event
                            </Button>
                        </Box>
                    </Box>
                ))}
                <Button variant="outlined" onClick={handleAddCategory}>
                    Add Category
                </Button>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </Box>
        </Box>
    );
}

export default AnnualWheelEditPanel;