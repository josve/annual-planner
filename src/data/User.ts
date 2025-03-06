"use server";

import Connection from "@/lib/connection";
import {User} from "@/types/User";

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

        return {
            id: userRow.id,
            name: userRow.name,
            email: userRow.email,
            isActive: userRow.is_active,
            lastLogin: userRow.last_login ? new Date(userRow.last_login) : null,
        };
    } finally {
        connection.release();
    }
}

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