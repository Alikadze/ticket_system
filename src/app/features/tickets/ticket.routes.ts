import { Routes } from '@angular/router';
import { TicketComponent } from './pages/ticket/ticket.component';
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';

export const ticketRoutes: Routes = [
    {
        path: '',
        component: TicketListComponent
    },
    {
        path: ':id',
        component: TicketComponent
    }
];
