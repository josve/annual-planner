// components/AnnualWheelClient.tsx

"use client";

import React, { useState, useEffect } from "react";
import { AnnualWheelWithEvents } from "@/types/AnnualWheel";
import {
    Box,
    Button,
    Container,
    Divider,
    Typography,
    Drawer,
} from "@mui/material";
import RenderAnnualWheel from "@/components/RenderAnnualWheel";
import AnnualWheelEditPanel from "@/components/AnnualWheelEditPanel"; // To be created

import {updateAnnualWheelAction} from "@/app/lib/annualWheelsActions";

interface Props {
    initialAnnualWheel: AnnualWheelWithEvents;
}

const AnnualWheelClient: React.FC<Props> = ({ initialAnnualWheel }) => {
    const [annualWheel, setAnnualWheel] = useState<AnnualWheelWithEvents | null>(null);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        setAnnualWheel(initialAnnualWheel);
    }, [initialAnnualWheel]);

    const handleOpenEditPanel = () => {
        setIsEditPanelOpen(true);
    };

    const handleCloseEditPanel = () => {
        setIsEditPanelOpen(false);
    };

    const handleSave = async (updatedWheel: AnnualWheelWithEvents) => {
        try {
            const response = await updateAnnualWheelAction(updatedWheel);
            if (response.status === 201) {
                const updateFromServer: AnnualWheelWithEvents = response.data!; // Parse JSON response
                console.log(updateFromServer);
                setAnnualWheel(updateFromServer);
                setSuccess("Updateringen klar!");
                handleCloseEditPanel();
            }
        } catch (error: any) {
            console.error("Error saving Annual Wheel:", error);
            setError(
                error.response?.data?.message ||
                "Failed to save Annual Wheel. Please try again."
            );
        }
    };

    return (
        <>
            {annualWheel && (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    {annualWheel?.name} ({annualWheel?.year})
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleOpenEditPanel}
                >
                    Editera
                </Button>
            </Box>
            <Typography variant="body1" gutterBottom>
                {annualWheel?.description || ""}
            </Typography>

            <RenderAnnualWheel annualWheel={annualWheel!} />

            {/* Edit Panel */}
            <Drawer
                anchor="right"
                open={isEditPanelOpen}
                onClose={handleCloseEditPanel}
                sx={{ zIndex: 99999 }}
                PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
            >
                <AnnualWheelEditPanel
                    annualWheel={annualWheel!}
                    onSave={handleSave}
                    onClose={handleCloseEditPanel}
                />
            </Drawer>

            {success && (
                <Box position="fixed" bottom={16} right={16}>
                    <Typography variant="body1" color="success.main">
                        {success}
                    </Typography>
                </Box>
            )}
            {error && (
                <Box position="fixed" bottom={16} right={16}>
                    <Typography variant="body1" color="error.main">
                        {error}
                    </Typography>
                </Box>
            )}
        </Container>)}
        </>

    );
}

export default AnnualWheelClient;