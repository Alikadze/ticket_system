import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'tickets',
                pathMatch: 'full'
            },
            {
                path: 'tickets',
                loadChildren: () => import('./features/tickets/ticket.routes').then(m => m.ticketRoutes)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'tickets',
        pathMatch: 'full'
    }
];
