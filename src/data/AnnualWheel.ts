// src/data/annualWheel.ts

"use server";

import Connection from "@/lib/connection";
import {AnnualWheelWithCategories} from "@/types/AnnualWheel";
import {CategoryWithEvents} from "@/types/Category";

/**
 * Retrieves all annual wheels, including their connected categories and events.
 * @returns A Promise resolving to an array of AnnualWheelWithCategories objects.
 */
export async function getAllAnnualWheels(userId: number): Promise<AnnualWheelWithCategories[]> {
    const connection = await Connection.getInstance().getConnection();
    try {
        // Fetch all annual wheels
        const [wheelRows]: any = await connection.query(
            "SELECT id, name, description, user_id, year, theme_id FROM annual_wheels WHERE user_id = ?",
            [userId]
        );

        if (wheelRows.length === 0) {
            return [];
        }

        const wheels: AnnualWheelWithCategories[] = await Promise.all(
            wheelRows.map(async (wheelRow: any) => {
                const annualWheel: AnnualWheelWithCategories = {
                    id: wheelRow.id,
                    name: wheelRow.name,
                    description: wheelRow.description || undefined,
                    userId: wheelRow.user_id,
                    year: wheelRow.year,
                    themeId: wheelRow.theme_id,
                    categories: [],
                };

                // Fetch categories for the current wheel
                const [categoryRows]: any = await connection.query(
                    "SELECT id, wheel_id, name, default_color FROM categories WHERE wheel_id = ?",
                    [annualWheel.id]
                );

                if (categoryRows.length === 0) {
                    return annualWheel;
                }

                annualWheel.categories = await Promise.all(
                    categoryRows.map(async (categoryRow: any) => {
                        const category: CategoryWithEvents = {
                            id: categoryRow.id,
                            wheelId: categoryRow.wheel_id,
                            name: categoryRow.name,
                            defaultColor: categoryRow.default_color,
                            events: [],
                        };

                        // Fetch events for the current category
                        const [eventRows]: any = await connection.query(
                            "SELECT id, wheel_id, category_id, name, start_date, end_date FROM events WHERE category_id = ?",
                            [category.id]
                        );

                        category.events = eventRows.map((eventRow: any) => ({
                            id: eventRow.id,
                            wheelId: eventRow.wheel_id,
                            categoryId: eventRow.category_id,
                            name: eventRow.name,
                            startDate: new Date(eventRow.start_date),
                            endDate: eventRow.end_date ? new Date(eventRow.end_date) : null,
                        }));

                        return category;
                    })
                );

                return annualWheel;
            })
        );

        return wheels;
    } catch (error) {
        console.error("Error fetching all annual wheels:", error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Retrieves an annual wheel by its unique ID, including connected categories and events.
 * @param id - The unique identifier of the annual wheel.
 * @returns A Promise resolving to the AnnualWheelWithCategories object or null if not found.
 */
export async function getAnnualWheelById(id: number | undefined): Promise<AnnualWheelWithCategories | null> {
    if (id === undefined || id === null) {
        return null;
    }

    const connection = await Connection.getInstance().getConnection();
    try {
        // Fetch the annual wheel
        const [wheelRows]: any = await connection.query(
            "SELECT id, name, description, user_id, year, theme_id FROM annual_wheels WHERE id = ?",
            [id]
        );

        if (wheelRows.length === 0) {
            return null;
        }

        const wheelRow = wheelRows[0];
        const annualWheel: AnnualWheelWithCategories = {
            id: wheelRow.id,
            name: wheelRow.name,
            description: wheelRow.description || undefined,
            userId: wheelRow.user_id,
            year: wheelRow.year,
            themeId: wheelRow.theme_id,
            categories: [],
        };

        // Fetch categories for the wheel
        const [categoryRows]: any = await connection.query(
            "SELECT id, wheel_id, name, default_color FROM categories WHERE wheel_id = ?",
            [annualWheel.id]
        );

        if (categoryRows.length === 0) {
            return annualWheel;
        }

        annualWheel.categories = await Promise.all(
            categoryRows.map(async (categoryRow: any) => {
                const category: CategoryWithEvents = {
                    id: categoryRow.id,
                    wheelId: categoryRow.wheel_id,
                    name: categoryRow.name,
                    defaultColor: categoryRow.default_color,
                    events: [],
                };

                // Fetch events for the category
                const [eventRows]: any = await connection.query(
                    "SELECT id, wheel_id, category_id, name, start_date, end_date FROM events WHERE category_id = ?",
                    [category.id]
                );

                category.events = eventRows.map((eventRow: any) => ({
                    id: eventRow.id,
                    wheelId: eventRow.wheel_id,
                    categoryId: eventRow.category_id,
                    name: eventRow.name,
                    startDate: new Date(eventRow.start_date),
                    endDate: eventRow.end_date ? new Date(eventRow.end_date) : null,
                }));

                return category;
            })
        );

        return annualWheel;
    } catch (error) {
        console.error(`Error fetching annual wheel with ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Creates a new annual wheel.
 * @param name - The name of the annual wheel.
 * @param description - (Optional) A detailed description of the wheel.
 * @param userId - The ID of the user who owns/created the wheel.
 * @param year - The calendar year the wheel represents.
 * @param themeId - The ID of the theme applied to the wheel.
 * @returns A Promise that resolves when the annual wheel is created.
 */
export async function createAnnualWheel(
    name: string,
    description: string | null,
    userId: number,
    year: number,
    themeId: number
): Promise<void> {
    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.query(
            "INSERT INTO annual_wheels (name, description, user_id, year, theme_id) VALUES (?, ?, ?, ?, ?)",
            [name, description, userId, year, themeId]
        );
    } catch (error) {
        console.error("Error creating annual wheel:", error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Updates an existing annual wheel, including its categories and events.
 * This method performs a full update, replacing existing categories and events with the provided ones.
 * @param id - The unique identifier of the annual wheel to update.
 * @param updates - An object containing the fields to update, including categories and events.
 * @returns A Promise that resolves when the annual wheel is updated.
 */
export async function updateAnnualWheel(
    id: number,
    updates: Partial<{
        name: string;
        description: string | null;
        userId: number;
        year: number;
        themeId: number;
        categories: Partial<CategoryWithEvents>[];
    }>
): Promise<void> {
    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.beginTransaction();

        // Update annual wheel fields
        const wheelFields: string[] = [];
        const wheelValues: any[] = [];

        if (updates.name !== undefined) {
            wheelFields.push("name = ?");
            wheelValues.push(updates.name);
        }
        if (updates.description !== undefined) {
            wheelFields.push("description = ?");
            wheelValues.push(updates.description);
        }
        if (updates.userId !== undefined) {
            wheelFields.push("user_id = ?");
            wheelValues.push(updates.userId);
        }
        if (updates.year !== undefined) {
            wheelFields.push("year = ?");
            wheelValues.push(updates.year);
        }
        if (updates.themeId !== undefined) {
            wheelFields.push("theme_id = ?");
            wheelValues.push(updates.themeId);
        }

        if (wheelFields.length > 0) {
            const wheelQuery = `UPDATE annual_wheels
                                SET ${wheelFields.join(", ")}
                                WHERE id = ?`;
            wheelValues.push(id);
            await connection.query(wheelQuery, wheelValues);
        }

        // If categories are provided, handle them
        if (updates.categories !== undefined) {
            // Fetch existing categories for the wheel
            const [existingCategories]: any = await connection.query(
                "SELECT id FROM categories WHERE wheel_id = ?",
                [id]
            );

            const existingCategoryIds = existingCategories.map((cat: any) => cat.id);

            const updatedCategoryIds: number[] = [];

            for (const categoryUpdate of updates.categories) {
                if (categoryUpdate.id) {
                    // Existing category: update
                    const {id: categoryId, name, defaultColor, events} = categoryUpdate;

                    const categoryFields: string[] = [];
                    const categoryValues: any[] = [];

                    if (name !== undefined) {
                        categoryFields.push("name = ?");
                        categoryValues.push(name);
                    }
                    if (defaultColor !== undefined) {
                        categoryFields.push("default_color = ?");
                        categoryValues.push(defaultColor);
                    }

                    if (categoryFields.length > 0) {
                        const categoryQuery = `UPDATE categories
                                               SET ${categoryFields.join(", ")}
                                               WHERE id = ?`;
                        categoryValues.push(categoryId);
                        await connection.query(categoryQuery, categoryValues);
                    }

                    updatedCategoryIds.push(categoryId);

                    // Handle events for the category
                    if (events !== undefined) {
                        // Fetch existing events for the category
                        const [existingEvents]: any = await connection.query(
                            "SELECT id FROM events WHERE category_id = ?",
                            [categoryId]
                        );

                        const existingEventIds = existingEvents.map((evt: any) => evt.id);

                        const updatedEventIds: number[] = [];

                        for (const eventUpdate of events) {
                            if (eventUpdate.id) {
                                // Existing event: update
                                const {id: eventId, name, startDate, endDate } = eventUpdate;

                                const eventFields: string[] = [];
                                const eventValues: any[] = [];

                                if (name !== undefined) {
                                    eventFields.push("name = ?");
                                    eventValues.push(name);
                                }
                                if (startDate !== undefined) {
                                    eventFields.push("start_date = ?");
                                    eventValues.push(startDate);
                                }
                                if (endDate !== undefined) {
                                    eventFields.push("end_date = ?");
                                    eventValues.push(endDate);
                                }

                                if (eventFields.length > 0) {
                                    const eventQuery = `UPDATE events
                                                        SET ${eventFields.join(", ")}
                                                        WHERE id = ?`;
                                    eventValues.push(eventId);
                                    await connection.query(eventQuery, eventValues);
                                }

                                updatedEventIds.push(eventId);
                            } else {
                                // New event: create
                                const {name, startDate, endDate} = eventUpdate;

                                await connection.query(
                                    "INSERT INTO events (wheel_id, category_id, name, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
                                    [id, categoryUpdate.id, name, startDate, endDate || null]
                                );
                            }
                        }

                        // Delete events that were not updated
                        const eventsToDelete = existingEventIds.filter((evtId: number) => !updatedEventIds.includes(evtId));
                        if (eventsToDelete.length > 0) {
                            await connection.query(
                                `DELETE
                                 FROM events
                                 WHERE id IN (${eventsToDelete.map(() => "?").join(", ")})`,
                                eventsToDelete
                            );
                        }
                    }
                } else {
                    // New category: create
                    const {name, defaultColor, events} = categoryUpdate;

                    const [result]: any = await connection.query(
                        "INSERT INTO categories (wheel_id, name, default_color) VALUES (?, ?, ?)",
                        [id, name, defaultColor || "#000000"]
                    );

                    const newCategoryId = result.insertId;

                    // Handle events for the new category
                    if (events !== undefined) {
                        for (const eventCreate of events) {
                            const {name, startDate, endDate} = eventCreate;
                            await connection.query(
                                "INSERT INTO events (wheel_id, category_id, name, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
                                [id, newCategoryId, name, startDate, endDate || null]
                            );
                        }
                    }

                    updatedCategoryIds.push(newCategoryId);
                }
            }

            // Delete categories that were not updated
            const categoriesToDelete = existingCategoryIds.filter((catId: number) => !updatedCategoryIds.includes(catId));
            if (categoriesToDelete.length > 0) {
                await connection.query(
                    `DELETE
                     FROM categories
                     WHERE id IN (${categoriesToDelete.map(() => "?").join(", ")})`,
                    categoriesToDelete
                );
            }
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        console.error(`Error updating annual wheel with ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}

    /**
     * Deletes an annual wheel by its unique ID, including its connected categories and events.
     * @param id - The unique identifier of the annual wheel to delete.
     * @returns A Promise that resolves when the annual wheel is deleted.
     */
    export async function deleteAnnualWheel(id: number): Promise<void> {
        const connection = await Connection.getInstance().getConnection();
        try {
            await connection.beginTransaction();

            // Due to foreign key constraints with ON DELETE CASCADE, deleting the wheel will automatically delete its categories and events
            await connection.query("DELETE FROM annual_wheels WHERE id = ?", [id]);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error(`Error deleting annual wheel with ID ${id}:`, error);
            throw error;
        } finally {
            connection.release();
        }
    }