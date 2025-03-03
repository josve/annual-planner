// app/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Adjust the import path based on your project structure
import { getAllAnnualWheels } from "@/data/AnnualWheel";
import { AnnualWheelWithCategories } from "@/types/AnnualWheel";
import Link from "next/link";
import {
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Box,
} from "@mui/material";
import {notFound} from "next/navigation";

export default async function HomePage() {
    // Fetch the current session
    const session: any = await getServerSession(authOptions);

    // If no session exists, prompt the user to log in
    if (!session) {
        return notFound();
    }

    // Extract user information from the session
    const user = session.user;

    // Fetch the user's annual wheels
    let annualWheels: AnnualWheelWithCategories[] = [];

    try {
        annualWheels = await getAllAnnualWheels(user.id);
    } catch (error) {
        console.error("Error fetching annual wheels:", error);
        // Optionally, handle the error by displaying a message to the user
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Välkommen, {user.name}!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href="/annual-wheels/create"
                >
                    Skapa nytt årshjul
                </Button>
            </Box>

            {annualWheels.length === 0 ? (
                <Typography variant="h6">
                    You have no Annual Wheels yet. Click the button above to create one.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {annualWheels.map((wheel) => (
                        <Grid item key={wheel.id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {wheel.name} ({wheel.year})
                                    </Typography>
                                    <Typography>
                                        {wheel.description || "No description provided."}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        component={Link}
                                        href={`/annual-wheels/${wheel.id}`}
                                    >
                                        Visa
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}