import { getThemeById } from "@/data/Theme";
import { Theme } from "@/types/Theme";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import EditThemeForm from "@/components/EditThemeForm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {notFound} from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditThemePage({ params }: PageProps) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        notFound();
    }

    if (session.user.role !== "admin") {
        notFound();
    }

    const { id } = await params;
    const themeId = parseInt(id, 10);

    // Fetch the specific theme
    let theme: Theme | null = null;
    let error: string | null = null;

    try {
        theme = await getThemeById(themeId);
        if (!theme) {
            error = "Theme not found.";
        }
    } catch (err) {
        console.error("Error fetching theme:", err);
        error = "Failed to fetch theme details.";
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Typography variant="h6" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button variant="contained" color="primary" component={Link} href="/themes">
                    Tillbaka till teman
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Editera tema
            </Typography>
            <EditThemeForm mode="edit" theme={theme!} />
        </Container>
    );
}