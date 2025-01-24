// app/annual-wheels/[id]/page.tsx

import {getServerSession, Session} from "next-auth";
import { authOptions } from "@/auth";
import { getAnnualWheelById } from "@/data/AnnualWheel";
import { AnnualWheelWithCategories } from "@/types/AnnualWheel";
import { notFound } from "next/navigation";
import AnnualWheelClient from "@/components/AnnualWheelClient";
import {getAllThemes} from "@/data/Theme";
import {Metadata} from "next";

interface PageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const session: any = await getServerSession(authOptions);
    const { id } = await params;
    const wheelId = parseInt(id, 10);
    const annualWheel: AnnualWheelWithCategories | null = await getAnnualWheelById(wheelId);
    if (!annualWheel || annualWheel.userId !== session.user.id) {
        return { title: "" };
    }

    return {
        title: annualWheel.name + " - Årsplanering",
    };
}

export default async function AnnualWheelPage({ params }: PageProps) {
    const { id } = await params;
    const wheelId = parseInt(id, 10);

    // Fetch the current session
    const session: Session | null = await getServerSession(authOptions);

    const user = session!.user;

    // Fetch the specific annual wheel
    const annualWheel: AnnualWheelWithCategories | null = await getAnnualWheelById(wheelId);

    const themes = await getAllThemes();

    if (!annualWheel || annualWheel.userId !== user.id) {
        notFound();
    }

    return (
        <AnnualWheelClient initialAnnualWheel={annualWheel} themes={themes}/>

    );
}