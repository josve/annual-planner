"use client";

import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import {Category} from "@/types/Category";
import {getContrastColor} from "@/lib/colors";

interface AnnualWheelLegendProps {
    categories: Category[];
}

const AnnualWheelLegend: React.FC<AnnualWheelLegendProps> = ({ categories }) => {
    if (categories.length === 0) {
        return (<></>);
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Kategorier
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
                {categories.map((category) => (
                    <Chip
                        key={category.id}
                        label={category.name}
                        sx={{
                            backgroundColor: category.defaultColor,
                            color: getContrastColor(category.defaultColor),
                            fontWeight: "bold",
                        }}
                    />
                ))}
            </Stack>
        </Box>
    );
};


export default AnnualWheelLegend;