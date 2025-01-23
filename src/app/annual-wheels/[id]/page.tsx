// app/annual-wheels/[id]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Adjust the import path based on your project structure
import { getAnnualWheelById } from "@/data/AnnualWheel";
import { AnnualWheelWithCategories } from "@/types/AnnualWheel";
import Link from "next/link";
import {
    Container,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Box,
} from "@mui/material";
import { notFound, redirect } from "next/navigation";
import RenderAnnualWheel from "@/components/RenderAnnualWheel";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function AnnualWheelPage({ params }: PageProps) {
    const { id } = params;
    const wheelId = parseInt(id, 10);

    // Fetch the current session
    const session: any = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = session.user;

    // Fetch the specific annual wheel
    const annualWheel: AnnualWheelWithCategories | null = await getAnnualWheelById(wheelId);

    if (!annualWheel || annualWheel.userId !== user.id) {
        notFound();
    }

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
                    href={`/annual-wheels/${wheelId}/edit`}
                >
                    Edit
                </Button>
            </Box>
            <Typography variant="body1" gutterBottom>
                {annualWheel.description || "No description provided."}
            </Typography>

            <RenderAnnualWheel annualWheel={annualWheel} />

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" gutterBottom>
                Categories
            </Typography>
            {annualWheel.categories.length === 0 ? (
                <Typography>No categories available.</Typography>
            ) : (
                annualWheel.categories.map((category) => (
                    <Card key={category.id} sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Default Color: {category.defaultColor}
                            </Typography>
                            <Typography variant="subtitle1">Events:</Typography>
                            {category.events.length === 0 ? (
                                <Typography variant="body2">No events in this category.</Typography>
                            ) : (
                                <List>
                                    {category.events.map((event) => (
                                        <ListItem key={event.id} disableGutters>
                                            <ListItemText
                                                primary={event.name}
                                                secondary={`${event.startDate.toDateString()} ${
                                                    event.endDate ? `to ${event.endDate.toDateString()}` : ""
                                                } (${event.itemCount} item${
                                                    event.itemCount !== 1 ? "s" : ""
                                                })`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}

            <Box mt={4}>
                <Button variant="contained" color="primary" component={Link} href="/">
                    Back to Home
                </Button>
            </Box>
        </Container>
    );
}