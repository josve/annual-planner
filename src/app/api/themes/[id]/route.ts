// app/api/themes/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import {deleteTheme, getThemeById, updateTheme} from "@/data/Theme";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {Theme} from "@/types/Theme";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const themeId = parseInt(params.id, 10);

    if (isNaN(themeId)) {
        return NextResponse.json({ message: "Invalid theme ID" }, { status: 400 });
    }

    try {
        const existingTheme = await getThemeById(themeId);

        if (!existingTheme) {
            return NextResponse.json({ message: "Theme not found." }, { status: 404 });
        }

        const body: Partial<Theme> = await request.json();

        // Basic validation
        if (body.name !== undefined && body.name.trim() === "") {
            return NextResponse.json({ message: "Theme name cannot be empty." }, { status: 400 });
        }

        // Optional: Additional validation for colors and categoryColors
        const colorFields = ["monthArcColor", "eventArcColor", "labelColor", "backgroundColor"];
        for (const field of colorFields) {
            if (body[field as keyof Theme] !== undefined) {
                const color = (body as any)[field];
                if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                    return NextResponse.json({ message: `Invalid color format for ${field}.` }, { status: 400 });
                }
            }
        }

        if (body.categoryColors !== undefined) {
            if (!Array.isArray(body.categoryColors)) {
                return NextResponse.json({ message: "Category colors must be an array." }, { status: 400 });
            }
            // Validate each color in categoryColors
            for (let i = 0; i < body.categoryColors.length; i++) {
                const color = body.categoryColors[i];
                if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                    return NextResponse.json({ message: `Invalid color format for category color at index ${i}.` }, { status: 400 });
                }
            }
        }

        // Update the theme
        await updateTheme(themeId, {
            name: body.name,
            description: body.description,
            monthArcColor: body.monthArcColor,
            eventArcColor: body.eventArcColor,
            labelColor: body.labelColor,
            backgroundColor: body.backgroundColor,
            categoryColors: body.categoryColors,
        });

        return NextResponse.json({ message: "Theme updated successfully." }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating theme:", error);
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const themeId = parseInt(params.id, 10);

    if (isNaN(themeId)) {
        return NextResponse.json({ message: "Invalid theme ID" }, { status: 400 });
    }

    try {
        const theme = await getThemeById(themeId);

        if (!theme) {
            return NextResponse.json({ message: "Theme not found" }, { status: 404 });
        }

        await deleteTheme(themeId);
        return NextResponse.json({ message: "Theme deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting theme:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}