// app/api/themes/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { deleteTheme, getThemeById } from "@/data/Theme";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
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