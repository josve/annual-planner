// app/api/annual-wheels/route.ts

import { NextRequest, NextResponse } from "next/server";
import {createAnnualWheel, getAnnualWheelById, updateAnnualWheel} from "@/data/AnnualWheel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {AnnualWheel, AnnualWheelWithCategories} from "@/types/AnnualWheel";
import { getThemeById } from "@/data/Theme";

export async function POST(request: NextRequest) {
    // Retrieve the current user's session
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: AnnualWheelWithCategories = await request.json();

        if (body.userId != session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Basic validation
        if (!body.name || body.name.trim() === "") {
            return NextResponse.json({ message: "Annual Wheel name is required." }, { status: 400 });
        }

        if (!body.year || isNaN(body.year)) {
            return NextResponse.json({ message: "Valid year is required." }, { status: 400 });
        }

        if (!body.themeId || isNaN(body.themeId)) {
            return NextResponse.json({ message: "Valid Theme ID is required." }, { status: 400 });
        }

        // Validate that the theme exists
        const theme = await getThemeById(body.themeId);
        if (!theme) {
            return NextResponse.json({ message: "Selected theme does not exist." }, { status: 400 });
        }

        console.log(JSON.stringify(body));

        await updateAnnualWheel(
            body.id,
            body);

        const updated = await getAnnualWheelById(body.id);

        return NextResponse.json(updated, { status: 201 });
    } catch (error: any) {
        console.error("Error creating Annual Wheel:", error);
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}