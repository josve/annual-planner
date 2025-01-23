// src/types/AnnualWheel.ts

import {CategoryWithEvents} from "@/types/Category";

export interface AnnualWheel {
    id: number;
    name: string;
    description?: string;
    userId: number;    // References User.id
    year: number;      // e.g., 2024
    themeId: number;   // References Theme.id
}

export interface AnnualWheelWithCategories extends AnnualWheel {
    categories: CategoryWithEvents[];
}