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

export default async function HomePage() {
    // Fetch the current session
    const session: any = await getServerSession(authOptions);

    // If no session exists, prompt the user to log in
    if (!session) {
        return (
            <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to Annual Wheels Planner
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please log in to access your Annual Wheels.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href="/login"
                    sx={{ mt: 4 }}
                >
                    Log In
                </Button>
            </Container>
        );
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
                    Welcome, {user.name}!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href="/annual-wheels/create"
                >
                    Create New Annual Wheel
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
                                        View Details
                                    </Button>
                                    {/* Optionally, add an Edit button */}
                                    {/* <Button
                    size="small"
                    color="secondary"
                    component={Link}
                    href={`/annual-wheels/${wheel.id}/edit`}
                  >
                    Edit
                  </Button> */}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Optional: Additional Features */}
            <Box mt={8}>
                <Typography variant="h5" gutterBottom>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="primary"
                            component={Link}
                            href="/themes"
                        >
                            Manage Themes
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="secondary"
                            component={Link}
                            href="/profile"
                        >
                            View Profile
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}