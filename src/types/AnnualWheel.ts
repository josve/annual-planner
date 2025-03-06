import { Event } from './Event';

export interface AnnualWheel {
    id: number;
    name: string;
    description?: string;
    userId: number;
    year: number;
}

export interface AnnualWheelWithEvents extends AnnualWheel {
    events: Event[];
}