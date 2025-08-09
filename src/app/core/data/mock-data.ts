import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Ticket, TicketStatus, User, UserRole } from '../../features/tickets/types';

export class MockData implements InMemoryDbService {
    createDb() {
        const users: User[] = [
            { 
                id: '1', 
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                avatar: 'https://i.pravatar.cc/150?img=1',
                role: UserRole.ADMIN
            },
            { 
                id: '2', 
                name: 'Bob Smith',
                email: 'bob.smith@example.com',
                avatar: 'https://i.pravatar.cc/150?img=2',
                role: UserRole.USER
            },
            {
                id: '3',
                name: 'Charlie Lee',
                email: 'charlie.lee@example.com',
                avatar: 'https://i.pravatar.cc/150?img=3',
                role: UserRole.USER
            },
            {
                id: '4',
                name: 'Diana Patel',
                email: 'diana.patel@example.com',
                avatar: 'https://i.pravatar.cc/150?img=4',
                role: UserRole.USER
            },
            {
                id: '5',
                name: 'Eve Martinez',
                email: 'eve.martinez@example.com',
                avatar: 'https://i.pravatar.cc/150?img=5',
                role: UserRole.AGENT
            },
            {
                id: '6',
                name: 'Frank Wilson',
                email: 'frank.wilson@example.com',
                avatar: 'https://i.pravatar.cc/150?img=6',
                role: UserRole.AGENT
            }
        ];

        const getUserById = (id: string) => users.find(u => u.id === id);

        const tickets: Ticket[] = [
            {
                id: '1',
                title: 'Login issue',
                description: 'User cannot log in to the system.',
                status: TicketStatus.OPEN,
                assignedTo: getUserById('1'),
                createdAt: new Date('2024-06-01T09:00:00Z'),
                updatedAt: new Date('2024-06-01T09:30:00Z')
            },
            {
                id: '2',
                title: 'Page not loading',
                description: 'Dashboard page fails to load for some users.',
                status: TicketStatus.IN_PROGRESS,
                assignedTo: getUserById('2'),
                createdAt: new Date('2024-06-02T10:00:00Z'),
                updatedAt: new Date('2024-06-02T11:00:00Z')
            },
            {
                id: '3',
                title: 'Error 500 on save',
                description: 'Saving profile throws server error.',
                status: TicketStatus.COMPLETED,
                assignedTo: getUserById('1'),
                createdAt: new Date('2024-06-03T12:00:00Z'),
                updatedAt: new Date('2024-06-03T13:00:00Z'),
                completedAt: new Date('2024-06-03T13:05:00Z')
            },
            {
                id: '4',
                title: 'UI glitch on mobile',
                description: 'Buttons overlap on small screens.',
                status: TicketStatus.OPEN,
                createdAt: new Date('2024-06-04T08:00:00Z'),
                updatedAt: new Date('2024-06-04T08:00:00Z')
            },
            {
                id: '5',
                title: 'Notifications delayed',
                description: 'Push notifications arrive late.',
                status: TicketStatus.IN_PROGRESS,
                assignedTo: getUserById('2'),
                createdAt: new Date('2024-06-05T14:00:00Z'),
                updatedAt: new Date('2024-06-05T15:00:00Z')
            },
            {
                id: '6',
                title: 'Password reset email not sent',
                description: 'No email received after password reset request.',
                status: TicketStatus.OPEN,
                createdAt: new Date('2024-06-06T09:00:00Z'),
                updatedAt: new Date('2024-06-06T09:00:00Z')
            },
            {
                id: '7',
                title: 'Data export fails',
                description: 'Exporting data to CSV fails for large datasets.',
                status: TicketStatus.COMPLETED,
                assignedTo: getUserById('1'),
                createdAt: new Date('2024-06-07T11:00:00Z'),
                updatedAt: new Date('2024-06-07T12:00:00Z'),
                completedAt: new Date('2024-06-07T12:10:00Z')
            },
            {
                id: '8',
                title: 'Search returns no results',
                description: 'Search function does not return expected results.',
                status: TicketStatus.OPEN,
                createdAt: new Date('2024-06-08T10:00:00Z'),
                updatedAt: new Date('2024-06-08T10:00:00Z')
            },
            {
                id: '9',
                title: 'Profile picture upload error',
                description: 'Uploading profile picture fails with error.',
                status: TicketStatus.IN_PROGRESS,
                assignedTo: getUserById('2'),
                createdAt: new Date('2024-06-09T13:00:00Z'),
                updatedAt: new Date('2024-06-09T14:00:00Z')
            },
            {
                id: '10',
                title: 'Session timeout too short',
                description: 'Users are logged out too quickly due to session timeout.',
                status: TicketStatus.IN_PROGRESS,
                assignedTo: getUserById('1'),
                createdAt: new Date('2024-06-10T15:00:00Z'),
                updatedAt: new Date('2024-06-10T16:00:00Z'),
                completedAt: new Date('2024-06-10T16:05:00Z')
            }
        ];

        return { tickets, users };
    }

