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
	) {}

	handleError(error: Error | HttpErrorResponse) {
		console.log(error);

		if (error instanceof HttpErrorResponse) {
			this.handleHttpErrorResponse(error);
		} else {
			this.ngZone.run(() => {
				this.statusMessageService.showErrorMessage(
                    'Error',
                    JSON.stringify(error.message)
				);
			});
		}
	}

	private handleHttpErrorResponse(error: HttpErrorResponse) {
		let errorObj = this.getErrorMessages(error);

		switch (error.status) {
			case 400: {
				console.log("Inside 400");

				if (errorObj.error1.includes("Entity validation error")) {
					this.setEntityValidationErrorMessages(error);
				} else if (errorObj.error1.includes("Data Integrity Violation Error")) {
					this.setDataIntegrityViolationErrorMessages(errorObj.error2);
				} else {
					this.errorTitle = "Bad request";
					this.errorMessage =
						'The server responded with a status of 400, "Bad request".';
				}
				break;
			}
			case 401: {
				this.errorTitle = "Unathorized";
				this.errorMessage = "Unauthorized";
				break;
			}
			case 500: {
				this.errorTitle = "Server error";
				this.errorMessage = "Internal server error";
				break;
			}
			default: {
				this.errorTitle = "Server error";
				this.errorMessage = "Unknown server error";
			}
		}
		this.ngZone.run(() => {
			this.statusMessageService.showErrorMessage(
				this.errorTitle,
				this.errorMessage
			);
		});
	}

	private getErrorMessages(error: HttpErrorResponse) {
		let msg = error.error.errors;
		let [errorMsg1, errorMsg2] = msg;
		return { error1: errorMsg1, error2: errorMsg2 };
	}

	private setDataIntegrityViolationErrorMessages(errorMessage: string) {
		this.errorTitle = "Constraint error";
		this.errorMessage = `The server responded with:  ${errorMessage}
                        This error is caused by not adhering to rules for creating or updating objects.
                        Please refer to the user manual for more info.`;
	}

	private setEntityValidationErrorMessages(error) {
		let entityError = this.getEntityValidationErrors(error);
		this.errorTitle = "Entity validation error";
		entityError.errors.forEach(element => {
			this.errorMessage += element + "\n";
		});
	}

	private getEntityValidationErrors(error: HttpErrorResponse) {
		let msg = error.error.errors;
		let [errorMsg1, errorMsg2, ...errorList] = msg;
		return { errorMessage: errorMsg1, errors: errorList };
	}
}
