// app/api/annual-wheels/route.ts

import { NextRequest, NextResponse } from "next/server";
import {createAnnualWheel, getAnnualWheelById} from "@/data/AnnualWheel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { AnnualWheel } from "@/types/AnnualWheel";
import { getThemeById } from "@/data/Theme";

export async function POST(request: NextRequest) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: AnnualWheel = await request.json();

        if (!body.name || body.name.trim() === "") {
            return NextResponse.json({ message: "Annual Wheel name is required." }, { status: 400 });
        }

        if (!body.year || isNaN(body.year)) {
            return NextResponse.json({ message: "Valid year is required." }, { status: 400 });
        }

        if (!body.themeId || isNaN(body.themeId)) {
            return NextResponse.json({ message: "Valid Theme ID is required." }, { status: 400 });
        }

        const theme = await getThemeById(body.themeId);
        if (!theme) {
            return NextResponse.json({ message: "Selected theme does not exist." }, { status: 400 });
        }

        const id = await createAnnualWheel(body.name, body.description ?? null, session.user.id, body.year, body.themeId);
        const annualWheel = await getAnnualWheelById(id);

        return NextResponse.json(annualWheel, { status: 201 });
    } catch (error: any) {
        console.error("Error creating Annual Wheel:", error);
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}