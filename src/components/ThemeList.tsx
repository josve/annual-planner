// components/ThemeList.tsx

"use client";

import React from "react";
import { Theme } from "@/types/Theme";
import { Grid, Typography } from "@mui/material";
import ThemeCard from "./ThemeCard";

interface ThemeListProps {
    themes: Theme[];
}

const ThemeList: React.FC<ThemeListProps> = ({ themes }) => {
    return (
        <>
            {themes.length === 0 ? (
                <Typography variant="h6">
                    No themes available. Click the button above to create one.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {themes.map((theme) => (
                        <ThemeCard key={theme.id} theme={theme} />
                    ))}
                </Grid>
            )}
        </>
    );
};

export default ThemeList;