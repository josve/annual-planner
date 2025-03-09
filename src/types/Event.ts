export type Month =
    | 'January'
    | 'February'
    | 'March'
    | 'April'
    | 'May'
    | 'June'
    | 'July'
    | 'August'
    | 'September'
    | 'October'
    | 'November'
    | 'December';

export interface Event {
    id: number;
    wheelId: number;
    name: string;
    eventMonth: Month;
}