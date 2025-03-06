import {getServerSession, Session} from "next-auth";
import { authOptions } from "@/auth";
import { getAnnualWheelById } from "@/data/AnnualWheel";
import { AnnualWheelWithEvents } from "@/types/AnnualWheel";
import { notFound } from "next/navigation";
import AnnualWheelClient from "@/components/AnnualWheelClient";
import {Metadata} from "next";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const session: any = await getServerSession(authOptions);
    const { id } = await params;
    const wheelId = parseInt(id, 10);
    const annualWheel: AnnualWheelWithEvents | null = await getAnnualWheelById(wheelId);
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

    const session: Session | null = await getServerSession(authOptions);

    const user = session!.user;

    const annualWheel: AnnualWheelWithEvents | null = await getAnnualWheelById(wheelId);

    if (!annualWheel || annualWheel.userId !== user.id) {
        notFound();
    }

    return (
        <AnnualWheelClient initialAnnualWheel={annualWheel}/>
    );
}