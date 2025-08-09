import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
	const _messageService = inject(MessageService);

	return next(req).pipe(
		catchError((error) => {
			if (error.status === 500) {
				_messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: 'Couldn’t handle the request, there is a problem on the server.'
				});
			}

            if (error.status === 401) {
                _messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'You are not authorized to perform this action.'
                });
            }

			return throwError(() => error);
		})
	);
};