// app/themes/page.tsx

import { getAllThemes } from "@/data/Theme";
import { Theme } from "@/types/Theme";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import ThemeList from "@/components/ThemeList";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {notFound} from "next/navigation";

export default async function ListThemesPage() {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        notFound();
    }

    if (session.user.role !== "admin") {
        notFound();
    }

    // Fetch all themes
    let themes: Theme[] = await getAllThemes();

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Themes Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href="/themes/create"
                >
                    Create New Theme
                </Button>
            </Box>

            <ThemeList themes={themes} />
        </Container>
    );
}