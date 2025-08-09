import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Observable, Subject, takeUntil, tap, switchMap, startWith, catchError, throwError } from 'rxjs';
import { Ticket, FilterParams, TicketStatus, User } from '../../types';
import { AsyncPipe } from '@angular/common';
import { TicketCardComponent } from '../../components/ticket-card/ticket-card.component';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';


@Component({
	selector: 'app-ticket-list',
	templateUrl: './ticket-list.component.html',
	styleUrl: './ticket-list.component.scss',
	imports: [
		AsyncPipe,
		TicketCardComponent,
		SkeletonModule,
		FormsModule,
		SelectModule,
	]
})
export class TicketListComponent implements OnInit, OnDestroy {
	private readonly _ticketService = inject(TicketService);
	private readonly _messageService = inject(MessageService);

	tickets$!: Observable<Ticket[]>;
	users: User[] = [];
	
	selectedStatus: TicketStatus | '' = '';
	selectedAssignee: string = '';
	showUnassigned: boolean = false;
	
	private filterSubject = new Subject<FilterParams>();
	private destroy$ = new Subject<void>();

	statusOptions = [
		{ 
			label: 'All Statuses', value: '' 
		},
		{ 
			label: 'Open', value: TicketStatus.OPEN 
		},
		{ 
			label: 'In Progress', value: TicketStatus.IN_PROGRESS 
		},
		{ 
			label: 'Completed', value: TicketStatus.COMPLETED 
		}
	];

	assigneeOptions: { label: string; value: string }[] = [
		{ 
			label: 'All Assignees', value: '' 
		},
		{ 
			label: 'Unassigned', value: 'unassigned' 
		}
	];

	protected TicketStatus = TicketStatus;

	ngOnInit() {
		this.loadUsers();
		this.setupFilteredTickets();
	}

	private loadUsers(): void {
		this._ticketService.getUsers().pipe(
			takeUntil(this.destroy$),
			tap(users => {
				this.users = users;
				this.assigneeOptions = [
					{ 
						label: 'All Assignees',
						value: '' 
					},
					{ 
						label: 'Unassigned',
						value: 'unassigned' 
					},
					...users.map(user => ({ label: user.name, value: user.id }))
				];
			}),
			catchError(() => {
				this._messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: 'Failed to load users'
				});

				return throwError(() => new Error('Failed to load users'));
			})
		).subscribe();
	}

	private setupFilteredTickets(): void {
		this.tickets$ = this.filterSubject.pipe(
			startWith({}),
			switchMap((filters: FilterParams) => this._ticketService.getTickets(filters)),
			takeUntil(this.destroy$)
		);
	}

	applyFilters(): void {
		const filters: FilterParams = {};
		
		if (this.selectedStatus) {
			filters.status = this.selectedStatus;
		}
		
		if (this.selectedAssignee) {
			filters.assignedTo = this.selectedAssignee;
		}
		
		this.filterSubject.next(filters);
	}

	clearFilters(): void {
		this.selectedStatus = '';
		this.selectedAssignee = '';
		this.showUnassigned = false;
		this.filterSubject.next({});
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

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

