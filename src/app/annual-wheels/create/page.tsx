// app/annual-wheels/create/page.tsx

import { getAllThemes } from "@/data/Theme";
import { Theme } from "@/types/Theme";
import { Container, Typography } from "@mui/material";
import CreateAnnualWheelForm from "@/components/CreateAnnualWheelForm";
import React from "react";
import {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Nytt årshjul - Årsplanering",
    };
}

export default async function CreateAnnualWheelPage() {
    let themes: Theme[] = await getAllThemes();

    return (
        <Container maxWidth="sm" sx={{py: 8}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Skapa ett nytt årshjul
            </Typography>
            <CreateAnnualWheelForm themes={themes}/>
        </Container>
    );
}