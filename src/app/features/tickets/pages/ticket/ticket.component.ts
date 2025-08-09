import { Component, inject, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Ticket, TicketStatus, User } from '../../types';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-ticket',
	templateUrl: './ticket.component.html',
	styleUrl: './ticket.component.scss',
	imports: [
		AsyncPipe,
		CommonModule,
		TitleCasePipe,
		FormsModule
	]
})
export class TicketComponent implements OnInit, OnDestroy {
	private readonly _ticketService = inject(TicketService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _location = inject(Location);
	private readonly _messageService = inject(MessageService);

	ticket$!: Observable<Ticket>;
	users!: User[];
	selectedUser: User | null = null;
	showUserDropdown: boolean = false;

	sub$ = new Subject<void>();

	protected TicketStatus = TicketStatus;

	ngOnInit(): void {
		const ticketId = this._route.snapshot.paramMap.get('id');
		if (ticketId) {
			this.loadTicket(ticketId);
		}
		this.loadUsers();
	}

	loadTicket(ticketId: string): void {
		this.ticket$ = this._ticketService.getTicketById(ticketId);
	}

	loadUsers(): void {
		this._ticketService.getUsers().pipe(
			takeUntil(this.sub$),
			tap(users => {
				this.users = users;
			})
		).subscribe();
	}

	goBack(): void {
		this._location.back();
	}

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

	formatDate(date: Date): string {
		const now = new Date();
		const diffInMs = now.getTime() - new Date(date).getTime();
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			return 'Today';
		} else if (diffInDays === 1) {
			return 'Yesterday';
		} else if (diffInDays < 7) {
			return `${diffInDays} days ago`;
		} else if (diffInDays < 30) {
			const weeks = Math.floor(diffInDays / 7);
			return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
		} else {
			const months = Math.floor(diffInDays / 30);
			return `${months} month${months > 1 ? 's' : ''} ago`;
		}
	}

	formatFullDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	markTicketAsComplete(ticketId: string) {
		this._ticketService.completeTicket(ticketId).pipe(
			tap(() => {
				this._messageService.add({
					severity: 'success',
					summary: 'Success',
					detail: `Ticket ${ticketId} marked as complete`
				});

				this.loadTicket(ticketId);
			})
		).subscribe();
	}

	toggleUserDropdown() {
		this.showUserDropdown = !this.showUserDropdown;
	}

	assignUserToTicket(ticketId: string, user: User) {
		this._ticketService.assignTicket(ticketId, user.id).pipe(
			takeUntil(this.sub$),
			tap(() => {
				this._messageService.add({
					severity: 'success',
					summary: 'Success',
					detail: `Ticket assigned to ${user.name}`
				});

				this.selectedUser = user;
				this.showUserDropdown = false;
				this.loadTicket(ticketId);
			})
		).subscribe();
	}

	onDocumentClick(event: Event) {
		const target = event.target as HTMLElement;
		if (!target.closest('.relative')) {
			this.showUserDropdown = false;
		}
	}
	
	ngOnDestroy(): void {
		this.sub$.next();
		this.sub$.complete();
	}
}

