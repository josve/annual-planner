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
import AnnualWheelClient from "@/components/AnnualWheelClient";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function AnnualWheelPage({ params }: PageProps) {
    const { id } = await params;
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
        <AnnualWheelClient annualWheel={annualWheel}/>

    );
}