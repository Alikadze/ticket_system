import { Component, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Ticket, TicketStatus } from '../../types';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-ticket-card',
	templateUrl: './ticket-card.component.html',
	styleUrl: './ticket-card.component.scss',
	imports: [
		NgClass,
		DatePipe,
		RouterLink
	]
})
export class TicketCardComponent {
	ticket = input<Ticket>({} as Ticket);

	getStatusLabel(status: TicketStatus): string {
		switch (status) {
			case TicketStatus.OPEN:
				return 'Open';
			case TicketStatus.IN_PROGRESS:
				return 'In Progress';
			case TicketStatus.COMPLETED:
				return 'Completed';
			default:
				return 'Unknown';
		}
	}

	getInitials(name: string): string {
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	protected TicketStatus = TicketStatus;
}
