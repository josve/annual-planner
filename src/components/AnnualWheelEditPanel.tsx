"use client";

import React, { useState } from "react";
import { AnnualWheelWithEvents } from "@/types/AnnualWheel";
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {Event} from "@/types/Event";

let currentValue = 0;
function getNewValue() {
    currentValue--;
    return currentValue;
}

interface AnnualWheelEditPanelProps {
    annualWheel: AnnualWheelWithEvents;
    onSave: (updatedWheel: AnnualWheelWithEvents) => void;
    onClose: () => void;
}

const AnnualWheelEditPanel: React.FC<AnnualWheelEditPanelProps> = ({ annualWheel, onSave, onClose }) => {
    const [name, setName] = useState(annualWheel.name);
    const [description, setDescription] = useState(annualWheel.description || "");
    const [year, setYear] = useState(annualWheel.year);
    const [events, setEvents] = useState<Event[]>(annualWheel.events);
    const [error, setError] = useState<string | null>(null);

    const handleAddEvent = () => {
        const newEvent: Event = {
            id: getNewValue(), // Temporary ID
            name: "Ny händelse",
            wheelId: annualWheel.id,
            eventMonth: "January"
        };
        setEvents([...events, newEvent]);
    };

    const handleRemoveEvent = (eventId: number) => {
        setEvents(events.filter(event => event.id !== eventId));
    };

    const handleEventChange = (eventId: number, field: keyof Event, value: any) => {
        setEvents(events.map(event =>
                    event.id === eventId ? { ...event, [field]: value } : event
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

        const updatedWheel: AnnualWheelWithEvents = {
            ...annualWheel,
            name,
            description,
            year,
            events,
        };

        onSave(updatedWheel);
    };

    return (
        <Box sx={{ p: 3, width: '100%', height: '100%', overflowY: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Ändra årshjulet</Typography>
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
            <Box>
                <Typography variant="h6" gutterBottom>
                    Händelser
                </Typography>
                {events.map((event) => (
                    <Box key={event.id} sx={{ mb: 2, border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2">{event.name}</Typography>
                            <Button variant="text" color="error" size="small" onClick={() => handleRemoveEvent(event.id)}>
                                Radera
                            </Button>
                        </Box>
                        <TextField
                            label="Namn"
                            variant="outlined"
                            fullWidth
                            value={event.name}
                            onChange={(e) => handleEventChange( event.id, 'name', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id={'event-month-label-' + event.id}>Månad</InputLabel>
                            <Select
                                labelId={'event-month-label-' + event.id}
                                label="Månad"
                                value={event.eventMonth}
                                onChange={(e) =>
                                    handleEventChange(event.id, 'eventMonth', e.target.value)
                                }
                            >
                                <MenuItem value="January">Januari</MenuItem>
                                <MenuItem value="February">Februari</MenuItem>
                                <MenuItem value="March">Mars</MenuItem>
                                <MenuItem value="April">April</MenuItem>
                                <MenuItem value="May">Maj</MenuItem>
                                <MenuItem value="June">Juni</MenuItem>
                                <MenuItem value="July">Juli</MenuItem>
                                <MenuItem value="August">Augusti</MenuItem>
                                <MenuItem value="September">September</MenuItem>
                                <MenuItem value="October">Oktober</MenuItem>
                                <MenuItem value="November">November</MenuItem>
                                <MenuItem value="December">December</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                ))}
                            <Button variant="outlined" sx={{ mb: 4}} onClick={() => handleAddEvent()}>
                                Ny händelse
                            </Button>
                        </Box>

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
            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Spara
                </Button>
            </Box>

        </Box>
    );
}

export default AnnualWheelEditPanel;