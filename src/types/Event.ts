// src/types/Event.ts

export interface Event {
    id: number;
    wheelId: number;          // References AnnualWheel.id
    categoryId: number | null; // References Category.id, nullable if category is deleted
    name: string;
    startDate: Date;
    endDate?: Date | null;     // Nullable for single-day events
    itemCount: number;         // Defaults to 1
}