export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    assignedTo?: User;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
}

export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

export enum UserRole {
    ADMIN = 'admin',
    AGENT = 'agent',
    USER = 'user'
}

export interface AssignTicketRequest {
    userId: string;
}

export interface CompleteTicketRequest {
    completedAt?: Date;
}

export interface FilterParams {
    status?: TicketStatus;
    assignedTo?: string;
    completedAt?: Date;
}