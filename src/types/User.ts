export interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    lastLogin?: Date | null;
}