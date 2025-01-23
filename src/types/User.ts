// src/types/User.ts

export interface User {
    id: number;
    name: string;
    email: string;
    role: string; // Defaults to 'user'
    isActive: boolean; // Defaults to true
    lastLogin?: Date | null;
}