    post(reqInfo: RequestInfo) {
        const { collectionName, id, req, utils } = reqInfo;

        if (req.url.includes('/assign')) {
            return this.assignTicket(reqInfo);
        }

        if (req.url.includes('/complete')) {
            return this.completeTicket(reqInfo);
        }

        return undefined;
    }

    get(reqInfo: RequestInfo) {
        const { collectionName, req, utils } = reqInfo;

        if (collectionName === 'tickets' && req.url.includes('?')) {
            return this.getFilteredTickets(reqInfo);
        }

        return undefined; 
    }

    private getFilteredTickets(reqInfo: RequestInfo) {
        const { headers, req, utils } = reqInfo;
        const db = utils.getDb() as any;
        const tickets = db.tickets as Ticket[];

        const url = new URL(req.url, 'http://localhost');
        const status = url.searchParams.get('status');
        const assignedTo = url.searchParams.get('assignedTo');

        let filteredTickets = [...tickets];

        if (status) {
            filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
        }

        if (assignedTo) {
            if (assignedTo === 'unassigned') {
                filteredTickets = filteredTickets.filter(ticket => !ticket.assignedTo);
            } else {
                filteredTickets = filteredTickets.filter(ticket => ticket.assignedTo?.id === assignedTo);
            }
        }

        return utils.createResponse$(() => ({
            status: 200,
            headers,
            body: filteredTickets
        }));
    }


    private assignTicket(reqInfo: RequestInfo) {
        const { headers, req, utils } = reqInfo;
        const ticketId = this.extractTicketIdFromUrl(req.url);
        const body = this.getJsonBody(req);
        const { userId } = body;

        const db = utils.getDb() as any;
        const tickets = db.tickets as Ticket[];
        const users = db.users as User[];

        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        const user = users.find(u => u.id === userId);

        if (ticketIndex === -1) {
            return utils.createResponse$(() => ({
                status: 404,
                headers,
                body: { error: `Ticket with id '${ticketId}' not found` }
            }));
        }

        if (!user) {
            return utils.createResponse$(() => ({
                status: 404,
                headers,
                body: { error: `User with id '${userId}' not found` }
            }));
        }

        const updatedTicket = {
            ...tickets[ticketIndex],
            assignedTo: user,
            status: TicketStatus.IN_PROGRESS,
            updatedAt: new Date()
        };

        tickets[ticketIndex] = updatedTicket;

        return utils.createResponse$(() => ({
            status: 200,
            headers,
            body: updatedTicket
        }));
    }

    private completeTicket(reqInfo: RequestInfo) {
        const { headers, req, utils } = reqInfo;
        const ticketId = this.extractTicketIdFromUrl(req.url);

        const db = utils.getDb() as any;
        const tickets = db.tickets as Ticket[];

        const ticketIndex = tickets.findIndex(t => t.id === ticketId);

        if (ticketIndex === -1) {
            return utils.createResponse$(() => ({
                status: 404,
                headers,
                body: { error: `Ticket with id '${ticketId}' not found` }
            }));
        }

        const updatedTicket = {
            ...tickets[ticketIndex],
            status: TicketStatus.COMPLETED,
            updatedAt: new Date(),
            completedAt: new Date()
        };

        tickets[ticketIndex] = updatedTicket;

        return utils.createResponse$(() => ({
            status: 200,
            headers,
            body: updatedTicket
        }));
    }

    private extractTicketIdFromUrl(url: string): string {
        const parts = url.split('/');
        const ticketsIndex = parts.indexOf('tickets');
        if (ticketsIndex !== -1 && ticketsIndex + 1 < parts.length) {
            return parts[ticketsIndex + 1];
        }
        return '';
    }

    private getJsonBody(req: any): any {
        return typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    }
}
