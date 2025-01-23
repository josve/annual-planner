// src/data/theme.ts

"use server";

import Connection from "@/lib/connection";
import { Theme } from "@/types/Theme";

/**
 * Retrieves all themes from the database.
 * @returns A Promise resolving to an array of Theme objects.
 */
export async function getAllThemes(): Promise<Theme[]> {
    const connection = await Connection.getInstance().getConnection();
    try {
        const [rows]: any = await connection.query(
            "SELECT id, name, description, month_arc_color, event_arc_color, label_color, background_color, category_colors FROM themes"
        );

        const themes: Theme[] = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description || undefined,
            monthArcColor: row.month_arc_color,
            eventArcColor: row.event_arc_color,
            labelColor: row.label_color,
            backgroundColor: row.background_color,
            categoryColors: row.category_colors ? JSON.parse(row.category_colors) : undefined,
        }));

        return themes;
    } catch (error) {
        console.error("Error fetching all themes:", error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Retrieves a theme by its unique ID.
 * @param id - The unique identifier of the theme.
 * @returns A Promise resolving to the Theme object or null if not found.
 */
export async function getThemeById(id: number | undefined): Promise<Theme | null> {
    if (id === undefined || id === null) {
        return null;
    }

    const connection = await Connection.getInstance().getConnection();
    try {
        const [rows]: any = await connection.query(
            "SELECT id, name, description, month_arc_color, event_arc_color, label_color, background_color, category_colors FROM themes WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        const theme: Theme = {
            id: row.id,
            name: row.name,
            description: row.description || undefined,
            monthArcColor: row.month_arc_color,
            eventArcColor: row.event_arc_color,
            labelColor: row.label_color,
            backgroundColor: row.background_color,
            categoryColors: row.category_colors ? JSON.parse(row.category_colors) : undefined,
        };

        return theme;
    } catch (error) {
        console.error(`Error fetching theme with ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Creates a new theme with the provided details.
 * @param theme - An object containing the details of the theme to create.
 * @returns A Promise that resolves when the theme is created.
 */
export async function createTheme(theme: Omit<Theme, "id">): Promise<void> {
    const {
        name,
        description = null,
        monthArcColor = "#53A045",
        eventArcColor = "#F6E400",
        labelColor = "#000000",
        backgroundColor = "#FFFFFF",
        categoryColors = [],
    } = theme;

    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.query(
            "INSERT INTO themes (name, description, month_arc_color, event_arc_color, label_color, background_color, category_colors) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                name,
                description,
                monthArcColor,
                eventArcColor,
                labelColor,
                backgroundColor,
                JSON.stringify(categoryColors),
            ]
        );
    } catch (error) {
        console.error("Error creating theme:", error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Updates an existing theme with the provided details.
 * @param id - The unique identifier of the theme to update.
 * @param updates - An object containing the fields to update.
 * @returns A Promise that resolves when the theme is updated.
 */
export async function updateTheme(
    id: number,
    updates: Partial<Omit<Theme, "id">>
): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
        fields.push("name = ?");
        values.push(updates.name);
    }
    if (updates.description !== undefined) {
        fields.push("description = ?");
        values.push(updates.description);
    }
    if (updates.monthArcColor !== undefined) {
        fields.push("month_arc_color = ?");
        values.push(updates.monthArcColor);
    }
    if (updates.eventArcColor !== undefined) {
        fields.push("event_arc_color = ?");
        values.push(updates.eventArcColor);
    }
    if (updates.labelColor !== undefined) {
        fields.push("label_color = ?");
        values.push(updates.labelColor);
    }
    if (updates.backgroundColor !== undefined) {
        fields.push("background_color = ?");
        values.push(updates.backgroundColor);
    }
    if (updates.categoryColors !== undefined) {
        fields.push("category_colors = ?");
        values.push(JSON.stringify(updates.categoryColors));
    }

    if (fields.length === 0) {
        // No fields to update
        return;
    }

    const query = `UPDATE themes SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.query(query, values);
    } catch (error) {
        console.error(`Error updating theme with ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Deletes a theme by its unique ID.
 * @param id - The unique identifier of the theme to delete.
 * @returns A Promise that resolves when the theme is deleted.
 */
export async function deleteTheme(id: number): Promise<void> {
    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.query("DELETE FROM themes WHERE id = ?", [id]);
    } catch (error) {
        console.error(`Error deleting theme with ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}