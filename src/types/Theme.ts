// src/types/Theme.ts

export interface Theme {
    id: number;
    name: string;
    description?: string;
    monthArcColor: string;      // e.g., "#53A045"
    eventArcColor: string;      // e.g., "#F6E400"
    labelColor: string;         // e.g., "#000000"
    backgroundColor: string;    // e.g., "#FFFFFF"
    categoryColors?: string[];  // e.g., ["#FF5733", "#33FF57", "#3357FF"]
}