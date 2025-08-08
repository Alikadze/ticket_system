import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { FilterParams, Ticket, User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends ApiService {
	getTickets(params?: FilterParams): Observable<Ticket[]> {
		return this.get<Ticket[]>(
			'tickets',
			params
		);
	}

	getTicketById(id: string): Observable<Ticket> {
		return this.get<Ticket>(
			`tickets/${id}`
		);
	}

	getUsers(): Observable<User[]> {
		return this.get<User[]>(
			'users'
		);
	}

	assignTicket(ticketId: string, userId: string): Observable<Ticket> {
		return this.post<Ticket>(
			`tickets/${ticketId}/assign`,
			{ userId }
		);
	}

	completeTicket(ticketId: string): Observable<Ticket> {
		return this.post<Ticket>(
			`tickets/${ticketId}/complete`,
			{}
		);
	}

}