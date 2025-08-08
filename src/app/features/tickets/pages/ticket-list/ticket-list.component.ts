import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Observable, Subject, takeUntil, tap, switchMap, startWith } from 'rxjs';
import { Ticket, FilterParams, TicketStatus, User } from '../../types';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TicketCardComponent } from '../../components/ticket-card/ticket-card.component';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-ticket-list',
	templateUrl: './ticket-list.component.html',
	styleUrl: './ticket-list.component.scss',
	imports: [
		AsyncPipe,
		CommonModule,
		TicketCardComponent,
		SkeletonModule,
		FormsModule
	]
})
export class TicketListComponent implements OnInit, OnDestroy {
	private readonly _ticketService = inject(TicketService);

	tickets$!: Observable<Ticket[]>;
	users: User[] = [];
	
	// Filter properties
	selectedStatus: TicketStatus | '' = '';
	selectedAssignee: string = '';
	showUnassigned: boolean = false;
	
	// Filter subject for reactive filtering
	private filterSubject = new Subject<FilterParams>();
	private destroy$ = new Subject<void>();

	protected TicketStatus = TicketStatus;

	ngOnInit() {
		this.loadUsers();
		this.setupFilteredTickets();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private loadUsers(): void {
		this._ticketService.getUsers().pipe(
			takeUntil(this.destroy$),
			tap(users => this.users = users)
		).subscribe();
	}

	private setupFilteredTickets(): void {
		this.tickets$ = this.filterSubject.pipe(
			startWith({}), // Initial load with no filters
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
}

