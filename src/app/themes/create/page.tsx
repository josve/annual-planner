// app/themes/create/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Container, Typography } from "@mui/material";
import EditThemeForm from "@/components/EditThemeForm";
import React from "react";
import {notFound} from "next/navigation";

export default async function CreateThemePage() {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        notFound();
    }

    if (session.user.role !== "admin") {
        notFound();
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Skapa nytt tema
            </Typography>
            <EditThemeForm mode="create" />
        </Container>
    );
}