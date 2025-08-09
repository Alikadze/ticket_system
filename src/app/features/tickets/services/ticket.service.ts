import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable, throwError } from 'rxjs';
import { FilterParams, Ticket, User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends ApiService {
	getTickets(params?: FilterParams): Observable<Ticket[]> {
		let url = 'tickets';
		
		if (params && Object.keys(params).length > 0) {
			const searchParams = new URLSearchParams();
			
			if (params.status) {
				searchParams.append('status', params.status);
			}
			
			if (params.assignedTo) {
				searchParams.append('assignedTo', params.assignedTo);
			}
			
			url += '?' + searchParams.toString();
		}
		
		return this.get<Ticket[]>(url);
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