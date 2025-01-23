"use client";

import { getProviders, signIn } from "next-auth/react";
import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import Image from "next/image";
import { getCsrfToken } from "next-auth/react"
import React, { useEffect, useState } from 'react';

interface SignInFormProps {
    providers: Array<{
        id: string;
        name: string;
    }>;
    showLoginForm: boolean;
    callbackUrl?: string;
}

export default function SignInForm({ showLoginForm, callbackUrl }: SignInFormProps) {
    const [csrfToken, setCsrfToken] = useState<any>(null);
    const [providers, setProviders] = useState<any>([]);

    useEffect(() => {
        const fetch = async () => {
            const res = await getCsrfToken();
            setCsrfToken(res);
        };

        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const res: any = await getProviders();
            setProviders(Object.values(res));
            console.log(Object.values(res));
        }

        fetch();
    }, []);

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "background.default",
            }}
        >
            <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}>
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "center",
                        py: 4,
                    }}
                >
                    <Box sx={{ width: 200, mb: 2 }}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={200}
                            height={60}
                            style={{ width: "100%", height: "auto" }}
                        />
                    </Box>

                    <Typography variant="h4" color="primary" textAlign="center">
                        Välkommen till årshjulsgeneratorn
                    </Typography>

                    <Typography variant="body1" textAlign="center">
                        Det här är ett system för att hantera och generera årshjul för planering!
                    </Typography>

                    {showLoginForm && (
                        <form
                            method="post"
                            action="api/auth/callback/credentials"
                        >
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken}/>
                            <label htmlFor="email">
                                Email
                                <input name="email" id="email"/>
                            </label>
                            <label htmlFor="password">
                                Password
                                <input name="password" id="password"/>
                            </label>
                            <input type="submit" value="Sign In"/>
                        </form>
                    )}

                    {providers && providers.map((provider: any) => (
                        <Button
                            key={provider.id}
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 2,
                                textTransform: "none",
                            }}
                            onClick={() =>
                                signIn(provider.id, {callbackUrl})
                            }
                        >
                            Logga in med {provider.name}
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </Container>
    );
}
