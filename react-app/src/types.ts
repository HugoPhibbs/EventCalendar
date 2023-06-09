export interface Event {
    eventId: number;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface EventFormData {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface User {
    isAdmin: boolean;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
}

export interface RepeatFormData {
    repeat: boolean;
    repeatInterval: string;
    repeatEndDate: string;
}