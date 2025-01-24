// components/AnnualWheelClient.tsx

"use client";

import React from "react";
import { AnnualWheelWithCategories } from "@/types/AnnualWheel";
import {
    Box,
    Button,
    Container,
    Divider,
    Typography
} from "@mui/material";
import Link from "next/link";
import RenderAnnualWheel from "@/components/RenderAnnualWheel";
import AnnualWheelLegend from "@/components/AnnualWheelLegend";

interface Props {
    annualWheel: AnnualWheelWithCategories;
}

const AnnualWheelClient: React.FC<Props> = ({ annualWheel }) => {
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    {annualWheel.name} ({annualWheel.year})
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    component={Link}
                    href={`/annual-wheels/${annualWheel.id}/edit`}
                >
                    Edit
                </Button>
            </Box>
            <Typography variant="body1" gutterBottom>
                {annualWheel.description || "No description provided."}
            </Typography>

            <RenderAnnualWheel annualWheel={annualWheel} />

            <Divider sx={{ my: 4 }} />

            <AnnualWheelLegend categories={annualWheel.categories} />

            <Box mt={4}>
                <Button variant="contained" color="primary" component={Link} href="/">
                    Back to Home
                </Button>
            </Box>
        </Container>
    );
}

export default AnnualWheelClient;