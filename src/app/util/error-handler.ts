import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { StatusMessageService } from "../service/status-message.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	private errorTitle: string = "";
	private errorMessage: string = "";

	constructor(
		private statusMessageService: StatusMessageService,
		private ngZone: NgZone
	) { }

	handleError(error: Error | HttpErrorResponse) {
		console.log(JSON.stringify(error));
		if (error instanceof HttpErrorResponse) {
			this.handleHttpErrorResponse(error);
		} else {
			this.ngZone.run(() => {
				this.statusMessageService.showErrorMessage(
					"Error",
					JSON.stringify(error.message)
				);
			});
		}
	}

	private handleHttpErrorResponse(error: HttpErrorResponse) {
		let apiError = new ApiError(error);
		console.log(JSON.stringify(error));

		/*
		 * Add switch cases for specific status codes and errorTypes that can be thrown by the REST API.
		 * The default messages should suffice in most cases but specific solutions should be set.
		 */
		let errorType = apiError.getErrorType();
		switch (apiError.getStatus()) {
			case 400: {
				if (errorType.includes("Data integrity violation") || errorType.includes('Entity validation error')) {
					let solution = `This error is caused by not adhering to rules for creating or updating objects.
                    Please refer to the user manual for more info.`;
					apiError.setErrorSolution(solution);
				}
				break;
			}
			case 401: {
				if (errorType.includes("Login error")) {
					apiError.setErrorSolution('');
				}
			}
			default: {
				break;
			}
		}
		let { errorTitle, errorMessage } = apiError.toFormattedErrorMessage();
		this.ngZone.run(() => {
			this.statusMessageService.showErrorMessage(errorTitle, errorMessage);
		});
	}
}

class ApiError {
	private error: HttpErrorResponse;
	private status: number;
	private statusText: string = "";
	private errorType: string = "";
	private errorMessages: string[] = [];
	private errorSolution: string =
		"Try again later. If the problem persists, contact the system administrator.";

	constructor(error: HttpErrorResponse) {
		this.error = error;
		this.status = error.status || 500;
		this.statusText = error.statusText || '';
		this.errorType = error.error.errorType || error.statusText || 'Server error';
		this.errorMessages = error.error.errors || [error.error] || [];
	}

	getErrorType(): string {
		return this.errorType;
	}

	getErrorMessages(): string[] {
		return this.errorMessages;
	}

	getErrorSolution(): string {
		return this.errorSolution;
	}

	getStatus(): number {
		return this.status;
	}

	getStatusText(): string {
		return this.statusText;
	}

	setErrorSolution(errorSolution: string) {
		this.errorSolution = errorSolution;
	}

	toFormattedErrorMessage(): { errorTitle: string; errorMessage: string } {
		let errorTitle = this.errorType;
		let errorMessage = `The server responded with a status of ${this.error.status}: "${this.error.statusText}"\n`;
		if (this.errorMessages.length > 0) {
			errorMessage += 'Error(s): '
			this.errorMessages.forEach(msg => {
				errorMessage = errorMessage + msg + "\n";
			});
		}
		if (this.errorSolution.length > 0) {
			errorMessage += `Solution: ${this.errorSolution}`;
		}
		return { errorTitle, errorMessage };
	}
}
