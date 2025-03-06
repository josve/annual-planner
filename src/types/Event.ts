export interface Event {
    id: number;
    wheelId: number;
    name: string;
    startDate: Date;
    endDate?: Date | null;
}