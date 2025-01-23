// app/api/themes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createTheme } from "@/data/Theme";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Theme } from "@/types/Theme";

export async function POST(request: NextRequest) {
    // Retrieve the current user's session
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: Theme = await request.json();

        // Basic validation
        if (!body.name) {
            return NextResponse.json({ message: "Theme name is required." }, { status: 400 });
        }

        // Optional: Additional validation for colors and categoryColors
        const colorFields = ["monthArcColor", "eventArcColor", "labelColor", "backgroundColor"];
        for (const field of colorFields) {
            const color = (body as any)[field];
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                return NextResponse.json({ message: `Invalid color format for ${field}.` }, { status: 400 });
            }
        }

        if (!Array.isArray(body.categoryColors)) {
            return NextResponse.json({ message: "Category colors must be an array." }, { status: 400 });
        }

        // Optional: Validate each color in categoryColors
        for (let i = 0; i < body.categoryColors.length; i++) {
            const color = body.categoryColors[i];
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                return NextResponse.json({ message: `Invalid color format for category color at index ${i}.` }, { status: 400 });
            }
        }

        // Create the theme
        await createTheme({
            name: body.name,
            description: body.description || undefined,
            monthArcColor: body.monthArcColor,
            eventArcColor: body.eventArcColor,
            labelColor: body.labelColor,
            backgroundColor: body.backgroundColor,
            categoryColors: body.categoryColors,
        });

        return NextResponse.json({ message: "Theme created successfully." }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating theme:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}