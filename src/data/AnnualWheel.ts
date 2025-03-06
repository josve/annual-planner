"use server";

import Connection from "@/lib/connection";
import {AnnualWheelWithEvents} from "@/types/AnnualWheel";
import {PoolConnection} from "mysql2/promise";

async function getAnnualWheelFromRow(wheelRow: any, connection: PoolConnection) {
    const annualWheel: AnnualWheelWithEvents = {
        id: wheelRow.id,
        name: wheelRow.name,
        description: wheelRow.description || undefined,
        userId: wheelRow.user_id,
        year: wheelRow.year,
        events: [],
    };

    // Fetch events for the current category
    const [eventRows]: any = await connection.query(
        "SELECT id, wheel_id, name, start_date, end_date FROM events WHERE wheel_id = ?",
        [wheelRow.id]
    );

    annualWheel.events = eventRows.map((eventRow: any) => ({
        id: eventRow.id,
        wheelId: eventRow.wheel_id,
        name: eventRow.name,
        startDate: new Date(eventRow.start_date),
        endDate: eventRow.end_date ? new Date(eventRow.end_date) : null,
    }));
    return annualWheel;
}

export async function getAllAnnualWheels(userId: number): Promise<AnnualWheelWithEvents[]> {
    const connection = await Connection.getInstance().getConnection();
    try {
        const [wheelRows]: any = await connection.query(
            "SELECT id, name, description, user_id, year FROM annual_wheels WHERE user_id = ?",
            [userId]
        );

        if (wheelRows.length === 0) {
            return [];
        }

        const wheels: AnnualWheelWithEvents[] = await Promise.all(
            wheelRows.map(async (wheelRow: any) => {
                return await getAnnualWheelFromRow(wheelRow, connection);
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

export async function getAnnualWheelById(id: number | undefined): Promise<AnnualWheelWithEvents | null> {
    if (id === undefined || id === null) {
        return null;
    }

    const connection = await Connection.getInstance().getConnection();
    try {
        const [wheelRows]: any = await connection.query(
            "SELECT id, name, description, user_id, year FROM annual_wheels WHERE id = ?",
            [id]
        );

        if (wheelRows.length === 0) {
            return null;
        }

        const wheelRow = wheelRows[0];

        return await getAnnualWheelFromRow(wheelRow, connection);
    } catch (error) {
        console.error(`Error fetching annual wheel with ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function createAnnualWheel(
    name: string,
    description: string | null,
    userId: number,
    year: number,
): Promise<number> {
    const connection = await Connection.getInstance().getConnection();
    try {
        const [result]: any = await connection.query(
            "INSERT INTO annual_wheels (name, description, user_id, year) VALUES (?, ?, ?, ?)",
            [name, description, userId, year]
        );
        return result.insertId;
    } catch (error) {
        console.error("Error creating annual wheel:", error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function updateAnnualWheel(
    id: number,
    updates: Partial<AnnualWheelWithEvents>): Promise<void> {
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

        if (wheelFields.length > 0) {
            const wheelQuery = `UPDATE annual_wheels
                                SET ${wheelFields.join(", ")}
                                WHERE id = ?`;
            wheelValues.push(id);
            await connection.query(wheelQuery, wheelValues);
        }

        if (updates.events !== undefined) {
            const events = updates.events;

            const [existingEvents]: any = await connection.query(
                "SELECT id FROM events WHERE wheel_id = ?",
                [id]
            );

            const existingEventIds = existingEvents.map((evt: any) => evt.id);
            const updatedEventIds: number[] = [];

            for (const eventUpdate of events) {
                if (eventUpdate.id && eventUpdate.id >= 0) {
                    // Existing event: update
                    const {id: eventId, name, startDate, endDate} = eventUpdate;

                    const eventFields: string[] = [];
                    const eventValues: any[] = [];

                    if (name !== undefined) {
                        eventFields.push("name = ?");
                        eventValues.push(name);
                    }
                    if (startDate !== undefined) {
                        eventFields.push("start_date = ?");
                        eventValues.push(new Date(startDate).toLocaleDateString('sv-SE'));
                    }
                    if (endDate !== undefined) {
                        eventFields.push("end_date = ?");
                        eventValues.push(endDate ? new Date(endDate).toLocaleDateString('sv-SE') : null);
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
                        "INSERT INTO events (wheel_id, name, start_date, end_date) VALUES (?, ?, ?, ?)",
                        [id, name, new Date(startDate).toLocaleDateString('sv-SE'), endDate ? new Date(endDate).toLocaleDateString('sv-SE') : null]
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

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        console.error(`Error updating annual wheel with ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function deleteAnnualWheel(id: number): Promise<void> {
    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.beginTransaction();

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