// src/types/Category.ts
import { Event } from '@/types/Event'

export interface Category {
    id: number;
    wheelId: number;        // References AnnualWheel.id
    name: string;           // Unique per wheel
    defaultColor: string;   // e.g., "#000000"
}

export interface CategoryWithEvents extends Category {
    events: Event[];
}