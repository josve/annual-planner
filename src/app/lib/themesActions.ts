'use server'

import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {createTheme, deleteTheme, getThemeById, updateTheme} from "@/data/Theme";
import {Theme} from "@/types/Theme";

export async function createThemeAction(body: Partial<Theme>) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return { message: "Unauthorized" };
    }

    if (session.user.role !== "admin") {
        return { message: "Unauthorized" };
    }

    try {
        // Basic validation
        if (!body.name) {
            return { message: "Theme name is required." };
        }

        // Optional: Additional validation for colors and categoryColors
        const colorFields = ["monthArcColor", "eventArcColor", "labelColor", "backgroundColor"];
        for (const field of colorFields) {
            const color = (body as any)[field];
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                return { message: `Invalid color format for ${field}.` };
            }
        }

        if (!Array.isArray(body.categoryColors)) {
            return { message: "Category colors must be an array." };
        }

        // Optional: Validate each color in categoryColors
        for (let i = 0; i < body.categoryColors.length; i++) {
            const color = body.categoryColors[i];
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                return { message: `Invalid color format for category color at index ${i}.` };
            }
        }

        // Create the theme
        await createTheme({
            name: body.name,
            description: body.description || undefined,
            monthArcColor: body.monthArcColor!,
            eventArcColor: body.eventArcColor!,
            labelColor: body.labelColor!,
            backgroundColor: body.backgroundColor!,
            categoryColors: body.categoryColors,
        });

        return { message: "Theme created successfully." };
    } catch (error: any) {
        console.error("Error creating theme:", error);
        return { message: "Internal Server Error" };
    }
}

export async function updateThemeAction(id: number, theme: Partial<Theme>) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return { message: "Unauthorized" };
    }

    if (session.user.role !== "admin") {
        return { message: "Unauthorized" };
    }

    if (isNaN(id)) {
        return { message: "Invalid theme ID" };
    }

    try {
        const existingTheme = await getThemeById(id);

        if (!existingTheme) {
            return { message: "Theme not found." };
        }

        const body: Partial<Theme> = theme;

        // Basic validation
        if (body.name !== undefined && body.name.trim() === "") {
            return { message: "Theme name cannot be empty." };
        }

        // Optional: Additional validation for colors and categoryColors
        const colorFields = ["monthArcColor", "eventArcColor", "labelColor", "backgroundColor"];
        for (const field of colorFields) {
            if (body[field as keyof Theme] !== undefined) {
                const color = (body as any)[field];
                if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                    return { message: `Invalid color format for ${field}.` };
                }
            }
        }

        if (body.categoryColors !== undefined) {
            if (!Array.isArray(body.categoryColors)) {
                return { message: "Category colors must be an array." };
            }
            // Validate each color in categoryColors
            for (let i = 0; i < body.categoryColors.length; i++) {
                const color = body.categoryColors[i];
                if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                    return { message: `Invalid color format for category color at index ${i}.` };
                }
            }
        }

        // Update the theme
        await updateTheme(id, {
            name: body.name,
            description: body.description,
            monthArcColor: body.monthArcColor,
            eventArcColor: body.eventArcColor,
            labelColor: body.labelColor,
            backgroundColor: body.backgroundColor,
            categoryColors: body.categoryColors,
        });

        return { message: "Theme updated successfully." };
    } catch (error: any) {
        console.error("Error updating theme:", error);
        return { message: "Internal Server Error." };
    }
}

export async function deleteThemeAction(id: number) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return { message: "Unauthorized" };
    }

    if (session.user.role !== "admin") {
        return { message: "Unauthorized" };
    }

    if (isNaN(id)) {
        return { message: "Invalid theme ID" };
    }

    try {
        const theme = await getThemeById(id);

        if (!theme) {
            return { message: "Theme not found" };
        }

        await deleteTheme(id);
        return { message: "Theme deleted" };
    } catch (error: any) {
        console.error("Error deleting theme:", error);
        return { message: "Internal server error" };
    }
}