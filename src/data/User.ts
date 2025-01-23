// src/data/user.ts

"use server";

import Connection from "@/lib/connection";
import { User } from "@/types/User";

/**
 * Retrieves a user by their unique ID.
 * @param id - The unique identifier of the user.
 * @returns A Promise resolving to the User object or null if not found.
 */
export async function getUserById(id: number | undefined): Promise<User | null> {
    if (id === undefined || id === null) {
        return null;
    }

    const connection = await Connection.getInstance().getConnection();
    try {
        const [rows]: any = await connection.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        // Ensure that rows[0] exists and maps correctly to the User interface
        if (rows.length === 0) {
            return null;
        }

        const userRow = rows[0];

        // Map database fields to TypeScript interface
        const user: User = {
            id: userRow.id,
            name: userRow.name,
            email: userRow.email,
            role: userRow.role,
            isActive: userRow.is_active,
            lastLogin: userRow.last_login ? new Date(userRow.last_login) : null,
        };

        return user;
    } finally {
        connection.release();
    }
}

/**
 * Retrieves a user by their unique email address.
 * @param email - The email address of the user.
 * @returns A Promise resolving to the User object or null if not found.
 */
export async function getUserByEmail(email: string | undefined): Promise<User | null> {
    if (!email) {
        return null;
    }

    const connection = await Connection.getInstance().getConnection();
    try {
        const [rows]: any = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return null;
        }

        const userRow = rows[0];

        const user: User = {
            id: userRow.id,
            name: userRow.name,
            email: userRow.email,
            role: userRow.role,
            isActive: userRow.is_active,
            lastLogin: userRow.last_login ? new Date(userRow.last_login) : null,
        };

        return user;
    } finally {
        connection.release();
    }
}

/**
 * Creates a new user with the provided name and email.
 * @param name - The full name of the user.
 * @param email - The unique email address of the user.
 * @returns A Promise that resolves when the user is created.
 */
export async function createUser(name: string, email: string): Promise<void> {
    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
    } finally {
        connection.release();
    }
}

/**
 * Updates user details for a given user ID.
 * @param id - The unique identifier of the user to update.
 * @param updates - An object containing the fields to update.
 * @returns A Promise that resolves when the user is updated.
 */
export async function updateUser(
    id: number,
    updates: Partial<Pick<User, "name" | "email" | "role" | "isActive">>
): Promise<void> {
    const { name, email, role, isActive } = updates;

    const fields: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
        fields.push("name = ?");
        values.push(name);
    }
    if (email !== undefined) {
        fields.push("email = ?");
        values.push(email);
    }
    if (role !== undefined) {
        fields.push("role = ?");
        values.push(role);
    }
    if (isActive !== undefined) {
        fields.push("is_active = ?");
        values.push(isActive);
    }

    if (fields.length === 0) {
        // No fields to update
        return;
    }

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.query(query, values);
    } finally {
        connection.release();
    }
}

/**
 * Updates the last login timestamp for a user by their ID.
 * @param id - The unique identifier of the user.
 * @param lastLogin - The new last login timestamp.
 * @returns A Promise that resolves when the last login is updated.
 */
export async function updateLastLogin(id: number, lastLogin: Date): Promise<void> {
    const connection = await Connection.getInstance().getConnection();
    try {
        await connection.query(
            "UPDATE users SET last_login = ? WHERE id = ?",
            [lastLogin, id]
        );
    } finally {
        connection.release();
    }
}